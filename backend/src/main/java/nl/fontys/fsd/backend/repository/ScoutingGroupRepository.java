package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.ScoutingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoutingGroupRepository extends JpaRepository<ScoutingGroup, Long> {
}
