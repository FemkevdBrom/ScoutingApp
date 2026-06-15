package nl.fontys.fsd.backend.service;

import nl.fontys.fsd.backend.model.User;
import nl.fontys.fsd.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import nl.fontys.fsd.backend.model.ParentChild;
import nl.fontys.fsd.backend.repository.ParentChildRepository;

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

    public User createUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public List<User> getParentsForUser(Long childId) {
        return parentChildRepository.findByChildId(childId)
                .stream()
                .map(pc -> pc.getParent())
                .toList();
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gebruiker niet gevonden"));

        if (updatedUser.getFirstName() != null) existing.setFirstName(updatedUser.getFirstName());
        if (updatedUser.getInfix() != null) existing.setInfix(updatedUser.getInfix());
        if (updatedUser.getLastName() != null) existing.setLastName(updatedUser.getLastName());
        if (updatedUser.getEmail() != null) existing.setEmail(updatedUser.getEmail());
        if (updatedUser.getBirthDate() != null) existing.setBirthDate(updatedUser.getBirthDate());
        if (updatedUser.getStreet() != null) existing.setStreet(updatedUser.getStreet());
        if (updatedUser.getHouseNumber() != null) existing.setHouseNumber(updatedUser.getHouseNumber());
        if (updatedUser.getPostalCode() != null) existing.setPostalCode(updatedUser.getPostalCode());
        if (updatedUser.getCity() != null) existing.setCity(updatedUser.getCity());
        if (updatedUser.getCountry() != null) existing.setCountry(updatedUser.getCountry());

        return userRepository.save(existing);
    }
}

