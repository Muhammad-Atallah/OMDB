import React from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { fetchMovies } from "@/utils/api";
import { scrollUp } from "@/utils/helpers";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

interface PaginationProps {
  searchKeyword: string;
  lastPage: number;
  status: string;
  page: number;
  setPage: (page: number) => void;
  setLastPage: (lastPage: number) => void;
  setMovies: (movies: any[]) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  searchKeyword,
  lastPage,
  status,
  page,
  setPage,
  setLastPage,
  setMovies,
}) => {
  //Handling pagination arrows
  const handlePaginationArrow = async (newPage: number) => {
    if (page !== newPage) {
      try {
        setPage(newPage);
        const moviesData = await fetchMovies(searchKeyword, newPage);
        setMovies(moviesData.Search);
        setLastPage(Math.ceil(moviesData.totalResults / 10));
      } catch (error: any) {
        console.error(error.message);
        setMovies([]);
      }
    }
    scrollUp();
  };

  const handleGoToFirstPage = () => handlePaginationArrow(1);
  const handleGoToLastPage = () => handlePaginationArrow(lastPage);
  const handleLeftPaginationArrow = () => handlePaginationArrow(page - 1);
  const handleRightPaginationArrow = () => handlePaginationArrow(page + 1);

  return (
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
  );
};

export default Pagination;
