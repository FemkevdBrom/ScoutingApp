package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.dto.GroupCardDTO;
import nl.fontys.fsd.backend.model.Group;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class GroupRepositoryIntegrationTest {

    @Autowired
    private GroupRepository groupRepository;

    @Test
    void findGroupsForUser_shouldReturnGroups() {
        List<GroupCardDTO> groups = groupRepository.findGroupsForUser(1L); // pas ID aan
        assertNotNull(groups);
    }

    @Test
    void findByIdWithUsers_shouldFetchWithRelations() {
        Optional<Group> group = groupRepository.findByIdWithUsers(1L);
        assertNotNull(group); // verdere asserts afhankelijk van data
    }
}