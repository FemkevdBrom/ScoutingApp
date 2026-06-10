package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.dto.RegisterRequestDTO;
import nl.fontys.fsd.backend.model.ScoutingGroup;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.ScoutingGroupRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import nl.fontys.fsd.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ScoutingGroupRepository scoutingGroupRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       ScoutingGroupRepository scoutingGroupRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.scoutingGroupRepository = scoutingGroupRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return jwtService.generateToken(authentication);
    }

    public void register(RegisterRequestDTO request) {
        // Controleer of email al in gebruik is
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Er bestaat al een account met dit emailadres");
        }

        // Haal de scoutinggroep op
        ScoutingGroup scoutingGroup = scoutingGroupRepository.findById(request.getScoutingGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Scoutinggroep niet gevonden"));

        // Maak de nieuwe user aan
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setInfix(request.getInfix());
        user.setLastName(request.getLastName());
        user.setBirthDate(request.getBirthDate());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setStreet(request.getStreet());
        user.setHouseNumber(request.getHouseNumber());
        user.setPostalCode(request.getPostalCode());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setScoutingGroups(List.of(scoutingGroup));

        userRepository.save(user);
    }
}