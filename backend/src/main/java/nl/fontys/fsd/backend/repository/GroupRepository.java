package nl.fontys.fsd.backend.repository;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.model.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    @Query(value = """
        SELECT g.*
        FROM groups g
        JOIN user_groups ug ON g.id = ug.group_id
        WHERE ug.user_id = :userId
    """, nativeQuery = true)
    List<Group> findGroupsByUserId(@Param("userId") Long userId);
}