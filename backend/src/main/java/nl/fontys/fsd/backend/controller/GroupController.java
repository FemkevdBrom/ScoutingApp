package nl.fontys.fsd.backend.controller;

import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.dto.GroupDetailsDTO;
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
    public List<GroupCardDTO> getMyGroups(@RequestParam Long userId) {
        System.out.println("Controller ontvangen userId: " + userId);
        return groupService.getGroupCardsForUser(userId);
    }

    @GetMapping("/{id}")
    public GroupDetailsDTO getGroup(@PathVariable Long id){
        return groupService.getGroupDetails(id);
    }

    @GetMapping("/{id}/details")
    public GroupDetailsDTO getGroupDetails(@PathVariable Long id) {
        return groupService.getGroupDetails(id);
    }

}
