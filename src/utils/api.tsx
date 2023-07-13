import { generate } from "random-words";

const API_KEY = "247450a0";
const API_URL = "https://www.omdbapi.com/";

export const fetchMovies = async (searchKeyword, page) => {
  const url = `${API_URL}?s=${encodeURIComponent(
    searchKeyword
  )}&apikey=${API_KEY}&page=${page}`;

  const response = await fetch(url);
  const data = await response.json();

  //return array of movies if any where found to match the searchKeyword
  if (data.Response !== "True") {
    throw new Error(data.Error);
  } else {
    return data;
  }
};

export const fetchMovieDetails = async (title) => {
  const url = `${API_URL}?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  //return array of movies if any where found to match the searchKeyword
  if (data.Response !== "True") {
    throw new Error(data.Error);
  } else {
    return data;
  }
};

export const getRandomWords = (arrayOfRandomWords: string[]) => {
  arrayOfRandomWords = generate(10);

  return arrayOfRandomWords;
};

export const fetchRecommendations = async (randomWordsArray) => {
  const recommendations = await Promise.all(
    randomWordsArray.map(async (randomWord) => {
      try {
        const data = await fetchMovies(randomWord, 1);
        console.log("data: " + data);
        const movies = data.Search.filter((movie) => {
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
          randomPageOfMovies?.Search[randomMovieNumber]?.Title
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
