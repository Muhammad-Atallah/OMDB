import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Recommend.module.css";
import { generate } from "random-words";
import {
  fetchMovieDetails,
  fetchMovies,
  fetchRecommendations,
} from "@/utils/api";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { BallTriangle } from "react-loading-icons";

const inter = Inter({ subsets: ["latin"] });

export default function Recommend() {
  const [movieRecommendations, setMovieRecommendations] = useState<Object[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getRecommendations = async () => {
      const lastUpdateTime = localStorage.getItem("recommendationsUpdateTime");
      const currentTime = new Date().getTime();
      const twentyFourHours = 20000;

      if (lastUpdateTime && currentTime - lastUpdateTime < twentyFourHours) {
        // Recommendations exist in local storage and have been updated within 24 hours
        const storedRecommendations = JSON.parse(
          localStorage.getItem("recommendations")
        );
        setMovieRecommendations(storedRecommendations);
      } else {
        // Fetch new recommendations and update local storage
        setIsLoading(true);
        const randomWordsArray = generate(10);
        const recommendations = await fetchRecommendations(randomWordsArray);

        localStorage.setItem(
          "recommendations",
          JSON.stringify(recommendations)
        );
        localStorage.setItem(
          "recommendationsUpdateTime",
          currentTime.toString()
        );

        setMovieRecommendations(recommendations);
        setIsLoading(false);
      }
    };

    getRecommendations();
  }, []);

  return (
    <>
      <Head>
        <title>OMDB Browser - Recommendations</title>
        <meta name="description" content="Get movie recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className="flex flex-col gap-20 justify-center justify-items-center items-center">
          <h1 className="text-xl md:text-2xl text-center font-bold text-[#326660]">
            Today's Top Picks
          </h1>
          {isLoading && <BallTriangle stroke="#326660" strokeOpacity={0.3} />}
          <section className="w-[100vw] max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 justify-center justify-items-center">
            {movieRecommendations?.map((movie) => (
              <MovieCard
                recommendation="true"
                {...movie}
                searchKeyword={movie.Title}
                page="1"
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

// const [randomWordsArray, setRandomWordsArray] = useState<string[]>(
//   generate(10)
// );

// useEffect(() => {
//   const interval = setInterval(() => {
//     setRandomWordsArray(generate(10));
//   }, 20000); // Execute every 20 seconds

//   return () => {
//     clearInterval(interval);
//   };
// }, []);

// console.log(randomWordsArray);

// useEffect(() => {
//   const fetchMovieRecommendations = async () => {
//     try {
//       const recommendations = await Promise.all(
//         randomWordsArray.map(async (randomWord) => {
//           try {
//             const movies = await fetchMovies(randomWord, 1); // Get the total list of movies using the randomWord as the search keyword
//             const randomPage = Math.floor(
//               Math.random() * Math.floor(movies.totalResults / 10) + 1 // Get a random page number based on the totalResults returned
//             );
//             const randomPageOfMovies = await fetchMovies(
//               randomWord,
//               randomPage
//             ); // Get a random page of movies
//             const randomMovieNumber = Math.floor(Math.random() * 10 + 1);
//             const randomMovie = await fetchMovieDetails(
//               randomPageOfMovies?.Search[randomMovieNumber]?.Title
//             ); // Get one random movie from the page

//             return randomMovie;
//           } catch (error: any) {
//             console.error(error.message);
//             return null;
//           }
//         })
//       );

//       setMovieRecommendations(recommendations.filter(Boolean));
//     } catch (error: any) {
//       console.error(error.message);
//     }
//   };

//   fetchMovieRecommendations();
// }, [randomWordsArray]);

// console.log(movieRecommendations);
