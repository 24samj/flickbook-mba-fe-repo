import { cilBarcode, cilMovie, cilPeople, cilVideo } from "@coreui/icons";
import { CWidgetStatsD } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import "./statsDisplay.css";

const StatsDisplay = ({
    selectedItem,
    setSelectedItem,
    movieList,
    bookingList,
    userList,
    theatreList,
}) => {
    return (
        <div className="row mt-3 mb-4">
            <div className="col">
                <CWidgetStatsD
                    className="mb-3"
                    icon={
                        <CIcon className="my-4" icon={cilMovie} height={52} />
                    }
                    style={{
                        "--cui-card-cap-bg": "#00aced",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 1s !important",
                    }}
                    values={[{ title: "Movies", value: movieList.length }]}
                    color={selectedItem === "movies" ? "danger" : undefined}
                    onClick={() => setSelectedItem("movies")}
                />
            </div>
            <div className="col">
                <CWidgetStatsD
                    className="mb-3"
                    icon={
                        <CIcon className="my-4" icon={cilBarcode} height={52} />
                    }
                    style={{
                        "--cui-card-cap-bg": "#00aced",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                    values={[{ title: "Bookings", value: bookingList.length }]}
                    color={selectedItem === "bookings" ? "danger" : undefined}
                    onClick={() => setSelectedItem("bookings")}
                />
            </div>
            <div className="col">
                <CWidgetStatsD
                    className="mb-3"
                    icon={
                        <CIcon className="my-4" icon={cilPeople} height={52} />
                    }
                    style={{
                        "--cui-card-cap-bg": "#00aced",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                    values={[{ title: "Users", value: userList.length }]}
                    color={selectedItem === "users" ? "danger" : undefined}
                    onClick={() => setSelectedItem("users")}
                />
            </div>
            <div className="col">
                <CWidgetStatsD
                    className="mb-3"
                    icon={
                        <CIcon className="my-4" icon={cilVideo} height={52} />
                    }
                    style={{
                        "--cui-card-cap-bg": "#00aced",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                    values={[{ title: "Theatres", value: theatreList.length }]}
                    onClick={() => setSelectedItem("theatres")}
                    color={selectedItem === "theatres" ? "danger" : undefined}
                />
            </div>
        </div>
    );
};

export default StatsDisplay;
