import MaterialTable from "@material-table/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { ADMIN } from "../constants";
import TheatreModal from "./theatreModal";
import { AxiosInstance } from "../util/axiosInstances";

const TheatreTable = ({
    theaterList,
    setTheatreList,
    movieList,
    setMovieList,
    userType,
}) => {
    const [theatreDetail, setTheatreDetail] = useState({});
    const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
    const [showEditTheatreModal, setShowEditTheatreModal] = useState(false);

    const resetState = () => {
        setShowEditTheatreModal(false);
        setShowAddTheatreModal(false);
        setShowEditTheatreModal(false);
        setTheatreDetail({});
    };

    const editTheatre = (theatre) => {
        setTheatreDetail(theatre);
        setShowEditTheatreModal(true);
    };

    const deleteTheatre = async (theatre) => {
        try {
            console.log("deleting threathe ", theatre);
            await AxiosInstance.delete(
                `/mba/api/v1/theatres/${theatreDetail._id}`
            );
            toast.success("Theatre deleted successfully");
        } catch (ex) {
            console.log(ex);
            toast.error(
                "Error occurred while deleting theatre. Please try again in a minute."
            );
        }
    };

    const addTheatre = (theatre) => {
        setTheatreDetail({});
        setShowAddTheatreModal(true);
    };

    const changeTheatreDetails = (event) => {
        setTheatreDetail({
            ...theatreDetail,
            [event.target.name]: event.target.value,
        });
    };

    const updateOrAddTheatreDetail = async (event) => {
        event.preventDefault();

        if (showEditTheatreModal) {
            try {
                await AxiosInstance.put(
                    `/mba/api/v1/theatres/${theatreDetail._id}`,
                    {
                        name: theatreDetail.name,
                        city: theatreDetail.city,
                        description: theatreDetail.description,
                        pinCode: theatreDetail.pinCode,
                    }
                );
                toast.success("Theatre details updated successfully");
                setTheatreList(
                    theaterList.map((theatre) =>
                        theatre._id === theatreDetail._id
                            ? theatreDetail
                            : theatre
                    )
                );
                setShowEditTheatreModal(false);
            } catch (ex) {
                console.log(ex);
                toast.error(
                    "Error occurred while updating theatre details. Please try again in a minute."
                );
            }
        } else {
            try {
                console.log("adding new theatre:", theatreDetail);
                await AxiosInstance.post("/mba/api/v1/theatres", theatreDetail);
                toast.success("Added new theatre successfully");
                setShowAddTheatreModal(false);
            } catch (ex) {
                console.log(ex);
                toast.error(
                    "Error occurred while adding new theatre. Please try again in a minute."
                );
            }
        }
    };

    return (
        <>
            <MaterialTable
                title={
                    localStorage.getItem("userTypes") === "CLIENT"
                        ? "Theatres owned by you"
                        : "Theatres"
                }
                data={theaterList}
                columns={[
                    {
                        title: "Name",
                        field: "name",
                    },
                    {
                        title: "City",
                        field: "city",
                    },
                    {
                        title: "Description",
                        field: "description",
                    },
                    {
                        title: "Pin Code",
                        field: "pinCode",
                    },
                ]}
                actions={[
                    {
                        icon: Delete,
                        tooltip: "Delete Theater",
                        onClick: (event, rowData) => deleteTheatre(rowData),
                    },
                    {
                        icon: Edit,
                        tooltip: "Edit Theater",
                        onClick: (event, rowData) => editTheatre(rowData),
                    },
                    ...(userType === ADMIN
                        ? [
                              {
                                  icon: Add,
                                  tooltip: "Add Theater",
                                  isFreeAction: true,
                                  onClick: (event) => addTheatre(),
                              },
                          ]
                        : []),
                ]}
            />
            <TheatreModal
                showAddTheatreModal={showAddTheatreModal}
                showEditTheatreModal={showEditTheatreModal}
                resetState={resetState}
                editTheatre={editTheatre}
                addTheatre={addTheatre}
                theatreDetail={theatreDetail}
                changeTheatreDetails={changeTheatreDetails}
                updateOrAddTheatreDetail={updateOrAddTheatreDetail}
                userType={userType}
                movieList={movieList}
            />
        </>
    );
};

export default TheatreTable;
