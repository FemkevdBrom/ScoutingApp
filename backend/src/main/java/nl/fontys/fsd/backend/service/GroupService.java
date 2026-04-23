package nl.fontys.fsd.backend.service;
import nl.fontys.fsd.backend.model.Group;
import nl.fontys.fsd.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }
    public List<Group> getGroupsForUser(Long userId) {
        return groupRepository.findGroupsByUserId(userId);
    }
}
