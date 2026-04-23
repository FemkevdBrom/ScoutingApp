package nl.fontys.fsd.backend.controller;


import nl.fontys.fsd.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import nl.fontys.fsd.backend.model.User;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

}

