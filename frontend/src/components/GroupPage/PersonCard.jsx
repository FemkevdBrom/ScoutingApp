import React from 'react';
import "./PersonCard.css";

export default function PersonCard({ person, onClick, isClickable }) {
    return (
        <div
            className={`person-card ${isClickable ? 'clickable' : ''}`}
            onClick={isClickable ? onClick : undefined}
        >
            <div className="person-info">
                <div className="person-name">{person.fullName}</div>
                {person.role && <div className="person-role">{person.role}</div>}
            </div>
            {isClickable && <span className="arrow">→</span>}
        </div>
    );
}