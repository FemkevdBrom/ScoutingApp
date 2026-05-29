package nl.fontys.fsd.backend.dto;
import  lombok.Getter;
import lombok.Setter;
@Getter
@Setter

public class UserResponseDTO {
    private Long id;
    private String email;
    private String firstName;

    public UserResponseDTO(Long id, String email, String firstName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
    }
}
