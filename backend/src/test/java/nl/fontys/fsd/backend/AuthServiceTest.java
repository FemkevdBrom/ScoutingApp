package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.dto.RegisterRequestDTO;
import nl.fontys.fsd.backend.model.ScoutingGroup;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.ScoutingGroupRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.security.JwtService;
import nl.fontys.fsd.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ScoutingGroupRepository scoutingGroupRepository;

    @InjectMocks
    private AuthService authService;

    private Authentication authentication;
    private RegisterRequestDTO validRequest;
    private ScoutingGroup scoutingGroup;

    @BeforeEach
    void setUp() {
        authentication = mock(Authentication.class);

        validRequest = new RegisterRequestDTO();
        validRequest.setFirstName("Jan");
        validRequest.setLastName("Jansen");
        validRequest.setEmail("jan@test.nl");
        validRequest.setPassword("Welkom123!");
        validRequest.setBirthDate(LocalDate.of(2000, 1, 1));
        validRequest.setStreet("Dorpsstraat");
        validRequest.setHouseNumber("1");
        validRequest.setPostalCode("1234AB");
        validRequest.setCity("Eindhoven");
        validRequest.setCountry("Nederland");
        validRequest.setScoutingGroupId(1L);

        scoutingGroup = new ScoutingGroup();
        scoutingGroup.setId(1L);
        scoutingGroup.setName("Scouting Eindhoven");
    }

    //login Test
    @Test
    void login_shouldReturnToken_whenCredentialsAreCorrect() {
        String expectedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtService.generateToken(authentication)).thenReturn(expectedToken);

        String token = authService.login("test@scouting.nl", "Welkom123");

        assertNotNull(token);
        assertEquals(expectedToken, token);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, times(1)).generateToken(authentication);
    }

    @Test
    void login_shouldThrowException_whenAuthenticationFails() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Invalid credentials"));

        assertThrows(RuntimeException.class, () ->
                authService.login("test@scouting.nl", "wrongpassword"));
    }

    //Register Test
    @Test
    void register_shouldSaveUser_WhenEmailNotInUse() {
        when(userRepository.findByEmail("jan@test.nl")).thenReturn(Optional.empty());
        when(scoutingGroupRepository.findById(1L)).thenReturn(Optional.of(scoutingGroup));
        when(passwordEncoder.encode(validRequest.getPassword())).thenReturn("hashedpassword");

        authService.register(validRequest);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_shouldThrowException_whenEmailAlreadyExists() {
        when(userRepository.findByEmail("jan@test.nl")).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () ->
                authService.register(validRequest));

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldThrowException_whenScoutingGroupNotFound() {
        when(userRepository.findByEmail("jan@test.nl")).thenReturn(Optional.empty());
        when(scoutingGroupRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () ->
                authService.register(validRequest));

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldHashPassword_beforeSaving() {
        when(userRepository.findByEmail("jan@test.nl")).thenReturn(Optional.empty());
        when(scoutingGroupRepository.findById(1L)).thenReturn(Optional.of(scoutingGroup));
        when(passwordEncoder.encode("Welkom123!")).thenReturn("$2a$12$hashedvalue");

        authService.register(validRequest);

        verify(passwordEncoder, times(1)).encode("Welkom123!");
        verify(userRepository).save(argThat(user ->
                user.getPassword().equals("$2a$12$hashedvalue")
        ));
    }
}

