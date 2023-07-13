import { generate } from "random-words";

const API_KEY = "247450a0";
const API_URL = "https://www.omdbapi.com/";

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

//fetch movies using imdb id
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

//generate 10 random words
export const getRandomWords = (arrayOfRandomWords: string[]) => {
  arrayOfRandomWords = generate(10);

  return arrayOfRandomWords;
};
