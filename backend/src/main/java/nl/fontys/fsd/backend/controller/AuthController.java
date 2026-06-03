package nl.fontys.fsd.backend.controller;


import nl.fontys.fsd.backend.dto.LoginRequestDTO;
import nl.fontys.fsd.backend.dto.UserResponseDTO;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public  AuthController(AuthService authService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());

            UserResponseDTO response = new UserResponseDTO(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }
}
