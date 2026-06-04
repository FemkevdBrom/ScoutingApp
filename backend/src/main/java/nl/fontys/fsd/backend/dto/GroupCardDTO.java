package nl.fontys.fsd.backend.dto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GroupCardDTO {
    private Long id;
    private String name;
    private String colorHex;
    private String description;


    public GroupCardDTO(Long id, String name, String description, String colorHex) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.colorHex = colorHex;
    }
}
