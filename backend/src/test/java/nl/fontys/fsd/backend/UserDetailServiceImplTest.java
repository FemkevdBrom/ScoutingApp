package nl.fontys.fsd.backend;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        User user = new User();
        user.setId(1L);
        user.setEmail("jan@test.nl");
        user.setPassword("$2a$12$hashedpassword");

        when(userRepository.findByEmail("jan@test.nl")).thenReturn(Optional.of(user));

        UserDetails result = userDetailsService.loadUserByUsername("jan@test.nl");

        assertNotNull(result);
        assertEquals("jan@test.nl", result.getUsername());
        assertEquals("$2a$12$hashedpassword", result.getPassword());
        // Controleer dat de gebruiker de authority "USER" heeft
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("USER")));
    }

    @Test
    void loadUserByUsername_shouldThrowException_whenUserNotFound() {
        when(userRepository.findByEmail("onbekend@test.nl")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                userDetailsService.loadUserByUsername("onbekend@test.nl"));
    }
}