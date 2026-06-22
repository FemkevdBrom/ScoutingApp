package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.dto.GroupDetailsDTO;
import nl.fontys.fsd.backend.dto.GroupUpdateDTO;
import nl.fontys.fsd.backend.dto.MemberActionDTO;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.model.UserGroup;
import nl.fontys.fsd.backend.model.Role;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.GroupRepository;
import nl.fontys.fsd.backend.repository.RoleRepository;
import nl.fontys.fsd.backend.repository.UserGroupRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.service.GroupService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private UserGroupRepository userGroupRepository;

    private GroupService groupService;

    private Group testGroup;
    private User teamleider;
    private User leider;
    private User lid;
    private Role teamleiderRole;
    private Role leiderRole;
    private Role lidRole;

    @BeforeEach
    void setUp() {
        groupService = new GroupService(groupRepository, userRepository, roleRepository, userGroupRepository);

        // Rollen
        teamleiderRole = new Role();
        teamleiderRole.setName("TEAMLEIDER");

        leiderRole = new Role();
        leiderRole.setName("LEIDER");

        lidRole = new Role();
        lidRole.setName("LID");

        // Gebruikers
        teamleider = new User();
        teamleider.setId(1L);
        teamleider.setFirstName("Femke");
        teamleider.setLastName("Brom");
        teamleider.setBirthDate(LocalDate.of(2000, 1, 1));

        leider = new User();
        leider.setId(2L);
        leider.setFirstName("Piet");
        leider.setLastName("Jansen");
        leider.setBirthDate(LocalDate.of(2001, 3, 15));

        lid = new User();
        lid.setId(3L);
        lid.setFirstName("Jan");
        lid.setLastName("Jansen");
        lid.setBirthDate(LocalDate.of(2010, 5, 20));

        // Groep
        testGroup = new Group();
        testGroup.setId(10L);
        testGroup.setName("Explorers");
        testGroup.setDescription("Leuke groep");
        testGroup.setColorHex("#FF5733");
    }

    private UserGroup createUserGroup(User user, Role role) {
        UserGroup ug = new UserGroup();
        ug.setUser(user);
        ug.setRole(role);
        ug.setGroup(testGroup);
        return ug;
    }

    @Test
    void getGroupCardsForUser_shouldReturnGroupCards() {
        GroupCardDTO card = new GroupCardDTO(10L, "Explorers", "Leuke groep", "#FF5733", "LID");
        when(groupRepository.findGroupsForUser(1L)).thenReturn(List.of(card));

        List<GroupCardDTO> result = groupService.getGroupCardsForUser(1L);

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());
        assertEquals("Explorers", result.get(0).getName());
    }

    @Test
    void getGroupCardsForUser_shouldReturnEmptyList_whenNoGroups() {
        when(groupRepository.findGroupsForUser(999L)).thenReturn(List.of());

        List<GroupCardDTO> result = groupService.getGroupCardsForUser(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getGroupDetails_shouldReturnGroupDetails() {
        UserGroup ugLeider = createUserGroup(leider, leiderRole);
        testGroup.setUserGroups(List.of(ugLeider));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupDetailsDTO result = groupService.getGroupDetails(10L, 2L);

        assertNotNull(result);
        assertEquals("Explorers", result.getGroupName());
        assertNotNull(result.getLeaders());
    }

    @Test
    void getGroupDetails_asTeamleider_shouldReturnMembers() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        UserGroup ugLid = createUserGroup(lid, lidRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider, ugLid)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupDetailsDTO result = groupService.getGroupDetails(10L, 1L);

        assertNotNull(result.getMembers());
        assertEquals(1, result.getMembers().size());
        assertEquals("TEAMLEIDER", result.getUserRole());
    }

    @Test
    void getGroupDetails_asLid_shouldNotReturnMembers() {
        UserGroup ugLid = createUserGroup(lid, lidRole);
        UserGroup ugLeider = createUserGroup(leider, leiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugLid, ugLeider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupDetailsDTO result = groupService.getGroupDetails(10L, 3L);

        assertTrue(result.getMembers().isEmpty());
        assertEquals("LID", result.getUserRole());
    }

    @Test
    void getGroupDetails_shouldReturnNone_whenUserNotInGroup() {
        UserGroup ugLeider = createUserGroup(leider, leiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugLeider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupDetailsDTO result = groupService.getGroupDetails(10L, 999L);

        assertEquals("NONE", result.getUserRole());
        assertTrue(result.getMembers().isEmpty());
    }

    @Test
    void updateGroup_shouldUpdateFields_whenTeamleider() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupUpdateDTO dto = new GroupUpdateDTO();
        dto.setName("Nieuwe Naam");
        dto.setDescription("Nieuwe beschrijving");

        groupService.updateGroup(10L, 1L, dto);

        assertEquals("Nieuwe Naam", testGroup.getName());
        assertEquals("Nieuwe beschrijving", testGroup.getDescription());
        verify(groupRepository, times(1)).save(testGroup);
    }

    @Test
    void updateGroup_shouldThrowException_whenNotTeamleider() {
        UserGroup ugLid = createUserGroup(lid, lidRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugLid)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        GroupUpdateDTO dto = new GroupUpdateDTO();
        dto.setName("Hacked naam");

        assertThrows(RuntimeException.class, () ->
                groupService.updateGroup(10L, 3L, dto));

        verify(groupRepository, never()).save(any());
    }

    @Test
    void updateGroup_shouldThrowException_whenGroupNotFound() {
        when(groupRepository.findByIdWithUsers(999L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () ->
                groupService.updateGroup(999L, 1L, new GroupUpdateDTO()));
    }


    @Test
    void addMember_shouldAddMember_whenTeamleider() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider)));

        User newUser = new User();
        newUser.setId(99L);

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));
        when(userRepository.findById(99L)).thenReturn(Optional.of(newUser));
        when(roleRepository.findByNameIgnoreCase("LID")).thenReturn(Optional.of(lidRole));

        MemberActionDTO dto = new MemberActionDTO();
        dto.setUserId(99L);
        dto.setRoleName("LID");

        groupService.addMember(10L, 1L, dto);

        verify(userGroupRepository, times(1)).save(any(UserGroup.class));
    }

    @Test
    void addMember_shouldThrowException_whenNotTeamleider() {
        UserGroup ugLid = createUserGroup(lid, lidRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugLid)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        MemberActionDTO dto = new MemberActionDTO();
        dto.setUserId(99L);
        dto.setRoleName("LID");

        assertThrows(RuntimeException.class, () ->
                groupService.addMember(10L, 3L, dto));

        verify(userGroupRepository, never()).save(any());
    }

    @Test
    void addMember_shouldThrowException_whenAlreadyMember() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        UserGroup ugLid = createUserGroup(lid, lidRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider, ugLid)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        MemberActionDTO dto = new MemberActionDTO();
        dto.setUserId(3L); // lid.getId() = 3L, zit al in de groep
        dto.setRoleName("LID");

        assertThrows(RuntimeException.class, () ->
                groupService.addMember(10L, 1L, dto));

        verify(userGroupRepository, never()).save(any());
    }

    @Test
    void addMember_shouldThrowException_whenUserNotFound() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        MemberActionDTO dto = new MemberActionDTO();
        dto.setUserId(999L);
        dto.setRoleName("LID");

        assertThrows(RuntimeException.class, () ->
                groupService.addMember(10L, 1L, dto));
    }

    @Test
    void addMember_shouldThrowException_whenRoleNotFound() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider)));

        User newUser = new User();
        newUser.setId(99L);

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));
        when(userRepository.findById(99L)).thenReturn(Optional.of(newUser));
        when(roleRepository.findByNameIgnoreCase("ONBEKENDEROL")).thenReturn(Optional.empty());

        MemberActionDTO dto = new MemberActionDTO();
        dto.setUserId(99L);
        dto.setRoleName("ONBEKENDEROL");

        assertThrows(RuntimeException.class, () ->
                groupService.addMember(10L, 1L, dto));
    }

    @Test
    void removeMember_shouldRemoveMember_whenTeamleider() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        UserGroup ugLid = createUserGroup(lid, lidRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider, ugLid)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        groupService.removeMember(10L, 1L, 3L);

        verify(userGroupRepository, times(1)).delete(ugLid);
    }

    @Test
    void removeMember_shouldThrowException_whenNotTeamleider() {
        UserGroup ugLid = createUserGroup(lid, lidRole);
        UserGroup ugLeider = createUserGroup(leider, leiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugLid, ugLeider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        assertThrows(RuntimeException.class, () ->
                groupService.removeMember(10L, 3L, 2L));

        verify(userGroupRepository, never()).delete(any());
    }


    @Test
    void removeMember_shouldThrowException_whenMemberNotInGroup() {
        UserGroup ugTeamleider = createUserGroup(teamleider, teamleiderRole);
        testGroup.setUserGroups(new ArrayList<>(List.of(ugTeamleider)));

        when(groupRepository.findByIdWithUsers(10L)).thenReturn(Optional.of(testGroup));

        assertThrows(RuntimeException.class, () ->
                groupService.removeMember(10L, 1L, 999L));

        verify(userGroupRepository, never()).delete(any());
    }

}