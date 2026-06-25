package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.dto.UserRequestDTO;
import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.model.ParentChild;
import nl.fontys.fsd.backend.repository.ParentChildRepository;
import nl.fontys.fsd.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParentChildRepository parentChildRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, ParentChildRepository parentChildRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.parentChildRepository = parentChildRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User createUser(UserRequestDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setInfix(dto.getInfix());
        user.setLastName(dto.getLastName());
        user.setBirthDate(dto.getBirthDate());
        user.setEmail(dto.getEmail());
        user.setStreet(dto.getStreet());
        user.setPostalCode(dto.getPostalCode());
        user.setHouseNumber(dto.getHouseNumber());
        user.setCity(dto.getCity());
        user.setCountry(dto.getCountry());
        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public List<User> getParentsForUser(Long childId) {
        return parentChildRepository.findByChildId(childId)
                .stream()
                .map(ParentChild::getParent)
                .toList();
    }

    public User updateUser(Long id, UserRequestDTO dto) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden"));

        if (dto.getFirstName() != null) existing.setFirstName(dto.getFirstName());
        if (dto.getInfix() != null) existing.setInfix(dto.getInfix());
        if (dto.getLastName() != null) existing.setLastName(dto.getLastName());
        if (dto.getEmail() != null) existing.setEmail(dto.getEmail());
        if (dto.getBirthDate() != null) existing.setBirthDate(dto.getBirthDate());
        if (dto.getStreet() != null) existing.setStreet(dto.getStreet());
        if (dto.getHouseNumber() != null) existing.setHouseNumber(dto.getHouseNumber());
        if (dto.getPostalCode() != null) existing.setPostalCode(dto.getPostalCode());
        if (dto.getCity() != null) existing.setCity(dto.getCity());
        if (dto.getCountry() != null) existing.setCountry(dto.getCountry());

        return userRepository.save(existing);
    }
}