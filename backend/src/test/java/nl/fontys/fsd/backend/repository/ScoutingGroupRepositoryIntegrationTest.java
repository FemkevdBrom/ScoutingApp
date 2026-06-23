package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.ScoutingGroup;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ScoutingGroupRepositoryIntegrationTest {

    @Autowired
    private ScoutingGroupRepository scoutingGroupRepository;

    @Test
    void saveAndFindById_shouldWork() {
        // Arrange
        ScoutingGroup group = new ScoutingGroup();
        group.setName("Scoutinggroep De Pioniers");
        group.setCity("Eindhoven");

        // Act
        ScoutingGroup saved = scoutingGroupRepository.save(group);

        // Assert
        assertNotNull(saved.getId(), "JPA moet een ID genereren");
        assertTrue(scoutingGroupRepository.findById(saved.getId()).isPresent());
        assertEquals("Scoutinggroep De Pioniers", saved.getName());
        assertEquals("Eindhoven", saved.getCity());
    }
}