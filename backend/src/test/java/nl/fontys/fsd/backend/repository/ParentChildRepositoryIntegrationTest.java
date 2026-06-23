package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.ParentChild;
import nl.fontys.fsd.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ParentChildRepositoryIntegrationTest {

    @Autowired
    private ParentChildRepository parentChildRepository;

    @Autowired
    private UserRepository userRepository;   // nodig om parent & child aan te maken

    @Test
    void saveAndFindByChildId_shouldWork() {
        // Arrange - Eerst users aanmaken
        User parent = new User();
        parent.setEmail("parent@test.nl");
        parent.setFirstName("Ouder");
        parent.setLastName("Test");
        parent.setPassword("hashed");
        parent.setBirthDate(LocalDate.of(1980, 1, 1));
        User savedParent = userRepository.save(parent);

        User child = new User();
        child.setEmail("child@test.nl");
        child.setFirstName("Kind");
        child.setLastName("Test");
        child.setPassword("hashed");
        child.setBirthDate(LocalDate.of(2010, 5, 15));
        User savedChild = userRepository.save(child);

        // ParentChild relatie maken
        ParentChild pc = new ParentChild();
        pc.setParent(savedParent);
        pc.setChild(savedChild);

        // Act
        ParentChild saved = parentChildRepository.save(pc);
        List<ParentChild> found = parentChildRepository.findByChildId(savedChild.getId());

        // Assert
        assertNotNull(saved.getId());
        assertFalse(found.isEmpty());
        assertEquals(savedChild.getId(), found.get(0).getChild().getId());
    }
}