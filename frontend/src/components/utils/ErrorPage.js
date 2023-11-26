import React from "react";

const ErrorPage = () => {
  return (
    <main className="mt-52 w-full flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold text-black tracking-widest">
        404
      </h1>
      <div className="bg-red-500 px-2 text-lg rounded rotate-12 absolute">
        Page Not Found
      </div>
      <button className="mt-5">
        <a
          href="/#"
          className="relative inline-block text-sm font-semibold bg-red-500 group active:text-red-500 focus:outline-none focus:ring"
        >
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-red-500 group-hover:translate-y-0 group-hover:translate-x-0"></span>

          <span className="relative block px-8 py-3 bg-red-500 text-white font-semibold text-md border border-current">
            <router-link to="/">Go Back</router-link>
          </span>
        </a>
      </button>
    </main>
  );
};

export default ErrorPage;
