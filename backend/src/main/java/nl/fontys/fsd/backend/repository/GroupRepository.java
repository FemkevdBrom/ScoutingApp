package nl.fontys.fsd.backend.repository;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.model.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    @Query(value = """
SELECT g.*
FROM groups g
JOIN user_groups ug ON ug.group_id = g.id
WHERE ug.user_id = :userId
ORDER BY g.name
""", nativeQuery = true)
    List<Group> findGroupsForUser(@Param("userId") Long userId);

@Query("""
    SELECT g FROM Group g
    LEFT JOIN FETCH g.userGroups ug
    LEFT JOIN FETCH ug.user
    LEFT JOIN FETCH ug.role
    WHERE g.id = :id
    """)
Optional<Group> findByIdWithUsers(@Param("id") Long id);
}