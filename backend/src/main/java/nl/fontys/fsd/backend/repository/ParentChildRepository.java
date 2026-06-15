package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.ParentChild;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParentChildRepository extends JpaRepository<ParentChild, Long> {
    List<ParentChild> findByChildId(Long childId);
}
