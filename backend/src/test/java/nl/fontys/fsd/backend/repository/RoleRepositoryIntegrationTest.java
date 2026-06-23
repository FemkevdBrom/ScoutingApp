package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class RoleRepositoryIntegrationTest {

    @Autowired
    private RoleRepository roleRepository;

    @Test
    void saveAndFindByNameIgnoreCase_shouldWork() {
        // Arrange
        Role role = new Role();
        role.setId(999L);
        role.setName("SCOUTER");

        // Act
        Role saved = roleRepository.save(role);
        Optional<Role> found = roleRepository.findByNameIgnoreCase("scouter");

        // Assert
        assertNotNull(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("SCOUTER", found.get().getName());
    }

    @Test
    void findByNameIgnoreCase_shouldReturnEmpty_whenNotExists() {
        Optional<Role> result = roleRepository.findByNameIgnoreCase("nietbestaand");
        assertTrue(result.isEmpty());
    }
}