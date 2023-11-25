import MaterialTable from "@material-table/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { ADMIN } from "../constants";
import MovieModal from "./movieModal";
import { AxiosInstance } from "../util/axiosInstances";

const MovieTable = ({ movieList, userType, setMovieList }) => {
    const [movieDetail, setMovieDetail] = useState({});
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);
    const [showEditMovieModal, setShowEditMovieModal] = useState(false);

    const addMovie = (theatre) => {
        setMovieDetail({});
        setShowAddMovieModal(true);
    };

    const editMovie = (movie) => {
        setMovieDetail(movie);
        setShowEditMovieModal(true);
    };

    const editMovieDetails = async (movie) => {
        try {
            const response = await AxiosInstance.put(
                `/mba/api/v1/movies/${movie._id}`,
                movie
            );
            const updatedMovieList = movieList.map((m) =>
                m._id === movie._id ? movie : m
            );
            setMovieList(updatedMovieList);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteMovie = async (movie) => {
        const deletionId = movie._id;
        try {
            const response = await AxiosInstance.delete(
                `/mba/api/v1/movies/${movie._id}`
            );
            const updatedMovieList = movieList.filter(
                (movie) => movie._id !== deletionId
            );
            setMovieList(updatedMovieList);
        } catch (error) {
            console.log(error);
        }
    };

    const changeMovieDetails = (event) => {
        if (event.target.name === "releaseDate") {
            const [year, month, day] = event.target.value.split("-");
            setMovieDetail({
                ...movieDetail,
                [event.target.name]: `${day}-${month}-${year}`,
            });
        } else {
            setMovieDetail({
                ...movieDetail,
                [event.target.name]: event.target.value,
            });
        }
    };

    const resetState = () => {
        setShowEditMovieModal(false);
        setShowAddMovieModal(false);
        setShowEditMovieModal(false);

        setMovieDetail({});
    };

    return (
        <>
            <MaterialTable
                title="Movies"
                data={movieList}
                columns={[
                    {
                        title: "Poster",
                        field: "posterUrl",
                        render: (rowData) => (
                            <img
                                src={rowData.posterUrl}
                                alt=""
                                height="100"
                                width="80"
                            />
                        ),
                    },
                    {
                        title: "Name",
                        field: "name",
                    },
                    {
                        title: "Director",
                        field: "director",
                    },
                    {
                        title: "Release Date",
                        field: "releaseDate",
                    },
                    {
                        title: "Release Status",
                        field: "releaseStatus",
                    },
                ]}
                actions={
                    userType === ADMIN
                        ? [
                              {
                                  icon: Delete,
                                  tooltip: "Delete Movie",
                                  onClick: (event, rowData) =>
                                      deleteMovie(rowData),
                              },
                              {
                                  icon: Edit,
                                  tooltip: "Edit Movie",
                                  onClick: (event, rowData) =>
                                      editMovie(rowData),
                              },
                              {
                                  icon: Add,
                                  tooltip: "Add Movie",
                                  isFreeAction: true,
                                  onClick: (event) => addMovie(),
                              },
                          ]
                        : []
                }
            />
            <MovieModal
                showAddMovieModal={showAddMovieModal}
                showEditMovieModal={showEditMovieModal}
                resetState={resetState}
                editMovie={editMovie}
                addMovie={addMovie}
                movieDetail={movieDetail}
                changeMovieDetails={changeMovieDetails}
                editMovieDetails={editMovieDetails}
            />
        </>
    );
};

export default MovieTable;
