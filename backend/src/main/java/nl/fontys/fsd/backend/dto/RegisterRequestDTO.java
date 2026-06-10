package nl.fontys.fsd.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequestDTO {
    @NotBlank(message = "Voornaam is verplicht")
    private String firstName;

    private String infix;

    @NotBlank(message = "Achternaam is verplicht")
    private String lastName;

    @NotNull(message = "Geboortedatum is verplicht")
    @Past(message = "Geboortedatum moet in het verleden liggen")
    private LocalDate birthDate;

    @NotBlank(message = "Email is verplicht")
    @Email(message = "ongeledig emailformaat",
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.(nl|com|org|net|be|de|eu)$")
    private String email;

    /** wachtwoord heeft specefieke eisen
     *      * - Minimaal 8 tekens
     *      * - Minimaal 1 hoofdletter
     *      * - Minimaal 1 kleine letter
     *      * - Minimaal 1 cijfer
     *      * - Minimaal 1 speciaal teken (!@#$%^&*...)
     */
    @NotBlank(message = "Wachtwoord is verplicht")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$",
            message = "Wachtwoord moet minimaal 8 tekens bevatten, " +
                    "met minstens 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal teken"
    )
    private String password;

    @NotBlank(message = "Straat is verplicht")
    private String street;

    @NotBlank(message = "Huisnummer is verplicht")
    private String houseNumber;

    @NotBlank(message = "Postcode is verplicht")
    private String postalCode;

    @NotBlank(message = "Stad is verplicht")
    private String city;

    @NotBlank(message = "Land is verplicht")
    private String country;

    @NotNull(message = "Scoutinggroep is verplicht")
    private Long scoutingGroupId;
}
