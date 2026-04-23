package nl.fontys.fsd.backend.controller;

import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.repository.GroupRepository;
import nl.fontys.fsd.backend.service.GroupService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")

@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/my")
    public List<Group> getMyGroups() {
        //hardcoded for now
        Long userId =1L;

        return groupService.getGroupsForUser(userId);
    }
}
