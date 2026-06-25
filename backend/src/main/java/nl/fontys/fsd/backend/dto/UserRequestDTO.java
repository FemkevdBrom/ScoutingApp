package nl.fontys.fsd.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class UserRequestDTO {
    private String firstName;
    private String infix;
    private String lastName;
    private LocalDate birthDate;
    private String email;
    private String password;
    private String street;
    private String postalCode;
    private String houseNumber;
    private String city;
    private String country;
}