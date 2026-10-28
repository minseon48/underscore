package com.kodong.underscore.myplace.service;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.map.dto.AdministrativeDistrictSearchResponse;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.myplace.dto.MyplaceItemResponse;
import com.kodong.underscore.myplace.dto.MyplaceListResponse;
import com.kodong.underscore.myplace.dto.MyplaceCreateRequest;
import com.kodong.underscore.myplace.entity.Myplace;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import com.kodong.underscore.myplace.repository.MyplaceGroupRepository;
import com.kodong.underscore.myplace.repository.MyplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class MyplaceService {

    private static final int MAX_MEMO_LENGTH = 100;
    private static final int MAX_PLACE_COUNT = 100;

    private final MyplaceRepository myplaceRepository;
    private final MyplaceGroupRepository myplaceGroupRepository;
    private final UserRepository userRepository;
    private final AdministrativeDistrictRepository administrativeDistrictRepository;

    @Transactional(readOnly = true)
    public MyplaceListResponse getPlaces(String username, Long groupId, int page, int size) {
        User user = findUser(username);
        MyplaceGroup myplaceGroup = findGroupOwnedBy(user, groupId);

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Myplace> places = myplaceRepository.findAllByUserAndGroup(user, myplaceGroup, pageable);

        List<MyplaceItemResponse> items = places.getContent().stream()
                .map(MyplaceItemResponse::from)
                .toList();

        return MyplaceListResponse.builder()
                .count(items.size())
                .totalCount(places.getTotalElements())
                .items(items)
                .build();
    }

    @Transactional
    public MyplaceItemResponse createPlaces(String username, MyplaceCreateRequest request) {
        User user = findUser(username);
        validateCreateRequest(request);

        MyplaceGroup group = findGroupOwnedBy(user, request.getGroupId());

        if (myplaceRepository.countByGroup(group) >= MAX_PLACE_COUNT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "그룹에 더 이상 장소를 추가할 수 없습니다.");
        }

        String code = request.getAdministrativeCode().trim();

        if (myplaceRepository.existsByGroupAndAdministrativeCode(group, code)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 장소입니다.");
        }

        String memo = normalizedMemo(request.getMemo());

        Myplace myplace = myplaceRepository.save(
                Myplace.create(
                        user,
                        group,
                        code,
                        request.getAddressName().trim(),
                        request.getCoordinates().getLatitude(),
                        request.getCoordinates().getLongitude(),
                        memo
                )
        );

        return MyplaceItemResponse.from(myplace);
    }

    @Transactional
    public void deleteMyplace(String username, Long myplaceId){
        User user = findUser(username);

        if(!myplaceRepository.existsByUserAndId(user,myplaceId)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당하는 내 장소를 찾을 수 없습니다.");
        }

        myplaceRepository.deleteById(myplaceId);

    }
    private void validateCreateRequest(MyplaceCreateRequest request) {
        if (request.getGroupId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "그룹을 선택해주세요.");
        }
        if (request.getAdministrativeCode() == null || request.getAdministrativeCode().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "행정동을 선택해주세요.");
        }
        if (request.getAddressName() == null || request.getAddressName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "주소명이 없습니다.");
        }
        if (request.getCoordinates() == null
                || request.getCoordinates().getLatitude() == null
                || request.getCoordinates().getLongitude() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "좌표 정보가 없습니다.");
        }
    }

    private MyplaceGroup findGroupOwnedBy(User user, Long groupId) {
        return myplaceGroupRepository.findByIdAndUser(groupId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));
    }

    private User findUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
        }
        return user;
    }

    private String normalizedMemo(String memo) {
        if (memo == null) {
            return null;
        }

        String trimmedMemo = memo.trim();
        if (trimmedMemo.length() > MAX_MEMO_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메모는 100자 이하로 입력해주세요.");
        }

        return trimmedMemo.isEmpty() ? null : trimmedMemo;
    }

    @Transactional
    public List<AdministrativeDistrictSearchResponse> searchAdministrativeDistricts(String keyword){
        if(keyword == null || keyword.isBlank()){
            return List.of();
        }

        return administrativeDistrictRepository.searchByKeyword(
                keyword.trim(),
                PageRequest.of(0,20)
        ).stream().map(AdministrativeDistrictSearchResponse::from)
                .toList();
    }
}
