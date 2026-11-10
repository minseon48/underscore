package com.kodong.underscore.checklist.service;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.checklist.dto.*;
import com.kodong.underscore.checklist.entity.Checklist;
import com.kodong.underscore.checklist.entity.ChecklistItem;
import com.kodong.underscore.checklist.repository.ChecklistItemRepository;
import com.kodong.underscore.checklist.repository.ChecklistRepository;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import com.kodong.underscore.myplace.repository.MyplaceGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RequiredArgsConstructor
@Service
public class ChecklistService {

    private final UserRepository userRepository;
    private final MyplaceGroupRepository myplaceGroupRepository;
    private final ChecklistRepository checklistRepository;
    private final ChecklistItemRepository checklistItemRepository;

    private record DefaultSection(String title, int sortOrder) {}

    private static final List<DefaultSection> DEFAULT_SECTIONS = List.of(
            new DefaultSection("기획·자금", 0),
            new DefaultSection("행정·신고", 1),
            new DefaultSection("매장·시설", 2),
            new DefaultSection("운영 준비", 3),
            new DefaultSection("결제·정산·보험", 4),
            new DefaultSection("마케팅·오픈", 5)
    );

    public List<ChecklistResponse> getChecklists(String username) {
        User user = findUser(username);
        List<Checklist> checklists = checklistRepository.findAllByUserOrderByIdDesc(user);
        return checklists.stream()
                .map(ChecklistResponse::from)
                .toList();
    }

    @Transactional
    public ChecklistOverview createChecklist(String username, ChecklistCreateRequest request) {
        User user = findUser(username);

        if (request.getGroupId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "그룹을 선택하세요.");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목을 입력해주세요.");
        }

        String title = request.getTitle().trim();
        if (title.length() > 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목은 50자 이하로 입력해주세요.");
        }

