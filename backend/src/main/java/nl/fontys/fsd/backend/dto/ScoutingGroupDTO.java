package nl.fontys.fsd.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ScoutingGroupDTO {
    private Long id;
    private String name;
    private String city;
}