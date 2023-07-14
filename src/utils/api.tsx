const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const API_URL = "https://www.omdbapi.com/";

console.log("API_KEY:", API_KEY); // Add this line to check the value

//fetch movies using a search keyword and a page
export const fetchMovies = async (searchKeyword: string, page: number) => {
  const trimmedSearchKeyword = searchKeyword.trim();
  const url = `${API_URL}?s=${encodeURIComponent(
    trimmedSearchKeyword
  )}&apikey=${API_KEY}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response !== "True") {
    throw new Error(data.Error);
  } else {
    return data;
  }
};

//fetch movie using imdb id
export const fetchMovieDetails = async (imdbID: string) => {
  const url = `${API_URL}?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response !== "True") {
    throw new Error(data.Error);
  } else {
    return data;
  }
};

//fetch movie recommendations using a random words array
export const fetchRecommendations = async (randomWordsArray: any[]) => {
  const recommendations = await Promise.all(
    randomWordsArray.map(async (randomWord) => {
      try {
        const data = await fetchMovies(randomWord, 1);
        const movies = data.Search.filter((movie: { imdbRating: string }) => {
          return (
            !isNaN(parseFloat(movie.imdbRating)) &&
            parseFloat(movie.imdbRating) >= 5
          );
        });
        const randomPage = Math.floor(
          Math.random() * Math.floor(movies.length / 10) + 1
        );
        const randomPageOfMovies = await fetchMovies(randomWord, randomPage);
        const randomMovieNumber = Math.floor(Math.random() * 10);
        const randomMovie = await fetchMovieDetails(
          randomPageOfMovies?.Search[randomMovieNumber]?.imdbID
        );
        return randomMovie.imdbRating >= 5 ? randomMovie : null;
      } catch (error: any) {
        console.error(error.message);
        return null;
      }
    })
  );

  return recommendations.filter((item) => Boolean(item));
};
