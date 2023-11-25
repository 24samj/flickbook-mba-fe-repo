export const Legend = () => (
    <ul className="legend">
        <li>
            <span className="seat" style={{ cursor: "default" }}>
                Available
            </span>
        </li>
        <li>
            <span className="seat selected" style={{ cursor: "default" }}>
                Selected
            </span>
        </li>
        <li>
            <span className="seat occupied" style={{ cursor: "default" }}>
                Occupied
            </span>
        </li>
    </ul>
);
