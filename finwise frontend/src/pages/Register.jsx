import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight
} from "react-icons/fa6";

function Register() {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  };

  const handleRegister = async () => {

    try {

      const response = await API.post(
        "/auth/register",
        user
      );

      console.log(response.data);

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");

    }

  };

  return (

    <div
      className="
      min-h-screen
      bg-[#070B28]
      flex
      items-center
      justify-center
      px-4
      py-6
      "
    >

      <div
        className="
        bg-[#11183C]
        border
        border-[#26316A]
        p-6
        sm:p-8
        md:p-10
        lg:p-12
        rounded-[25px]
        sm:rounded-[35px]
        shadow-2xl
        w-full
        max-w-md
        md:max-w-lg
        "
      >

        {/* HEADER */}

        <div className="text-center mb-8">

          <h1
            className="
            text-3xl
            sm:text-4xl
            md:text-5xl
            font-black
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
            text-transparent
            bg-clip-text
            "
          >
            Create Account
          </h1>

          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Join FIN WISEE and manage your finances smartly
          </p>

        </div>

        {/* NAME */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-4
          mb-5
          "
        >

          <FaUser className="text-cyan-400 text-lg sm:text-xl" />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            className="
            bg-transparent
            outline-none
            w-full
            text-white
            text-sm
            sm:text-base
            "
          />

        </div>

        {/* EMAIL */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-4
          mb-5
          "
        >

          <FaEnvelope className="text-cyan-400 text-lg sm:text-xl" />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            className="
            bg-transparent
            outline-none
            w-full
            text-white
            text-sm
            sm:text-base
            "
          />

        </div>

        {/* PASSWORD */}

        <div
          className="
          bg-[#0D1335]
          p-4
          rounded-2xl
          flex
          items-center
          gap-4
          mb-8
          "
        >

          <FaLock className="text-pink-400 text-lg sm:text-xl" />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="
            bg-transparent
            outline-none
            w-full
            text-white
            text-sm
            sm:text-base
            "
          />

        </div>

        {/* REGISTER BUTTON */}

        <button
          onClick={handleRegister}
          className="
          w-full
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          p-4
          rounded-2xl
          text-base
          sm:text-lg
          md:text-xl
          font-bold
          flex
          items-center
          justify-center
          gap-3
          hover:scale-105
          transition
          duration-300
          shadow-2xl
          "
        >

          Create Account

          <FaArrowRight />

        </button>

        {/* LOGIN LINK */}

        <div
          className="
          text-center
          mt-6
          text-gray-400
          text-sm
          sm:text-base
          "
        >

          Already have an account?

          <Link
            to="/login"
            className="
            text-cyan-400
            ml-2
            hover:text-cyan-300
            "
          >
            Login
          </Link>

        </div>

      </div>

    </div>

  );

}

export default Register;