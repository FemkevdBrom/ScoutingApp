package nl.fontys.fsd.backend.dto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter

public class GroupInfoDTO {
    private String groupName;
    private String groupDescription;
    private String groupEmail;
    private String groupType;
    private String groupStatus;
    private String ageGroup;
    private String groupGender;
    private String scoutingGroup;

    public GroupInfoDTO() {}

    public GroupInfoDTO(String description,
                        String email,
                        String groupType,
                        String groupStatus,
                        String groupAge,
                        String scoutingGroup) {
        this.groupDescription = description;
        this.groupEmail = email;
        this.groupType = groupType;
        this.groupStatus = groupStatus;
        this.ageGroup = groupAge;
        this.scoutingGroup = scoutingGroup;
    }
}
