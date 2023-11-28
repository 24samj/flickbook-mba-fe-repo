import MaterialTable from "@material-table/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { CLIENT } from "../constants";
import TheatreModal from "./theatreModal";
import { AxiosInstance } from "../util/axiosInstances";

const TheatreTable = ({
    theatreList,
    setTheatreList,
    movieList,

    userType,
    fetchTheatresOfClient,
}) => {
    const [theatreDetail, setTheatreDetail] = useState({});
    const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
    const [showEditTheatreModal, setShowEditTheatreModal] = useState(false);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);

    const resetState = () => {
        setShowEditTheatreModal(false);
        setShowAddTheatreModal(false);
        setTheatreDetail({
            name: "",
            description: "",
            city: "",
            pinCode: "",
            movies: [],
            ownerId: "",
        });
    };

    const editTheatre = (theatre) => {
        setTheatreDetail(theatre);
        setShowEditTheatreModal(true);
    };

    const deleteTheatre = async (theatre) => {
        const deletionId = theatre._id;
        try {
            await AxiosInstance.delete(`/mba/api/v1/theatres/${deletionId}`);
            // fetchTheatresOfClient();
            toast.success("Theatre deleted successfully");
            setTheatreList(
                theatreList.filter((theatre) => theatre._id !== deletionId)
            );
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
                setIsRequestProcessing(true);
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
                    theatreList.map((theatre) =>
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
            } finally {
                setIsRequestProcessing(false);
            }
        } else {
            try {
                setIsRequestProcessing(true);
                await AxiosInstance.post("/mba/api/v1/theatres", {
                    name: theatreDetail.name,
                    description: theatreDetail.description,
                    city: theatreDetail.city,
                    pinCode: theatreDetail.pinCode,
                    movies: [],
                    ownerId: localStorage.getItem("_id"),
                });
                toast.success("Added new theatre successfully");
                fetchTheatresOfClient();
                setShowAddTheatreModal(false);
            } catch (ex) {
                console.log(ex);
                toast.error(
                    "Error occurred while adding new theatre. Please try again in a minute."
                );
            } finally {
                setIsRequestProcessing(false);
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
                data={theatreList.map((theatre) => ({
                    ...theatre,
                    id: theatre._id,
                }))}
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
                        tooltip: "Delete Theatre",
                        onClick: (event, rowData) => deleteTheatre(rowData),
                    },
                    {
                        icon: Edit,
                        tooltip: "Edit Theatre",
                        onClick: (event, rowData) => editTheatre(rowData),
                    },
                    ...(userType === CLIENT
                        ? [
                              {
                                  icon: Add,
                                  tooltip: "Add Theatre",
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
                isRequestProcessing={isRequestProcessing}
                setIsRequestProcessing={setIsRequestProcessing}
            />
        </>
    );
};

export default TheatreTable;
