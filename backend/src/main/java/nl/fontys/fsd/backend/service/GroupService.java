package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.dto.GroupDetailsDTO;
import nl.fontys.fsd.backend.dto.GroupInfoDTO;
import nl.fontys.fsd.backend.dto.PersonDTO;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.Period;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<GroupCardDTO> getGroupCardsForUser(Long userId) {

        var groups = groupRepository.findGroupsForUser(userId);

        System.out.println("Aantal gevonden groepen: " + groups.size());

        groups.forEach(g ->
                System.out.println(
                        "Group gevonden: " +
                                g.getId() +
                                " - " +
                                g.getName()
                )
        );

        return groups.stream()
                .map(g -> new GroupCardDTO(
                        g.getId(),
                        g.getName(),
                        g.getDescription(),
                        g.getColorHex()
                ))
                .toList();
    }


    public GroupDetailsDTO getGroupDetails(Long groupId) {

        Group group = groupRepository.findByIdWithUsers(groupId).orElseThrow();

        var leaders = group.getUserGroups().stream()
                .filter(ug ->
                        ug.getRole().getName().equalsIgnoreCase("LEADER") ||
                                ug.getRole().getName().equalsIgnoreCase("TEAMLEADER")
                )
                .map(ug -> {
                    var u = ug.getUser();
                    return new PersonDTO(
                            getFullName(u.getFirstName(), u.getInfix(), u.getLastName()),
                            ug.getRole().getName(),
                            u.getBirthDate(),
                            calculateAge(u.getBirthDate())
                    );
                })
                .toList();

        var members = group.getUserGroups().stream()
                .filter(ug -> ug.getRole().getName().equalsIgnoreCase("MEMBER"))
                .map(ug -> {
                    var u = ug.getUser();
                    return new PersonDTO(
                            getFullName(u.getFirstName(), u.getInfix(), u.getLastName()),
                            null,
                            u.getBirthDate(),
                            calculateAge(u.getBirthDate())
                    );
                })
                .toList();

        String scoutingGroupName = (group.getScoutingGroups() != null && !group.getScoutingGroups().isEmpty())
                ? group.getScoutingGroups().get(0).getName()
                : "-";

        GroupInfoDTO info = new GroupInfoDTO(
                defaultValue(group.getDescription()),
                defaultValue(group.getEmail()),
                group.getGroupType() != null ? group.getGroupType().name() : "-",
                group.getGroupStatus() != null ? group.getGroupStatus().name() : "-",
                defaultValue(group.getGroupAge()),
                scoutingGroupName
        );

        return new GroupDetailsDTO(group.getName(), leaders, members, info);
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
}