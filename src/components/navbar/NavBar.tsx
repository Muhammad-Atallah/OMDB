import React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { RiMovie2Line } from "react-icons/ri";
const inter = Inter({ subsets: ["latin"] });
type NavBarProps = {};

const NavBar: React.FC<NavBarProps> = () => (
  <nav className="bg-[#3c7d70] text-white">
    <div className="flex flex-col sm:flex-row justify-center md:justify-around items-center w-full gap-4">
      <Link href="/">
        <div className="text-2xl mt-5 sm:py-4 sm:mx-20 sm:mt-0 flex">
          <RiMovie2Line size={40} color="white" />
          <h1>OMDB</h1>
        </div>
      </Link>

      <ul className="text-sm sm:text-lg flex text-center gap-3 sm:gap-10 p-4 sm:mx-10 md:mx-10 sm:w-auto w-full">
        <li className="border-gray-200 border-[1px] sm:border-none w-full sm:w-auto p-1 sm:px-3 rounded-lg cursor-pointer hover:bg-[#449182]">
          <Link href="/">Search</Link>
        </li>
        <li className="border-gray-200 border-[1px] sm:border-none w-full sm:w-auto p-1 sm:px-3 rounded-lg cursor-pointer hover:bg-[#449182]">
          <Link href="/recommend">Recommendations</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default NavBar;
