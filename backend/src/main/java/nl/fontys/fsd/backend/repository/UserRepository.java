package nl.fontys.fsd.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import nl.fontys.fsd.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
