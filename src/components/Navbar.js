import React from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  return (
    <div>
      <nav className="flex justify-between items-center bg-blue-600 p-2 text-white">
        <div className="font-bold text-xl cursor-pointer mx-6">
          mynutritionpal
        </div>

        <ul className="hidden sm:flex flex:1 justify-end items-center text-sm uppercase gap-12 mb-0">
          <li className="cursor-pointer">
            <Link className="text-white no-underline" to="/">Food Diary</Link>
          </li>
          <li className="cursor-pointer">
            <Link className="text-white no-underline" to="/create">Create Food Log</Link>
          </li>
          <li className="cursor-pointer">
            <Link className="text-white no-underline" to="/user">Create User</Link>
          </li>
          <button
            type="button"
            className="bg-gray-200 text-black rounded-md px-3 py-2 uppercase"
          >
            Log In
          </button>
        </ul>

        <div className="flex sm:hidden flex-1 justify-end">
          <FaBars />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
