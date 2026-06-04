package nl.fontys.fsd.backend;

import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.service.UserService;
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

    @InjectMocks
    private UserService userService;

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
        User newUser = new User();
        newUser.setPassword("plainpassword");

        when(passwordEncoder.encode("plainpassword")).thenReturn("hashedpassword");

        userService.createUser(newUser);

        assertEquals("hashedpassword", newUser.getPassword());
        verify(userRepository, times(1)).save(newUser);
    }
}