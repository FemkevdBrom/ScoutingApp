package nl.fontys.fsd.backend.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import nl.fontys.fsd.backend.model.GroupEnum.*;

@Getter
@Setter
@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @Column(name = "color")
    private String colorHex;

    @Column(name = "group_email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_type")
    private GroupType groupType;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_status")
    private GroupStatus groupStatus;

    @Column(name = "group_age")
    private String groupAge;

    @Enumerated(EnumType.STRING)
    @Column(name = "group_gender")
    private GroupGender groupGender;

    @OneToMany(mappedBy = "group")
    @JsonManagedReference
    private List<UserGroup> userGroups;

    @ManyToMany
    @JoinTable(
            name = "group_scouting_group",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "scouting_group_id"))
    private List<ScoutingGroup> scoutingGroups;
}
