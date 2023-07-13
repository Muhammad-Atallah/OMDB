import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export const MovieCard = ({
  Poster,
  Title,
  Year,
  Type,
  searchKeyword,
  page,
  recommendation,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (recommendation === "true") {
      router.push({
        pathname: `/recommend/${page}/${searchKeyword}/${Title}`,
        query: { searchKeyword, page }, // Pass the query parameters
      });
    } else {
      router.push({
        pathname: `/movie/${page}/${searchKeyword}/${Title}`,
        query: { searchKeyword, page }, // Pass the query parameters
      });
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="flex flex-col w-44 sm:w-56 cursor-pointer overflow-hidden group border-white border-2 rounded-md shadow-xl"
    >
      <img
        src={Poster}
        alt={Title}
        className="w-full h-60 sm:h-80 rounded-t-md transition duration-500 group-hover:scale-110"
      />
      <div className="flex flex-col justify-center gap-1 p-2 h-20 rounded-b-md  bg-[#FAF9F6] relative shadow-xl shadow-slate-900 transition duration-500 group-hover:bg-gray-100 group-hover:translate-y-2">
        <h1 className="text-[16px] self-center text-center text-black font-semibold">
          {Title}
        </h1>
        <h2 className="text-[12px] self-center text-center text-gray-600">
          {Type}, {Year}
        </h2>
      </div>
    </article>
  );
};
