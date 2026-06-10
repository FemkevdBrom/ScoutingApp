package nl.fontys.fsd.backend.controller;

import nl.fontys.fsd.backend.dto.ScoutingGroupDTO;
import nl.fontys.fsd.backend.service.ScoutingGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/scouting-groups")
@CrossOrigin(origins = "https://scouting-app-iota.vercel.app")
public class ScoutingGroupController {

    private final ScoutingGroupService scoutingGroupService;

    public ScoutingGroupController(ScoutingGroupService scoutingGroupService) {
        this.scoutingGroupService = scoutingGroupService;
    }

    @GetMapping
    public ResponseEntity<List<ScoutingGroupDTO>> getAllScoutingGroups() {
        return ResponseEntity.ok(scoutingGroupService.getAllScoutingGroups());
    }

}
