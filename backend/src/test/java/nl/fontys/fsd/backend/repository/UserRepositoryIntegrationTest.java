package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void saveAndFindByEmail_shouldWork() {
        User user = new User();
        user.setEmail("test.user@fontys.nl");
        user.setPassword("hashedpass123");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setBirthDate(LocalDate.of(2002, 5, 15));

        User saved = userRepository.save(user);
        Optional<User> found = userRepository.findByEmail("test.user@fontys.nl");

        assertNotNull(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("test.user@fontys.nl", found.get().getEmail());
    }

    @Test
    void findByEmail_shouldReturnEmpty_whenNotExists() {
        Optional<User> result = userRepository.findByEmail("bestaatniet@test.nl");
        assertTrue(result.isEmpty());
    }
}