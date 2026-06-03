package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /* public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    } */

    /*public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!password.equals(user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }*/

    public User login(String email, String password) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);
        System.out.println("Input password: " + password);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("ERROR: User not found with email: " + email);
                    return new RuntimeException("User not found");
                });

        System.out.println("User found in DB!");
        System.out.println("DB password: " + user.getPassword());
        System.out.println("Passwords match? " + password.equals(user.getPassword()));

        if (!password.equals(user.getPassword())) {
            System.out.println("ERROR: Password does not match!");
            throw new RuntimeException("Invalid password");
        }

        System.out.println("LOGIN SUCCESS!");
        return user;
    }
}