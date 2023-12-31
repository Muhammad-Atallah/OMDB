import Head from "next/head";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { BallTriangle } from "react-loading-icons";
import { fetchMovies } from "../utils/api";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination";

const inter = Inter({ subsets: ["latin"] });

export default function Search() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

  //Fetching data based on page query parameters
  useEffect(() => {
    const { searchKeyword, page } = router.query;

    if (searchKeyword && page) {
      setSearchKeyword(searchKeyword as string);
      setPage(parseInt(page as string));
    } else {
      // Set default values
      setSearchKeyword("");
      setPage(1);
      setStatus("");
      setMovies([]);
    }
  }, [router.query]);

  //Fetching data based on the searchKeyword
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("Loading...");
        const moviesData = await fetchMovies(searchKeyword, page);
        setMovies(moviesData.Search);
        setLastPage(Math.ceil(moviesData.totalResults / 10));
        setStatus("");
      } catch (error: any) {
        if (error.message === "Too many results.") {
          setStatus(
            "Too many results were found. Please try again with a more specific search query."
          );
        } else {
          setStatus(error.message);
        }
        console.error(error.message);
        setMovies([]);
      }
    };

    if (searchKeyword && page) {
      fetchData();
    }
  }, [searchKeyword, page]);

  return (
    <>
      <Head>
        <title>OMDB Browser - Search</title>
        <meta name="description" content="Search the OMDB database." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${inter.className} flex flex-col min-h-[100vh] p-10 sm:p-20 justify-start items-center`}
      >
        {/* {Search section} */}
        <section className="flex flex-col gap-10 justify-center justify-items-center items-center">
          <h1 className="text-lg md:text-2xl font-bold text-[#326660] text-center w-full">
            Your Gateway to the Ultimate Movie and Series Database
          </h1>
          <SearchBar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            setMovies={setMovies}
            page={page}
            setPage={setPage}
            setLastPage={setLastPage}
          />
        </section>

        {/* {Pagination Section} */}
        <Pagination
          searchKeyword={searchKeyword}
          page={page}
          setPage={setPage}
          lastPage={lastPage}
          setLastPage={setLastPage}
          status={status}
          setMovies={setMovies}
        />

        {/* {Status section} */}
        {searchKeyword !== "" && (
          <section className="flex justify-center justify-items-center items-center mt-5">
            {status === "Loading..." ? (
              <BallTriangle stroke="#326660" strokeOpacity={0.3} />
            ) : (
              <h1 className="text-[#326660] text-sm sm:text-base font-semibold min-w-[10rem] text-center ">
                {status}
              </h1>
            )}
          </section>
        )}

        {/* {Movies section} */}
        {status === "" && (
          <section className="w-[100vw] max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-5 mb-10 justify-center justify-items-center">
            {movies.map((movie) => (
              <MovieCard
                recommendation="false"
                {...movie}
                searchKeyword={searchKeyword}
                page={page}
                key={movie.imdbID}
              />
            ))}
          </section>
        )}

        {/* {Pagination Section} */}
        <Pagination
          searchKeyword={searchKeyword}
          page={page}
          setPage={setPage}
          lastPage={lastPage}
          setLastPage={setLastPage}
          status={status}
          setMovies={setMovies}
        />
      </main>
    </>
  );
}
