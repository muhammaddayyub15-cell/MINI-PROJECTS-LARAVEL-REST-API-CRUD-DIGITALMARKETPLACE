import MovieCard from "./MovieCard";
import type { Movie } from "../../data/movie.type";

type Props = {
  movies: Movie[];
  search: string;
};

function MovieList({ movies, search }: Props) {
  const filtered = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="
      grid gap-5
      grid-cols-[repeat(auto-fill,minmax(200px,1fr))]
    ">
      {filtered.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}

export default MovieList;