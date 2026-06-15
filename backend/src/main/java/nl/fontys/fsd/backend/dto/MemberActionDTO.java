package nl.fontys.fsd.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberActionDTO {
    private Long userId;
    private String roleName;
}
