package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private UserRepository userRepository;

    private JwtService jwtService;

    private static final String TEST_SECRET = "ditiseentestgeheimvanminimaal32tekens!!";
    private static final long EXPIRATION_MS = 3600000L; // 1 uur

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(userRepository);
        // Injecteer de @Value-velden handmatig zonder Spring-context
        ReflectionTestUtils.setField(jwtService, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", EXPIRATION_MS);
    }

    @Test
    void generateToken_shouldReturnToken_withCorrectClaims() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@scouting.nl");
        user.setFirstName("Jan");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@scouting.nl");
        when(userRepository.findByEmail("test@scouting.nl")).thenReturn(Optional.of(user));

        String token = jwtService.generateToken(authentication);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        // Controleer dat de claims correct zijn door ze terug te lezen
        assertEquals(1L, jwtService.getUserIdFromToken(token));
        assertEquals("test@scouting.nl", jwtService.getEmailFromToken(token));
    }

    @Test
    void getUserIdFromToken_shouldReturnCorrectUserId() {
        User user = new User();
        user.setId(42L);
        user.setEmail("user@test.nl");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("user@test.nl");
        when(userRepository.findByEmail("user@test.nl")).thenReturn(Optional.of(user));

        String token = jwtService.generateToken(authentication);
        long userId = jwtService.getUserIdFromToken(token);

        assertEquals(42L, userId);
    }

    @Test
    void getEmailFromToken_shouldReturnCorrectEmail() {
        User user = new User();
        user.setId(1L);
        user.setEmail("femke@scouting.nl");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("femke@scouting.nl");
        when(userRepository.findByEmail("femke@scouting.nl")).thenReturn(Optional.of(user));

        String token = jwtService.generateToken(authentication);
        String email = jwtService.getEmailFromToken(token);

        assertEquals("femke@scouting.nl", email);
    }

    @Test
    void validateToken_shouldReturnTrue_whenTokenIsValid() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@scouting.nl");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@scouting.nl");
        when(userRepository.findByEmail("test@scouting.nl")).thenReturn(Optional.of(user));

        String token = jwtService.generateToken(authentication);

        assertTrue(jwtService.validateToken(token));
    }

    @Test
    void validateToken_shouldReturnFalse_whenTokenIsExpired() {
        // Maak een aparte JwtService met expiratietijd van -1ms (direct verlopen)
        JwtService expiredJwtService = new JwtService(userRepository);
        ReflectionTestUtils.setField(expiredJwtService, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(expiredJwtService, "jwtExpirationMs", -1L);

        User user = new User();
        user.setId(1L);
        user.setEmail("test@scouting.nl");

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@scouting.nl");
        when(userRepository.findByEmail("test@scouting.nl")).thenReturn(Optional.of(user));

        String expiredToken = expiredJwtService.generateToken(authentication);

        assertFalse(jwtService.validateToken(expiredToken));
    }

    @Test
    void validateToken_shouldReturnFalse_whenTokenIsInvalid() {
        assertFalse(jwtService.validateToken("dit.is.geen.geldig.token"));
        assertFalse(jwtService.validateToken(""));
        assertFalse(jwtService.validateToken("eyJhbGciOiJIUzI1NiJ9.nep.handtekening"));
    }
}