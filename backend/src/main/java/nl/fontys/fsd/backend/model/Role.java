package nl.fontys.fsd.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(name = "roles")
public class Role {

    @Id
    private Long id;

    private String name;
}