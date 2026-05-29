package nl.fontys.fsd.backend.dto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class GroupDetailsDTO {
    private String groupName;
    private List<PersonDTO> leaders;
    private List<PersonDTO> members;
    private GroupInfoDTO info;

    public GroupDetailsDTO() {}

    public GroupDetailsDTO(String groupName,  List<PersonDTO> leaders, List<PersonDTO> members, GroupInfoDTO info) {
        this.groupName = groupName;
        this.leaders = leaders;
        this.members = members;
        this.info = info;
    }
}
