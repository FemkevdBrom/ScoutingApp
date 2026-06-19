package nl.fontys.fsd.backend.dto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class GroupDetailsDTO {
    private String groupName;
    private String colorHex;
    private List<PersonDTO> leaders;
    private List<PersonDTO> members;
    private GroupInfoDTO info;
    private String userRole;

    public GroupDetailsDTO() {}

    public GroupDetailsDTO(String groupName, String colorHex,  List<PersonDTO> leaders, List<PersonDTO> members, GroupInfoDTO info, String userRole) {
        this.groupName = groupName;
        this.colorHex = colorHex;
        this.leaders = leaders;
        this.members = members;
        this.info = info;
        this.userRole = userRole;
    }
}
