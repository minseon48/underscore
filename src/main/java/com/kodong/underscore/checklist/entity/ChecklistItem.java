package com.kodong.underscore.checklist.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Entity
public class ChecklistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checklist_id", nullable = false)
    private Checklist checklist;

    //부모 체크리스트 여부 확인, null일 경우 최상위
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private ChecklistItem parent;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String memo;
    private boolean checked;

    //같은 parent 안에서의 순서
    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public static ChecklistItem createRoot(Checklist checklist, String title, String memo, int sortOrder){
        return create(checklist,null,title,memo,sortOrder);
    }


    public static ChecklistItem createChild(
            Checklist checklist,
            ChecklistItem parent,
            String title,
            String memo,
            int sortOrder){

        if(parent == null){
            throw new IllegalArgumentException("parent가 필요합니다.");
        }

        return create(checklist,parent,title,memo,sortOrder);
    }

    private static ChecklistItem create(
            Checklist checklist, ChecklistItem parent,
            String title, String memo, int sortOrder){

        ChecklistItem item = new ChecklistItem();

        item.checklist = checklist;
        item.parent = parent;
        item.title = title;
        item.memo = memo;
        item.checked = false;
        item.createdAt = LocalDateTime.now();
        item.updatedAt = item.createdAt;
        item.sortOrder = sortOrder;

        return item;
    }



    public void updateChecked(boolean checked){
        this.checked = checked;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateMemo(String memo){
        this.memo = memo;
        this.updatedAt = LocalDateTime.now();
    }
}
