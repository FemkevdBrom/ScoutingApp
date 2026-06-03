package nl.fontys.fsd.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name ="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;
    @Column(name = "infix")
    private String infix;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "birth_date")
    private LocalDate birthDate;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(name = "password")
    private String password;
    @Column(name = "street")
    private String street;
    @Column(name = "postal_code")
    private String postalCode;
    @Column(name = "house_number")
    private String houseNumber;
    @Column(name = "city")
    private String city;
    @Column(name = "country")
    private String country;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<UserGroup> userGroups;

}
