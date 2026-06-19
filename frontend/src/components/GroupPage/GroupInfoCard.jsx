import React from 'react';
import "./GroupInfoCard.css";

export default function GroupInfoCard({ group }) {
    return (
        <div className="info-card">
            <h2>Groepsinformatie</h2>
            <div className="info-grid">
                {group.info?.groupDescription && group.info.groupDescription !== '-' && (
                    <div className="description">
                        {group.info.groupDescription}
                    </div>
                )}
                <div><strong>Email:</strong> {group.info?.groupEmail || '-'}</div>
                <div><strong>Type:</strong> {group.info?.groupType || '-'}</div>
                <div><strong>Leeftijd:</strong> {group.info?.groupAge || '-'}</div>
                <div><strong>Status:</strong> {group.info?.groupStatus || '-'}</div>
            </div>
        </div>
    );
}