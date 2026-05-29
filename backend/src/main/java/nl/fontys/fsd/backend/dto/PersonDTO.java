package nl.fontys.fsd.backend.dto;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter ;
@Getter
@Setter

public class PersonDTO {
    private String fullName;
    private String role;
    private LocalDate birthDate;
    private int age;

    public PersonDTO() {}
    public PersonDTO(String fullName, String role, LocalDate birthDate, int age) {
        this.fullName = fullName;
        this.role = role;
        this.birthDate = birthDate;
        this.age = age;
    }


}