        MyplaceGroup group = myplaceGroupRepository.findByIdAndUser(request.getGroupId(), user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));

        Checklist checklist = checklistRepository.save(
                Checklist.create(user, group, title, request.getMemo()));

        seedDefaultSections(checklist);

        return getChecklistOverview(username, checklist.getId());
    }

    @Transactional
    public void deleteChecklist(String username, Long checklistId){
        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user,checklistId);

        List<ChecklistItem> allItems
                = checklistItemRepository.findAllByChecklistOrderBySortOrderAscIdAsc(checklist);

        Map<Long, Long> parentMap = new HashMap<>();

        for(ChecklistItem i : allItems){
            parentMap.put(i.getId(), i.getParent() == null ? null : i.getParent().getId());
        }

        //깊은 노드부터 삭제(자식 -> 부모 -> 루트)
        List<ChecklistItem> ordered = allItems.stream()
                .sorted(Comparator.comparingInt((ChecklistItem i) -> depthOf(i.getId(),parentMap)).reversed())
                .toList();

        for(ChecklistItem item : ordered){
            checklistItemRepository.delete(item);
        }

        checklistRepository.delete(checklist);
    }
    private void seedDefaultSections(Checklist checklist) {
        for (DefaultSection section : DEFAULT_SECTIONS) {
            checklistItemRepository.save(
                    ChecklistItem.createRoot(checklist, section.title(), null, section.sortOrder()));
        }
    }

    public User findUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public ChecklistOverview getChecklistOverview(String username, Long checklistId) {
        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        List<ChecklistItem> allItems =
                checklistItemRepository.findAllByChecklistOrderBySortOrderAscIdAsc(checklist);

        List<ChecklistItem> rootItems = allItems.stream()
                .filter(i -> i.getParent() == null)
                .toList();

        List<ChecklistSectionCard> sections = rootItems.stream()
                .map(root -> toSectionCard(root, allItems))
                .toList();

        List<ChecklistItem> tasks = allItems.stream()
                .filter(i -> i.getParent() != null)
                .toList();

        int total = tasks.size();
        int checked = (int) tasks.stream().filter(ChecklistItem::isChecked).count();
        int percent = total == 0 ? 0 : (int) Math.round(checked * 100.0 / total);

        return ChecklistOverview.builder()
                .id(checklist.getId())
                .title(checklist.getTitle())
                .memo(checklist.getMemo())
                .groupId(checklist.getGroup().getId())
                .groupName(checklist.getGroup().getName())
                .progressPercent(percent)
                .sections(sections)
                .build();
    }

    /** overview API로 대체. 호환용으로 유지 */
    @Deprecated
    @Transactional(readOnly = true)
    public ChecklistDetail getChecklistDetail(String username, Long checklistId) {
        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        List<ChecklistItemResponse> itemResponses = checklistItemRepository
                .findAllByChecklistOrderBySortOrderAscIdAsc(checklist)
                .stream()
                .map(ChecklistItemResponse::from)
                .toList();

        return ChecklistDetail.from(checklist, itemResponses);
    }

    @Transactional
    public ChecklistItemResponse createChecklistItem(
            String username, Long checklistId, ChecklistItemCreateRequest request) {

        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목을 입력해주세요.");
        }

        String title = request.getTitle().trim();
        if (title.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "제목은 200자 이하로 입력해주세요.");
        }

        ChecklistItem parent = null;
        if (request.getParentId() != null) {
            parent = checklistItemRepository.findByIdAndChecklist(request.getParentId(), checklist)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "부모 항목을 찾을 수 없습니다."));
        }

        int sortOrder = (parent == null)
                ? checklistItemRepository.countByChecklistAndParentIsNull(checklist)
                : checklistItemRepository.countByChecklistAndParent(checklist, parent);

        ChecklistItem saved = checklistItemRepository.save(
                parent == null
                        ? ChecklistItem.createRoot(checklist, title, request.getMemo(), sortOrder)
                        : ChecklistItem.createChild(checklist, parent, title, request.getMemo(), sortOrder)
        );

        return ChecklistItemResponse.from(saved);
    }

    private Checklist findChecklistOwnedBy(User user, Long checklistId) {
        return checklistRepository.findByIdAndUser(checklistId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "체크리스트를 찾을 수 없습니다."));
    }

    @Transactional
    public ChecklistItemResponse updateChecklistItem(
            String username, Long checklistId, Long checklistItemId,
            ChecklistItemUpdateRequest updateRequest) {

        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        ChecklistItem item = checklistItemRepository.findByIdAndChecklist(checklistItemId, checklist)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "항목을 찾을 수 없습니다."));

        if (item.getParent() == null && updateRequest.getChecked() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "영역은 체크할 수 없습니다.");
        }

        if (updateRequest.getChecked() != null) {
            item.updateChecked(updateRequest.getChecked());
        }

        if (updateRequest.getMemo() != null) {
            String memo = updateRequest.getMemo().trim();
            if (memo.length() > 500) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메모는 500자 이하로 작성해주세요.");
            }
            item.updateMemo(memo.isEmpty() ? null : memo);
        }

        return ChecklistItemResponse.from(item);
    }

    @Transactional
    public ChecklistSectionCard createSection(String username, Long checklistId, SectionCreateRequest request) {
        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "영역 이름을 입력해주세요.");
        }

        String title = request.getTitle().trim();
        if (title.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "영역 이름은 200자 이하로 입력해주세요.");
        }

        int nextOrder = checklistItemRepository.countByChecklistAndParentIsNull(checklist);

        ChecklistItem saved = checklistItemRepository.save(
                ChecklistItem.createRoot(checklist, title, null, nextOrder)
        );

        return ChecklistSectionCard.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .sortOrder(saved.getSortOrder())
                .totalTaskCount(0)
                .checkedTaskCount(0)
                .progressPercent(0)
                .build();
    }

    private ChecklistSectionCard toSectionCard(ChecklistItem section, List<ChecklistItem> all) {
        List<ChecklistItem> tasks = all.stream()
                .filter(i -> i.getParent() != null)
                .filter(i -> isUnderSection(i, section.getId(), all))
                .filter(i -> all.stream().noneMatch(c ->
                        c.getParent() != null && c.getParent().getId().equals(i.getId())))
                .toList();

        int total = tasks.size();
        int checked = (int) tasks.stream().filter(ChecklistItem::isChecked).count();
        int percent = total == 0 ? 0 : (int) Math.round(checked * 100.0 / total);

        return ChecklistSectionCard.builder()
                .id(section.getId())
                .title(section.getTitle())
                .sortOrder(section.getSortOrder())
                .totalTaskCount(total)
                .checkedTaskCount(checked)
                .progressPercent(percent)
                .build();
    }

    private boolean isUnderSection(ChecklistItem item, Long sectionId, List<ChecklistItem> allItems) {
        Map<Long, Long> parentMap = new HashMap<>();
        for (ChecklistItem i : allItems) {
            parentMap.put(i.getId(), i.getParent() == null ? null : i.getParent().getId());
        }

        Long cur = item.getId();
        while (cur != null) {
            Long parentId = parentMap.get(cur);
            if (parentId == null) {
                return false;
            }
            if (parentId.equals(sectionId)) {
                return true;
            }
            cur = parentId;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public SectionDetail getSectionDetail(String username, Long checklistId, Long sectionId) {
        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        List<ChecklistItem> allItems =
                checklistItemRepository.findAllByChecklistOrderBySortOrderAscIdAsc(checklist);

        ChecklistItem section = allItems.stream()
                .filter(i -> i.getId().equals(sectionId) && i.getParent() == null)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "영역을 찾을 수 없습니다."));

        List<ChecklistItemResponse> items = allItems.stream()
                .filter(i -> i.getParent() != null)
                .filter(i -> isUnderSection(i, sectionId, allItems))
                .map(ChecklistItemResponse::from)
                .toList();

        return SectionDetail.builder()
                .section(toSectionCard(section, allItems))
                .items(items)
                .build();
    }

    @Transactional
    public SectionDetail replaceSectionItems(
            String username, Long checklistId, Long sectionId,
            SectionItemReplaceRequest request) {

        User user = findUser(username);
        Checklist checklist = findChecklistOwnedBy(user, checklistId);

        List<ChecklistItem> all =
                checklistItemRepository.findAllByChecklistOrderBySortOrderAscIdAsc(checklist);

        ChecklistItem section = all.stream()
                .filter(i -> i.getId().equals(sectionId) && i.getParent() == null)
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "영역을 찾을 수 없습니다."));

        Map<Long, Long> parentMap = new HashMap<>();
        for (ChecklistItem i : all) {
            parentMap.put(i.getId(), i.getParent() == null ? null : i.getParent().getId());
        }

        List<ChecklistItem> toDelete = all.stream()
                .filter(i -> i.getParent() != null)
                .filter(i -> isUnderSection(i, sectionId, all))
                .sorted(Comparator.comparingInt((ChecklistItem i) -> depthOf(i.getId(), parentMap)).reversed())
                .toList();

        for (ChecklistItem item : toDelete) {
            checklistItemRepository.delete(item);
        }
        checklistItemRepository.flush();

        List<ChecklistItemBulkRequest> items =
                request.getItems() == null ? List.of() : request.getItems();

        Map<String, ChecklistItem> savedByClientId = new HashMap<>();
        List<ChecklistItemBulkRequest> pending = new ArrayList<>(items);

        while (!pending.isEmpty()) {
            boolean progress = false;
            Iterator<ChecklistItemBulkRequest> iterator = pending.iterator();

            while (iterator.hasNext()) {
                ChecklistItemBulkRequest dto = iterator.next();

                if (dto.getClientId() == null || dto.getClientId().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "clientId가 필요합니다.");
                }
                if (dto.getTitle() == null || dto.getTitle().isBlank()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "항목 제목을 입력해주세요.");
                }
                if (dto.getParentClientId() != null && !savedByClientId.containsKey(dto.getParentClientId())) {
                    continue;
                }

                ChecklistItem parent = dto.getParentClientId() == null
                        ? section
                        : savedByClientId.get(dto.getParentClientId());

                ChecklistItem saved = checklistItemRepository.save(
                        ChecklistItem.createChild(
                                checklist,
                                parent,
                                dto.getTitle().trim(),
                                dto.getMemo(),
                                dto.getSortOrder()
                        )
                );

                savedByClientId.put(dto.getClientId(), saved);
                iterator.remove();
                progress = true;
            }

            if (!progress) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "항목 부모 관계가 올바르지 않습니다.");
            }
        }

        return getSectionDetail(username, checklistId, sectionId);
    }

    private int depthOf(Long id, Map<Long, Long> parentMap) {
        int depth = 0;
        Long cur = id;
        while (cur != null && parentMap.get(cur) != null) {
            cur = parentMap.get(cur);
            depth++;
        }
        return depth;
    }
}
