import { lazy, Suspense, useEffect, useState } from "react";
import { fetchAllMovies } from "../../api/movie";
import { fetchAllTheatres } from "../../api/theatre";
import { CLIENT } from "../../constants";
import Navbar from "../../components/Navbar";

const TheatreTable = lazy(() => import("../../components/theatreTable"));
const MovieTable = lazy(() => import("../../components/movieTable"));

const Client = () => {
    const [movieList, setMovieList] = useState([]);
    const [theatreList, setTheatreList] = useState([]);

    async function fetchTheatresOfClient() {
        const theatres = await fetchAllTheatres();

        const filteredTheatres = theatres.filter(
            (theatre) => theatre.ownerId === localStorage.getItem("_id")
        );

        setTheatreList(filteredTheatres);
    }

    async function fetchMovies() {
        const movies = await fetchAllMovies();
        setMovieList(movies);
    }

    useEffect(() => {
        fetchTheatresOfClient();
        fetchMovies();
    }, []);

    useEffect(() => {
        fetchTheatresOfClient();
    }, []);

    return (
        <div style={{ overflowX: "hidden" }}>
            <Navbar />
            <div className="container my-5">
                <Suspense fallback={<div>Loading.....</div>}>
                    <TheatreTable
                        theatreList={theatreList}
                        setTheatreList={setTheatreList}
                        userType={CLIENT}
                        movieList={movieList}
                        fetchTheatresOfClient={fetchTheatresOfClient}
                    />
                </Suspense>
                <div className="mt-5">
                    <Suspense fallback={<div>Loading.....</div>}>
                        <MovieTable movieList={movieList} userType={CLIENT} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Client;
