import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { FaBars, FaTimesCircle } from "react-icons/fa";
import Auth from "../auth.js";

//a lot of code below is from https://dev.to/prnvbirajdar/the-easiest-way-to-build-a-responsive-navbar-using-tailwind-react-2803. this allowed me to make the navbar responsive

function Navbar(props) {
  let { user } = props;

  const [isOpen, setIsOpen] = useState(false);
  //user is an object we got from props 
  //if user object is not empty then we will show the navbar for logged in users
  if (Object.keys(user).length !== 0) {
    return (
      <div>
        <nav className="bg-blue-600 sm:text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center w-full justify-between">
                <div className="flex-shrink-0">
                  <Link
                    className="font-bold text-xl cursor-pointer text-white no-underline inline-flex"
                    to="/"
                  >
                    mynutritionpal
                  </Link>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                      className="hover:bg-blue-700 text-white px-3 py-2 rounded-md text-md font-medium no-underline"
                      to="/"
                    >
                      Food Diary
                    </Link>

                    <Link
                      className="hover:bg-blue-700 text-white px-3 py-2 rounded-md text-md font-medium no-underline"
                      to="/myfoods"
                    >
                      My Foods
                    </Link>

                    <button
                      type="button"
                      className="bg-gray-300 text-black rounded-md px-3 py-2 uppercase"
                      onClick={() => {
                        Auth.logout(() => {
                          window.location.href = "/";
                        });
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  {/* if navbar was not open, we show the hamburger,otherwise it is open so show the X */}
                  {!isOpen ? (
                    <FaBars />
                  ) : (
                    <FaTimesCircle />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Transition below contains the navbar menu in mobile view. It is gotten from
          https://dev.to/prnvbirajdar/the-easiest-way-to-build-a-responsive-navbar-using-tailwind-react-2803*/}
          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {() => (
              <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pb-3 space-y-1">
                  <Link
                    className="block  hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium no-underline"
                    to="/"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Food Diary
                  </Link>

                  <Link
                    className="block  hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base font-medium no-underline"
                    to="/myfoods"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    My Foods
                  </Link>
                  <button
                      type="button"
                      className="block  hover:bg-blue-700 w-full text-white px-3 text-left py-2 rounded-md text-base font-medium no-underline"
                      onClick={() => {
                        Auth.logout(() => {
                          window.location.href = "/";
                        });
                      }}
                    >
                      Log Out
                    </button>
                </div>
              </div>
            )}
          </Transition>
        </nav>
      </div>
    );
  }else {
    //user is not logged in so we just show a login button 
    return (
      <div>
        <nav className="flex justify-between items-center bg-blue-600 p-2 text-white">
          <div className="font-bold text-xl cursor-pointer mx-6">
            <Link className="text-white no-underline" to="/">
              mynutritionpal
            </Link>
          </div>
  
          <ul className="sm:flex flex:1 justify-end items-center text-sm uppercase gap-12 mb-0">
            <li className="cursor-pointer">
              <Link className="text-white no-underline" to="/login">
                <button
                  type="button"
                  className="bg-gray-200 text-black rounded-md px-3 py-2 uppercase"
                >
                  Log In
                </button>
              </Link>
            </li>
          </ul>
  
        </nav>
      </div>
    );
  }
}

export default Navbar;
