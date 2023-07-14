import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchMovies } from "@/utils/api";
import { useRouter } from "next/router";

interface SearchBarProps {
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setLastPage: React.Dispatch<React.SetStateAction<number>>;
  searchKeyword: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setMovies: React.Dispatch<React.SetStateAction<any[]>>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  setSearchKeyword,
  setLastPage,
  searchKeyword,
  page,
  setPage,
  setMovies,
}) => {
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastPage(0);
    setPage(1);
    setSearchKeyword(e.target.value);
    if (e.target.value === "") {
      router.push({
        pathname: "/",
      });
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("e: " + e.target);
    e.preventDefault();
    setLastPage(0);
    setPage(1);
    try {
      const moviesData = await fetchMovies(searchKeyword, 1);
      router.push({
        pathname: `/`,
        query: { searchKeyword, page },
      });
      setMovies(moviesData.Search);
      setLastPage(Math.ceil(moviesData.totalResults / 10));
    } catch (error: any) {
      console.error(error.message);
      setMovies([]);
    }
  };

  return (
    <form className="mb-20 sm:mb-10" onSubmit={handleFormSubmit}>
      <div className="flex flex-col sm:flex-row h-10 gap-5 sm:gap-1">
        <input
          type="text"
          value={searchKeyword}
          onChange={handleInputChange}
          placeholder="Search movies, series and more..."
          className="p-3 rounded-2xl text-[13px] sm:text-sm w-60 sm:w-80 outline-[#326660] ring-[#326660] text-[#326660] shadow-lg"
        />
        <button
          type="submit"
          className="p-2 h-full text-white self-center rounded-full bg-[#326660] hover:bg-[#449182] shadow-lg"
        >
          <AiOutlineSearch size={30} />
        </button>
      </div>
    </form>
  );
};
