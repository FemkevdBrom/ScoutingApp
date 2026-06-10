package nl.fontys.fsd.backend.model;

import jakarta.persistence.*;
import lombok.Setter;
import lombok.Getter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "scouting_group")
public class ScoutingGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String city;

    @ManyToMany(mappedBy = "scoutingGroups")
    private List<User> users;

    @ManyToMany(mappedBy = "scoutingGroups")
    private List<Group> groups;
}
