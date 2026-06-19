package nl.fontys.fsd.backend.dto;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter ;
@Getter
@Setter

public class PersonDTO {
    private Long id;
    private String fullName;
    private String role;
    private LocalDate birthDate;
    private int age;
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String country;

    public PersonDTO() {}
    public PersonDTO(Long id, String fullName, String role, LocalDate birthDate, int age,
                     String street, String houseNumber, String postalCode, String city, String country) {
        this.id = id;
        this.fullName = fullName;
        this.role = role;
        this.birthDate = birthDate;
        this.age = age;
        this.street = street;
        this.houseNumber = houseNumber;
        this.postalCode = postalCode;
        this.city = city;
        this.country = country;
    }


}
