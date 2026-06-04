package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@scouting.nl");
        testUser.setPassword("secret123");
    }

    @Test
    void login_shouldReturnUser_whenCredentialsAreCorrect() {
        when(userRepository.findByEmail("test@scouting.nl")).thenReturn(Optional.of(testUser));

        User result = authService.login("test@scouting.nl", "secret123");

        assertNotNull(result);
        assertEquals("test@scouting.nl", result.getEmail());
        verify(userRepository, times(1)).findByEmail("test@scouting.nl");
    }

    @Test
    void login_shouldThrowException_whenUserNotFound() {
        when(userRepository.findByEmail("unknown@scouting.nl")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                authService.login("unknown@scouting.nl", "password"));
    }

    @Test
    void login_shouldThrowException_whenPasswordIsWrong() {
        when(userRepository.findByEmail("test@scouting.nl")).thenReturn(Optional.of(testUser));

        assertThrows(RuntimeException.class, () ->
                authService.login("test@scouting.nl", "wrongpassword"));
    }
}