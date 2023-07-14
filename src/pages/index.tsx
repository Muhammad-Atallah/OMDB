import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Search.module.css";
import { useState, useEffect } from "react";
import { BallTriangle } from "react-loading-icons";
import { fetchMovies } from "../utils/api";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { scrollUp } from "@/utils/helpers";
import { useRouter } from "next/router";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const inter = Inter({ subsets: ["latin"] });

export default function Search() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

  //Handling pagination arrows
  const handleLeftPaginationArrow = async () => {
    if (page !== 1) {
      try {
        setPage(page - 1);
        const moviesData = await fetchMovies(searchKeyword, page - 1);
        setMovies(moviesData.Search);
        setLastPage(Math.ceil(moviesData.totalResults / 10));
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
      }
    }
    scrollUp();
  };

  const handleRightPaginationArrow = async () => {
    if (page !== lastPage) {
      try {
        setMovies([]);
        setPage(page + 1);
        const moviesData = await fetchMovies(searchKeyword, page + 1);
        setMovies(moviesData.Search);
        setLastPage(Math.ceil(moviesData.totalResults / 10));
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
      }
    }
    scrollUp();
  };

  const handleGoToFirstPage = async () => {
    if (page !== 1) {
      try {
        setPage(1);
        const moviesData = await fetchMovies(searchKeyword, 1);
        setMovies(moviesData.Search);
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
      }
    }
    scrollUp();
  };

  const handleGoToLastPage = async () => {
    if (page !== lastPage) {
      try {
        setPage(lastPage);
        const moviesData = await fetchMovies(searchKeyword, lastPage);
        setMovies(moviesData.Search);
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
      }
    }
    scrollUp();
  };

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
        {/* {Status section} */}
        {searchKeyword !== "" && (
          <section className="flex justify-center justify-items-center items-center">
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
          <section className="w-[100vw] max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 justify-center justify-items-center">
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
        <section
          className={
            searchKeyword === "" || lastPage < 2 || status !== ""
              ? "hidden"
              : "flex gap-2 w-[100vw] justify-center justify-items-center items-center"
          }
        >
          <MdKeyboardDoubleArrowLeft
            onClick={handleGoToFirstPage}
            className="bg-[#326660] text-white text-xl rounded-full p-1 cursor-pointer self-center hover:bg-[#449182] shadow-sm"
            size={30}
          />
          <RiArrowLeftSLine
            onClick={handleLeftPaginationArrow}
            className="bg-[#326660] text-white text-xl rounded-full p-1 cursor-pointer self-center hover:bg-[#449182] shadow-sm"
            size={30}
          />
          <p className="text-sm self-center text-[#326660]">
            {page} of {lastPage}
          </p>
          <RiArrowRightSLine
            onClick={handleRightPaginationArrow}
            className="bg-[#326660] text-white text-xl rounded-full p-1 cursor-pointer self-center hover:bg-[#449182] shadow-sm"
            size={30}
          />
          <MdKeyboardDoubleArrowRight
            onClick={handleGoToLastPage}
            className="bg-[#326660] text-white text-xl rounded-full p-1 cursor-pointer self-center hover:bg-[#449182] shadow-sm"
            size={30}
          />
        </section>
      </main>
    </>
  );
}
