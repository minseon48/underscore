package com.kodong.underscore.myplace.service;

import com.kodong.underscore.auth.entity.User;
import com.kodong.underscore.auth.repository.UserRepository;
import com.kodong.underscore.myplace.dto.MyplaceGroupResponse;
import com.kodong.underscore.myplace.entity.MyplaceGroup;
import com.kodong.underscore.myplace.repository.MyplaceGroupRepository;
import com.kodong.underscore.myplace.repository.MyplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyplaceGroupService {
    private static final int MAX_GROUP_NAME_LENGTH = 30;

    private final MyplaceGroupRepository myplaceGroupRepository;
    private final MyplaceRepository myplaceRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<MyplaceGroupResponse> getGroups(String username){
        User user = findUser(username);

        return findGroupsWithDefault(user).stream()
                .map(group -> MyplaceGroupResponse.from(group, myplaceRepository.countByGroup(group)))
                .toList();
    }

    @Transactional
    public MyplaceGroupResponse createGroup(String username, String groupName){
        User user = findUser(username);
        String name = validateGroupName(groupName);

        findGroupsWithDefault(user);

        if(myplaceGroupRepository.existsByUserAndName(user,name)){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"이미 존재하는 그룹 이름입니다.");
        }

        MyplaceGroup newGroup = myplaceGroupRepository.save(MyplaceGroup.createGroup(user,name));

        return MyplaceGroupResponse.from(newGroup, myplaceRepository.countByGroup(newGroup));
    }

    @Transactional
    public void deleteGroup(String username, Long groupId){
        User user = findUser(username);

        if(!myplaceGroupRepository.existsByUserAndId(user,groupId)){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다.");
        }

        MyplaceGroup myplaceGroup = myplaceGroupRepository.findByIdAndUser(groupId, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹을 찾을 수 없습니다."));

        if(myplaceGroup.isDefaultGroup()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"기본 그룹은 삭제할 수 없습니다.");
        }

        myplaceRepository.deleteAllByGroup(myplaceGroup);
        myplaceGroupRepository.deleteById(groupId);
    }

    private String validateGroupName(String groupName) {
        if(groupName == null || groupName.isBlank()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "그룹 이름을 입력해주세요.");
        }

        String trimmedName = groupName.trim();//앞뒤 공백제거

        if(trimmedName.length() > MAX_GROUP_NAME_LENGTH){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "그룹 이름은 30자 이하로 입력해주세요.");
        }

        return trimmedName;
    }

    private List<MyplaceGroup> findGroupsWithDefault(User user) {
        List<MyplaceGroup> groups = myplaceGroupRepository.findAllByUserOrderByIdAsc(user);

        if(!groups.isEmpty()) return groups;

        return List.of(myplaceGroupRepository.save(MyplaceGroup.createDefault(user)));
    }



    private User findUser(String username) {
        User user = userRepository.findByUsername(username);

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"사용자를 찾을 수 없습니다.");
        }

        return user;
    }
}
