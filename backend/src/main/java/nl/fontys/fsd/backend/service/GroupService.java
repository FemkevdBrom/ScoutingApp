package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.dto.*;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.model.UserGroup;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.GroupRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.Period;

@Service
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository, UserGroupRepostiory userGroupRepository, RoleRepostiory roleRepostiory) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.userGroupRepository = userGroupRepository;
        this.roleRepository = roleRepostiory;
    }

    public List<GroupCardDTO> getGroupCardsForUser(Long userId) {
        var groups = groupRepository.findGroupsForUser(userId);

        System.out.println("Aantal gevonden groepen: " + groups.size());
        groups.forEach(g -> System.out.println("Group gevonden: " + g.getId() + " - " + g.getName()));

        return groups.stream()
                .map(g -> new GroupCardDTO(
                        g.getId(),
                        g.getName(),
                        g.getDescription(),
                        g.getColorHex(),
                        g.getRoleName()
                ))
                .toList();
    }

    public GroupDetailsDTO getGroupDetails(Long groupId, Long userId) {
        Group group = groupRepository.findByIdWithUsers(groupId).orElseThrow();

        // Bepaal de rol van de ingelogde user in deze groep
        String userRole = group.getUserGroups().stream()
                .filter(ug -> ug.getUser().getId().equals(userId))
                .map(ug -> ug.getRole().getName().toUpperCase())
                .findFirst()
                .orElse("NONE");

        // Leiding is zichtbaar voor iedereen
        var leaders = group.getUserGroups().stream()
                .filter(ug -> isLeiderRole(ug.getRole().getName()))
                .map(this::toPersonDTO)
                .toList();

        // Leden alleen zichtbaar voor LEIDER en TEAMLEIDER
        List<PersonDTO> members = List.of();
        if (userRole.equals("LEIDER") || userRole.equals("TEAMLEIDER")) {
            members = group.getUserGroups().stream()
                    .filter(ug -> ug.getRole().getName().equalsIgnoreCase("LID") ||
                            ug.getRole().getName().equalsIgnoreCase("OUDER"))
                    .map(this::toPersonDTO)
                    .toList();
        }

        GroupInfoDTO info = buildGroupInfo(group);

        return new GroupDetailsDTO(group.getName(), leaders, members, info, userRole);
    }

    // ─── Helper methoden ────────────────────────────────────────────

    private boolean isLeiderRole(String role) {
        return role.equalsIgnoreCase("LEIDER") || role.equalsIgnoreCase("TEAMLEIDER");
    }

    private PersonDTO toPersonDTO(UserGroup ug) {
        User u = ug.getUser();
        return new PersonDTO(
                u.getId(),
                getFullName(u.getFirstName(), u.getInfix(), u.getLastName()),
                ug.getRole().getName(),
                u.getBirthDate(),
                calculateAge(u.getBirthDate())
        );
    }

    private GroupInfoDTO buildGroupInfo(Group group) {
        String scoutingGroupName = (group.getScoutingGroups() != null && !group.getScoutingGroups().isEmpty())
                ? group.getScoutingGroups().get(0).getName()
                : "-";

        return new GroupInfoDTO(
                defaultValue(group.getDescription()),
                defaultValue(group.getEmail()),
                group.getGroupType() != null ? group.getGroupType().name() : "-",
                group.getGroupStatus() != null ? group.getGroupStatus().name() : "-",
                defaultValue(group.getGroupAge()),
                scoutingGroupName
        );
    }

    private int calculateAge(LocalDate birthDate) {
        if (birthDate == null) return 0;
        return Period.between(birthDate, LocalDate.now()).getYears();
    }

    private String getFullName(String first, String infix, String last) {
        return java.util.stream.Stream.of(first, infix, last)
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.joining(" "));
    }

    private String defaultValue(String value) {
        return (value == null || value.isBlank()) ? "-" : value;
    }

    public void updateGroup(Long groupId, Long requestingUserId, GroupUpdateDTO groupUpdateDTO) {
        Group group = groupRepository.findByIdWithUsers(groupId).orElseThrow();

        String userRole = group.getUserGroups().stream()
                .filter(ug -> ug.getUser().getId().equals(requestingUserId))
                .map(ug -> ug.getRole().getName().toUpperCase())
                .findFirst()
                .orElse("NONE");
        if (!userRole.equals("TeamLeider")) {
            throw new RuntimeException("Geen toegang, alleen Teamleiders mogen groepgegevens bewerken");
        }
        if (dto.getName() != null) group.setName(dto.getName());
        if (dto.getDescription() != null) group.setDescription(dto.getDescription());
        if (dto.getGroupEmail() != null) group.setEmail(dto.getGroupEmail());
        if (dto.getGroupAge() != null) group.setGroupAge(dto.getGroupAge());
        if (dto.getColor() != null) group.setColorHex(dto.getColor());

        groupRepository.save(group);
    }

    public void addMember(Long groupId, Long requestingUserId, MemberActionDTO dto) {
        Group group = groupRepository.findByIdWithUsers(groupId).orElseThrow();

        String userRole = group.getUserGroups().stream()
                .filter(ug -> ug.getUser().getId().equals(requestingUserId))
                .map(ug -> ug.getRole().getName().toUpperCase())
                .findFirst()
                .orElse("NONE");

        if (!userRole.equals("TeamLeider")) {
            throw new RuntimeException("Geen toegang: alleen teamleiders mogen leden toevoegen");
        }

        boolean alreadyMember = group.getUserGroups().stream()
                .anyMatch(ug -> ug.getUser().getId().equals(dto.getUserId()));

        if (alreadyMember) {
            throw new RuntimeException("Deze gebruiker zit al in de groep");
        }

        User userToAdd = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden"));

        Role role = roleRepository.findByNameIgnoreCase(dto.getRoleName())
                .orElseThrow(() -> new RuntimeException("Rol niet gevonden"));

        UserGroup newUserGroup = new UserGroup();
        newUserGroup.setUser(userToAdd);
        newUserGroup.setGroup(group);
        newUserGroup.setRole(role);

        userGroupRepository.save(newUserGroup);
    }

    public void removeMember(Long groupId, Long requestingUserId, Long memberToRemoveId) {
        Group group = groupRepository.findByIdWithUsers(groupId).orElseThrow();

        String userRole = group.getUserGroups().stream()
                .filter(ug -> ug.getUser().getId().equals(requestingUserId))
                .map(ug -> ug.getRole().getName().toUpperCase())
                .findFirst()
                .orElse("NONE");

        if (!userRole.equals("TeamLeider")) {
            throw new RuntimeException("Geen toegang: alleen teamleiders mogen leden verwijderen");
        }

        UserGroup toRemove = group.getUserGroups().stream()
                .filter(ug -> ug.getUser().getId().equals(memberToRemoveId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lid niet gevonden in deze groep"));

        userGroupRepository.delete(toRemove);
    }
}

