package nl.fontys.fsd.backend.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupUpdateDTO {
    private String name;
    private String description;
    private String groupEmail;
    private String groupAge;
    private String groupType;
    private String groupStatus;
    private String groupGender;
    private String color;
}