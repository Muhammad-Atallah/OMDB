import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Recommend.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchMovieDetails } from "@/utils/api";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { BallTriangle } from "react-loading-icons";

const inter = Inter({ subsets: ["latin"] });

export default function Movie() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movieDetails, setMovieDetails] = useState<{
    Title: string;
    Year: string;
    Rated: string;
    Runtime: string;
    Genre: string;
    Plot: string;
    Director: string;
    Writer: string;
    Actors: string;
    Poster: string;
    imdbID: string;
    Ratings: { Source: string; Value: string }[];
  } | null>(null);

  const handleBackButton = () => {
    const { searchKeyword, page } = router.query;
    const fetchDetails = async () => {
      try {
        const movieData = await fetchMovieDetails(
          typeof router.query.imdbID === "string" ? router.query.imdbID : ""
        );
        setMovieDetails(movieData);
      } catch (error) {
        console.log(error);
      }
    };
    if (router.query.imdbID) {
      fetchDetails();
    }
    router.push({
      pathname: "/",
      query: { searchKeyword: searchKeyword || "", page: page || 1 },
    });
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const movieData = await fetchMovieDetails(
          typeof router.query.imdbID === "string" ? router.query.imdbID : ""
        );
        setMovieDetails(movieData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (router.query.imdbID) {
      fetchDetails();
    }
  }, [router.query.imdbID]);

  return (
    <>
      <Head>
        <title>OMDB Browser - Movie</title>
        <meta name="description" content="Movie description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {isLoading ? (
          <BallTriangle stroke="#326660" strokeOpacity={0.3} />
        ) : (
          <div className="flex flex-col justify-center items-center justify-items-center gap-10">
            <BsFillArrowLeftCircleFill
              className="cursor-pointer self-start"
              size={40}
              color="#326660"
              onClick={handleBackButton}
            />
            <article className="flex flex-col md:flex-row bg-white rounded-2xl shadow-xl m-auto">
              <img
                src={movieDetails?.Poster}
                alt={movieDetails?.Title}
                className="rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl object-cover"
              />
              <section className="bg-[#FAF9F6] text-black p-5 md:p-3 lg:p-5 min-w-[14rem] max-w-[25rem] rounded-b-2xl md:rounded-r-2xl flex flex-col gap-1">
                <h1 className="font-bold">
                  {movieDetails?.Title} ({movieDetails?.Year})
                </h1>
                <section className="flex gap-3 text-[13px] text-gray-600">
                  <p className="px-1 rounded-full border-gray-500 border-[1px]">
                    {movieDetails?.Rated}
                  </p>
                  <p>{movieDetails?.Genre}</p>
                  <p>{movieDetails?.Runtime}</p>
                </section>
                <section className="text-xs my-4">
                  <p>{movieDetails?.Plot}</p>
                </section>
                <section className="text-[12px]">
                  <p>
                    <b>Director:</b> {movieDetails?.Director}
                  </p>
                  <p>
                    <b>Writer:</b> {movieDetails?.Writer}
                  </p>
                  <p>
                    <b>Actors:</b> {movieDetails?.Actors}
                  </p>
                </section>

                {/* {Ratings section} */}
                <section className="flex justify-center gap-10 my-10">
                  {movieDetails?.Ratings.map((rating, index) => {
                    let color =
                      index === 0
                        ? "text-yellow-600"
                        : index === 1
                        ? "text-red-600"
                        : "text-blue-900";
                    return (
                      <div
                        key={rating.Source}
                        className="flex flex-col justify-center justify-items-center gap-1"
                      >
                        <img
                          className="max-w-[2.5rem]"
                          src={`/images/${rating.Source}.png`}
                          alt={`${rating.Source}-logo`}
                        />
                        <p
                          className={`self-center text-sm font-semibold ${color}`}
                        >
                          {rating.Value}
                        </p>
                      </div>
                    );
                  })}
                </section>
              </section>
            </article>
          </div>
        )}
      </main>
    </>
  );
}
