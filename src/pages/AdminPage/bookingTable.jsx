import MaterialTable from "@material-table/core";

const BookingTable = ({ bookingList }) => {
    return (
        <>
            <MaterialTable
                title="Bookings"
                data={bookingList.map((booking) => ({
                    ...booking,
                    id: booking._id,
                }))}
                columns={[
                    {
                        title: "Booking ID",
                        field: "_id",
                    },
                    {
                        title: "Movie ID",
                        field: "movieId",
                    },
                    {
                        title: "Theatre ID",
                        field: "theatreId",
                    },
                    {
                        title: "Number of seats",
                        field: "noOfSeats",
                    },
                    {
                        title: "Booking Status",
                        field: "status",
                    },
                ]}
            />
        </>
    );
};

export default BookingTable;
