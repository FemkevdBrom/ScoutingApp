package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.dto.GroupDetailsDTO;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.model.UserGroup;
import nl.fontys.fsd.backend.model.Role;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.GroupRepository;
import nl.fontys.fsd.backend.service.GroupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    private GroupService groupService;

    private Group testGroup;

    @BeforeEach
    void setUp() {
        groupService = new GroupService(groupRepository);

        // Basis groep
        testGroup = new Group();
        testGroup.setId(10L);
        testGroup.setName("Welpen Groep A");
        testGroup.setDescription("Leuke actieve groep");
        testGroup.setColorHex("#FF5733");
    }

    @Test
    void getGroupCardsForUser_shouldReturnGroupCards() {
        when(groupRepository.findGroupsForUser(1L)).thenReturn(List.of(testGroup));

        List<GroupCardDTO> result = groupService.getGroupCardsForUser(1L);

        assertEquals(1, result.size());
        GroupCardDTO card = result.get(0);
        assertEquals(10L, card.getId());
        assertEquals("Welpen Groep A", card.getName());
        assertEquals("#FF5733", card.getColorHex());
    }

    @Test
    void getGroupCardsForUser_shouldReturnEmptyList_whenNoGroups() {
        when(groupRepository.findGroupsForUser(999L)).thenReturn(List.of());

        List<GroupCardDTO> result = groupService.getGroupCardsForUser(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getGroupDetails_shouldReturnGroupDetails() {
        // Maak minimale setup voor getGroupDetails
        User testUser = new User();
        testUser.setFirstName("Jan");
        testUser.setLastName("Test");
        testUser.setBirthDate(LocalDate.of(2010, 5, 15));

        Role leaderRole = new Role();
        leaderRole.setName("LEADER");

        UserGroup userGroup = new UserGroup();
        userGroup.setUser(testUser);
        userGroup.setRole(leaderRole);

        testGroup.setUserGroups(List.of(userGroup));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupDetailsDTO result = groupService.getGroupDetails(10L);

        assertNotNull(result);
        assertEquals("Welpen Groep A", result.getGroupName());
        assertNotNull(result.getLeaders());
    }
}