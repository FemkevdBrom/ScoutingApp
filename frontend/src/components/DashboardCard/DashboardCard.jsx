import React from "react";
import "./DashboardCard.css";

export default function DashboardCard({ title, items }) {
    return (
        <div className="card">
            <h3>{title}</h3>

            <div className="card-list">
                {items.length === 0 && <p>Geen items</p>}

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="card-item"
                        style={{ backgroundColor: item.color }}
                        onClick={item.onClick}
                    >
                        <div className="card-item-title">{item.title}</div>

                        {item.subtitle && (
                            <div className="card-item-subtitle">{item.subtitle}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}