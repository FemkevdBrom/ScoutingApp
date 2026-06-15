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

    public PersonDTO() {}
    public PersonDTO(Long id,String fullName, String role, LocalDate birthDate, int age) {
        this.id = id;
        this.fullName = fullName;
        this.role = role;
        this.birthDate = birthDate;
        this.age = age;
    }


}
