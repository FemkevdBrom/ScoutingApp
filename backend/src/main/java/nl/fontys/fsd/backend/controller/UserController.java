package nl.fontys.fsd.backend.controller;


import nl.fontys.fsd.backend.dto.UserResponseDTO;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.security.JwtService;
import nl.fontys.fsd.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import nl.fontys.fsd.backend.model.User;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;


import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMe(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.substring(7);
        Long userId = jwtService.getUserIdFromToken(token);
        User user = userService.getUser(userId);
        return ResponseEntity.ok(new UserResponseDTO(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(userService.updateUser(id, updatedUser));
    }

    @GetMapping("/{id}/parents")
    public ResponseEntity<List<UserResponseDTO>> getParents(@PathVariable Long id) {
        List<User> parents = userService.getParentsForUser(id);
        List<UserResponseDTO> dtos = parents.stream()
                .map(UserResponseDTO::new)
                .toList();
        return ResponseEntity.ok(dtos);
    }

}

