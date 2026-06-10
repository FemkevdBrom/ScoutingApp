package nl.fontys.fsd.backend.service;


import nl.fontys.fsd.backend.dto.ScoutingGroupDTO;
import nl.fontys.fsd.backend.repository.ScoutingGroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScoutingGroupService {
    private final ScoutingGroupRepository scoutingGroupRepository;

    public ScoutingGroupService(ScoutingGroupRepository scoutingGroupRepository) {
        this.scoutingGroupRepository = scoutingGroupRepository;
    }

    public List<ScoutingGroupDTO> getAllScoutingGroups() {
        return scoutingGroupRepository.findAll()
                .stream()
                .map(sg -> new ScoutingGroupDTO(sg.getId(),sg.getName(), sg.getCity()))
                .collect(Collectors.toList());
    }
}
