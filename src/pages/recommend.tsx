import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Recommend.module.css";
import { generate } from "random-words";
import { fetchRecommendations } from "@/utils/api";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/MovieCard";
import { BallTriangle } from "react-loading-icons";

const inter = Inter({ subsets: ["latin"] });

interface Movie {
  Poster: string;
  Title: string;
  Year: string;
  Type: string;
  imdbID: string;
}

export default function Recommend() {
  const [movieRecommendations, setMovieRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getRecommendations = async () => {
      const lastUpdateTime: any = localStorage.getItem(
        "recommendationsUpdateTime"
      );
      const currentTime = new Date().getTime();
      const twentyFourHours = 1000 * 60 * 60 * 24;

      // Checking if recommendations exist in local storage and have been updated within 24 hours
      if (lastUpdateTime && currentTime - lastUpdateTime < twentyFourHours) {
        const storedRecommendations = JSON.parse(
          localStorage.getItem("recommendations") || ""
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
            Today<span>&#39;</span>s Top Picks
          </h1>
          {isLoading && <BallTriangle stroke="#326660" strokeOpacity={0.3} />}
          <section className="w-[100vw] max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 justify-center justify-items-center">
            {movieRecommendations?.map((movie) => (
              <MovieCard
                recommendation="true"
                Poster={movie.Poster}
                Title={movie.Title}
                Year={movie.Year}
                Type={movie.Type}
                searchKeyword={movie.Title}
                page="1"
                key={movie.imdbID}
                imdbID={movie.imdbID}
              />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
