import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navToggle } from "../../store/slice/toggleSlice";
import { useDispatch } from "react-redux";
import {
  faCalendarDays,
  faImage,
  faPhotoFilm,
  faSquarePollVertical,
  faTablet,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="lg:hidden ">
      <aside
        id="default-sidebar"
        className="fixed top-0 right-0 z-40 w-64 h-screen transition-transform "
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gradient-to-r from-blue-700 to-blue-800 ">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                ACT DIGI BOARD
              </span>
            </a>
            <button
              onClick={() => dispatch(navToggle())}
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm  rounded-lg border border-white text-white hover:bg-gray-700 focus:ring-gray-600 active:scale-110"
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faXmark} className="scale-125" />
            </button>
          </div>
          <hr className="h-px my-4 border-0 bg-gray-700"></hr>
          <ul className="space-y-4 font-medium ">
            <li>
              <button
                type="button"
                onClick={() => (window.location.href = "/content")}
                className="w-full  nav-btn"
              >
                <FontAwesomeIcon icon={faPhotoFilm} />
                <span className="ml-3">Content</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="w-full  nav-btn"
                onClick={() => (window.location.href = "/devices")}
              >
                <FontAwesomeIcon icon={faTablet} />
                <span className="ml-3">Devices</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/interactive")}
                type="button"
                className="w-full  nav-btn"
              >
                <FontAwesomeIcon icon={faPhotoFilm} />
                <span className="ml-3">Interactive</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/playlist")}
                type="button"
                className="w-full  nav-btn"
              >
                <FontAwesomeIcon icon={faImage} />
                <span className="ml-3">Playlist</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/devices")}
                type="button"
                className="w-full  nav-btn"
              >
                <FontAwesomeIcon icon={faCalendarDays} />
                <span className="ml-3">Scheduling</span>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="w-full  nav-btn"
                onClick={() => (window.location.href = "/report")}
              >
                <FontAwesomeIcon icon={faSquarePollVertical} />
                <span className="ml-3">Report</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  dispatch(logout());
                  window.location.href = "/signin";
                }}
                type="button"
                className="w-full  nav-btn"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ml-3">{localStorage.getItem('username')}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="opacity-20 fixed inset-0 z-20 bg-black"></div>
    </div>
  );
};

export default SideNav;
