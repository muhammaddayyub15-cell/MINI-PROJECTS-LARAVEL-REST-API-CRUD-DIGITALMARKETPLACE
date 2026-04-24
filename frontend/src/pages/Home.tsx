import MovieList from "../components/movie/MovieList";
import { MOVIE_DUMMY } from "../data/movies";

type Props = {
  search: string;
};

function Home({ search }: Props) {
  const movies = MOVIE_DUMMY;

  return <MovieList movies={movies} search={search} />;
}

export default Home;