package nl.fontys.fsd.backend.model;
import jakarta.persistence.*;
import lombok.*;
import nl.fontys.fsd.backend.model.Role;

@Entity
@Table(name = "parent_child")
@Getter @Setter
public class ParentChild {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;

    @ManyToOne
    @JoinColumn(name = "child_id")
    private User child;
}
