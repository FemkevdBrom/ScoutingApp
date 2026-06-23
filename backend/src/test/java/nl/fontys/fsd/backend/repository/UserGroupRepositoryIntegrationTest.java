package nl.fontys.fsd.backend.repository;

import nl.fontys.fsd.backend.model.UserGroup;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserGroupRepositoryIntegrationTest {

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Test
    void saveUserGroup_shouldWork() {
        UserGroup userGroup = new UserGroup();

        UserGroup saved = userGroupRepository.save(userGroup);

        assertNotNull(saved.getId());
    }
}