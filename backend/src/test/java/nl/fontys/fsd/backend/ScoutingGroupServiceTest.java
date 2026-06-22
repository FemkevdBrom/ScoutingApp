package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.dto.ScoutingGroupDTO;
import nl.fontys.fsd.backend.model.ScoutingGroup;
import nl.fontys.fsd.backend.repository.ScoutingGroupRepository;
import nl.fontys.fsd.backend.service.ScoutingGroupService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class ScoutingGroupServiceTest {

    @Mock
    private ScoutingGroupRepository scoutingGroupRepository;

    @InjectMocks
    private ScoutingGroupService scoutingGroupService;

    @Test
    void getAllScoutingGroups_shouldReturnAllGroups() {
        ScoutingGroup group1 = new ScoutingGroup();
        group1.setId(1L);
        group1.setName("Scouting Eindhoven");
        group1.setCity("Eindhoven");

        ScoutingGroup group2 = new ScoutingGroup();
        group2.setId(2L);
        group2.setName("Scouting Amsterdam");
        group2.setCity("Amsterdam");

        when(scoutingGroupRepository.findAll()).thenReturn(List.of(group1, group2));

        List<ScoutingGroupDTO> result = scoutingGroupService.getAllScoutingGroups();

        assertEquals(2, result.size());
        verify(scoutingGroupRepository, times(1)).findAll();
    }

    @Test
    void getAllScoutingGroups_shouldReturnEmptyList_whenNoGroups() {
        when(scoutingGroupRepository.findAll()).thenReturn(List.of());

        List<ScoutingGroupDTO> result = scoutingGroupService.getAllScoutingGroups();

        assertTrue(result.isEmpty());
    }

    @Test
    void getAllScoutingGroups_shouldMapToDTO_correctly() {
        ScoutingGroup group = new ScoutingGroup();
        group.setId(1L);
        group.setName("Scouting Eindhoven");
        group.setCity("Eindhoven");

        when(scoutingGroupRepository.findAll()).thenReturn(List.of(group));

        List<ScoutingGroupDTO> result = scoutingGroupService.getAllScoutingGroups();

        assertEquals(1L, result.get(0).getId());
        assertEquals("Scouting Eindhoven", result.get(0).getName());
        assertEquals("Eindhoven", result.get(0).getCity());
    }
}