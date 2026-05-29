import React, {useEffect, useState} from 'react';
import LeadersTable from "../components/GroupPage/LeadersTable";
import MembersTable from "../components/GroupPage/MembersTable";
import GroupInfo from "../components/GroupPage/GroupInfo";
import { useParams} from "react-router-dom";
import App from "../App";

function GroupPage({groupId}) {
    const { id } = useParams();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/groups/${groupId}`)
            .then(res => res.json())
            .then(data => setGroup(data));
    }, [groupId]);

    if (!group) return <div>Loading...</div>;

    return (
        <div>
            <h1>{group.groupName}</h1>

            <LeadersTable leaders={group.leaders} />
            <MembersTable members={group.members} />
            <GroupInfo info={group.info} />
        </div>
    );
}

export default GroupPage;