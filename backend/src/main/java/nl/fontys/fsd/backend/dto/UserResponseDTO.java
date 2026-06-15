package nl.fontys.fsd.backend.dto;
import  lombok.Getter;
import lombok.Setter;
import nl.fontys.fsd.backend.model.User;

import java.time.LocalDate;

@Getter
@Setter

public class UserResponseDTO {
    private Long id;
    private String email;
    private String firstName;
    private String infix;
    private String lastName;
    private String street;
    private String houseNumber;
    private String postalCode;
    private String city;
    private String state;
    private String country;
    private LocalDate birthDate;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.infix = user.getInfix();
        this.lastName = user.getLastName();
        this.street = user.getStreet();
        this.houseNumber = user.getHouseNumber();
        this.postalCode = user.getPostalCode();
        this.city = user.getCity();
        this.birthDate = user.getBirthDate();
        }
}
