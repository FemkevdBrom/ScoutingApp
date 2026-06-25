package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.dto.UserRequestDTO;
import nl.fontys.fsd.backend.model.ParentChild;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.ParentChildRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ParentChildRepository parentChildRepository;

    @InjectMocks
    private UserService userService;

    private User existingUser;

    @BeforeEach
    void setUp() {
        existingUser = new User();
        existingUser.setId(5L);
        existingUser.setFirstName("Jan");
        existingUser.setLastName("Jansen");
        existingUser.setEmail("jan@test.nl");
        existingUser.setPassword("hashedpassword");
        existingUser.setStreet("Dorpsstraat");
        existingUser.setHouseNumber("1");
        existingUser.setPostalCode("1234AB");
        existingUser.setCity("Eindhoven");
        existingUser.setCountry("Nederland");
    }

    @Test
    void getAllUsers_shouldReturnAllUsers() {
        List<User> users = List.of(new User(), new User());
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getUser_shouldReturnUser_whenExists() {
        User user = new User();
        user.setId(5L);
        when(userRepository.findById(5L)).thenReturn(Optional.of(user));

        User result = userService.getUser(5L);

        assertNotNull(result);
        assertEquals(5L, result.getId());
    }

    @Test
    void createUser_shouldHashPassword_andSaveUser() {
        UserRequestDTO dto = new UserRequestDTO();
        dto.setPassword("plainpassword");
        dto.setFirstName("Jan");
        dto.setEmail("jan@test.nl");

        when(passwordEncoder.encode("plainpassword")).thenReturn("hashedpassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User result = userService.createUser(dto);

        assertEquals("hashedpassword", result.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getUser_shouldReturnNull_whenNotExists() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        User result = userService.getUser(999L);

        assertNull(result);
    }

    @Test
    void updateUser_shouldUpdateFields_whenUserExists() {
        UserRequestDTO dto = new UserRequestDTO();
        dto.setFirstName("Piet");
        dto.setCity("Amsterdam");

        when(userRepository.findById(5L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        userService.updateUser(5L, dto);

        assertEquals("Piet", existingUser.getFirstName());
        assertEquals("Amsterdam", existingUser.getCity());
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void updateUser_shouldNotOverwriteFields_whenValuesAreNull() {
        UserRequestDTO dto = new UserRequestDTO();
        dto.setFirstName(null);
        dto.setLastName(null);

        when(userRepository.findById(5L)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        userService.updateUser(5L, dto);

        assertEquals("Jan", existingUser.getFirstName());
        assertEquals("Jansen", existingUser.getLastName());
    }

    @Test
    void getParentsForUser_shouldReturnParents() {
        User parent = new User();
        parent.setId(10L);
        parent.setFirstName("Ouder");

        ParentChild parentChild = new ParentChild();
        parentChild.setParent(parent);

        when(parentChildRepository.findByChildId(5L)).thenReturn(List.of(parentChild));

        List<User> result = userService.getParentsForUser(5L);

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());
    }

    @Test
    void getParentsForUser_shouldReturnEmptyList_whenNoParents() {
        when(parentChildRepository.findByChildId(5L)).thenReturn(List.of());

        List<User> result = userService.getParentsForUser(5L);

        assertTrue(result.isEmpty());
    }
}