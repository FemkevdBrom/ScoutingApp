package nl.fontys.fsd.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.dto.GroupDetailsDTO;
import nl.fontys.fsd.backend.dto.GroupUpdateDTO;
import nl.fontys.fsd.backend.dto.MemberActionDTO;
import nl.fontys.fsd.backend.security.JwtService;
import nl.fontys.fsd.backend.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "https://scouting-app-iota.vercel.app")
public class GroupController {

    private final GroupService groupService;
    private final JwtService jwtService;

    public GroupController(GroupService groupService, JwtService jwtService) {
        this.groupService = groupService;
        this.jwtService = jwtService;
    }

    @GetMapping("/my")
    public List<GroupCardDTO> getMyGroups(@RequestParam Long userId) {
        System.out.println("Controller ontvangen userId: " + userId);
        return groupService.getGroupCardsForUser(userId);
    }

    @GetMapping("/{id}")
    public GroupDetailsDTO getGroup(@PathVariable Long id, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        return groupService.getGroupDetails(id, userId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable Long id,
                                         @RequestBody GroupUpdateDTO dto,
                                         HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        groupService.updateGroup(id, userId, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id,
                                       @RequestBody MemberActionDTO dto,
                                       HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        groupService.addMember(id, userId, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable Long id,
                                          @PathVariable Long memberId,
                                          HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        groupService.removeMember(id, userId, memberId);
        return ResponseEntity.ok().build();
    }

    private Long getUserIdFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        return jwtService.getUserIdFromToken(token);
    }
}