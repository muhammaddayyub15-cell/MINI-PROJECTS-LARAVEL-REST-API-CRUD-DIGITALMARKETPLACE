import MovieCard from "./MovieCard";

function MovieList({ movies = [] }) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <span className="mb-3 text-4xl">🎬</span>
        <p className="text-sm">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid items-start grid-cols-2 gap-3 overflow-visible sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
    </div>
  );
}

export default MovieList;