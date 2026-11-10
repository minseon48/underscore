package com.kodong.underscore.checklist.repository;

import com.kodong.underscore.checklist.entity.Checklist;
import com.kodong.underscore.checklist.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChecklistItemRepository extends JpaRepository<ChecklistItem,Long> {
    List<ChecklistItem> findAllByChecklistOrderBySortOrderAscIdAsc(Checklist checklist);
    List<ChecklistItem> findAllByChecklistAndParentIsNullOrderBySortOrderAscIdAsc(Checklist checklist);
    Optional<ChecklistItem> findByIdAndChecklist(Long id, Checklist checklist);

    int countByChecklistAndParent(Checklist checklist, ChecklistItem parent);
    int countByChecklistAndParentIsNull(Checklist checklist);

    void deleteAllByChecklistAndParentIsNotNull(Checklist checklist);

    void deleteAllByChecklist(Checklist checklist);
}
