package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
}