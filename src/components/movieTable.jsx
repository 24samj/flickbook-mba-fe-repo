import MaterialTable from "@material-table/core";
import { Add, Delete, Edit } from "@material-ui/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import { ADMIN } from "../constants";
import { AxiosInstance } from "../util/axiosInstances";
import MovieModal from "./movieModal";

const MovieTable = ({ movieList, userType, setMovieList, fetchMovies }) => {
    const [movieDetail, setMovieDetail] = useState({});
    const [showAddMovieModal, setShowAddMovieModal] = useState(false);
    const [showEditMovieModal, setShowEditMovieModal] = useState(false);
    const [isRequestProcessing, setIsRequestProcessing] = useState(false);

    const addMovie = (theatre) => {
        setMovieDetail({
            name: "",
            description: "",
            language: [],
            director: "",
            posterUrl: "",
            trailerUrl: "",
            releaseStatus: "RELEASED",
            releaseDate: "",
        });
        setShowAddMovieModal(true);
    };

    const editMovie = (movie) => {
        setMovieDetail(movie);
        setShowEditMovieModal(true);
    };

    const addOrEditMovieDetails = async (event) => {
        event.preventDefault();
        if (event.target.innerText.includes("Edit")) {
            try {
                setIsRequestProcessing(true);
                const response = await AxiosInstance.put(
                    `/mba/api/v1/movies/${movieDetail._id}`,
                    {
                        name: movieDetail.name,
                        description: movieDetail.description,
                        director: movieDetail.director,
                        posterUrl: movieDetail.posterUrl,
                        trailerUrl: movieDetail.trailerUrl,
                        releaseStatus: movieDetail.releaseStatus,
                        releaseDate: movieDetail.releaseDate,
                    }
                );
                const updatedMovieList = movieList.map((m) =>
                    m._id === movieDetail._id ? movieDetail : m
                );
                toast.success(
                    `Movie details for ${movieDetail.name} updated successfully.`
                );
                // fetchMovies();
                setMovieList(updatedMovieList);
            } catch (error) {
                console.log(error);
            } finally {
                resetState();
                setIsRequestProcessing(false);
            }
        } else {
            try {
                setIsRequestProcessing(true);
                const response = await AxiosInstance.post(
                    "/mba/api/v1/movies",
                    {
                        name: movieDetail.name,
                        description: movieDetail.description,
                        language: [movieDetail.language],
                        director: movieDetail.director,
                        posterUrl: movieDetail.posterUrl,
                        trailerUrl: movieDetail.trailerUrl,
                        releaseStatus: movieDetail.releaseStatus,
                        releaseDate: movieDetail.releaseDate,
                    }
                );

                toast.success(
                    `New movie, ${movieDetail.name}, added successfully.`
                );
                fetchMovies();
            } catch (error) {
                console.log(error);
            } finally {
                resetState();
                setIsRequestProcessing(false);
            }
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
            toast.success(`${movie.name} deleted successfully.`);
        } catch (error) {
            console.log(error);
        }
    };

    const changeMovieDetails = (event) => {
        if (event.target.name === "releaseDate") {
            const selectedDate = event.target.value;

            if (selectedDate) {
                const [day, month, year] = selectedDate.split("-");

                if (day && month && year) {
                    setMovieDetail({
                        ...movieDetail,
                        [event.target.name]: `${year}-${month}-${day}`,
                    });
                }
            }
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
        setMovieDetail({
            ...movieDetail,
            releaseDate: "",
        });
    };

    return (
        <>
            <MaterialTable
                title="Movies"
                data={movieList.map((movie) => ({
                    ...movie,
                    id: movie._id,
                }))}
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
                addOrEditMovieDetails={addOrEditMovieDetails}
                isRequestProcessing={isRequestProcessing}
            />
        </>
    );
};

export default MovieTable;
