import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import {
  FaMoon,
  FaBell,
  FaGlobe,
  FaMoneyBillWave,
  FaPalette
} from "react-icons/fa6";

function Settings() {
  return (
    <div className="flex min-h-screen bg-[#070B28] text-white">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold">
            Settings
          </h1>

          <p className="text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
            Customize your dashboard experience
          </p>
        </div>

        {/* Settings Container */}
        <div
          className="
          bg-[#11183C]
          p-4 sm:p-6 lg:p-8
          rounded-3xl lg:rounded-[40px]
          border border-[#26316A]
          w-full
          max-w-6xl
          "
        >

          {/* DARK MODE */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                w-14 h-14
                sm:w-16 sm:h-16
                rounded-2xl
                bg-cyan-500
                flex items-center justify-center
                text-2xl sm:text-3xl
                "
              >
                <FaMoon />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Dark Mode
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Enable dashboard dark theme
                </p>
              </div>
            </div>

            <button
              className="
              bg-green-500
              px-5 py-2
              rounded-xl
              font-bold
              text-sm sm:text-lg
              "
            >
              ON
            </button>
          </div>

          {/* Notifications */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                w-14 h-14
                sm:w-16 sm:h-16
                rounded-2xl
                bg-purple-500
                flex items-center justify-center
                text-2xl sm:text-3xl
                "
              >
                <FaBell />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Notifications
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Manage alerts and reminders
                </p>
              </div>
            </div>

            <button
              className="
              bg-purple-500
              px-5 py-2
              rounded-xl
              font-bold
              text-sm sm:text-lg
              "
            >
              Enabled
            </button>
          </div>

          {/* Language */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                w-14 h-14
                sm:w-16 sm:h-16
                rounded-2xl
                bg-blue-500
                flex items-center justify-center
                text-2xl sm:text-3xl
                "
              >
                <FaGlobe />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Language
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  English (India)
                </p>
              </div>
            </div>

            <button
              className="
              bg-blue-500
              px-5 py-2
              rounded-xl
              font-bold
              text-sm sm:text-lg
              "
            >
              Change
            </button>
          </div>

          {/* Currency */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            sm:flex-row
            sm:justify-between
            sm:items-center
            gap-4
            mb-5
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                w-14 h-14
                sm:w-16 sm:h-16
                rounded-2xl
                bg-green-500
                flex items-center justify-center
                text-2xl sm:text-3xl
                "
              >
                <FaMoneyBillWave />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Currency
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  INR (₹)
                </p>
              </div>
            </div>

            <button
              className="
              bg-green-500
              px-5 py-2
              rounded-xl
              font-bold
              text-sm sm:text-lg
              "
            >
              Update
            </button>
          </div>

          {/* Theme Color */}
          <div
            className="
            bg-[#0D1335]
            p-4 sm:p-6
            rounded-3xl
            flex
            flex-col
            lg:flex-row
            lg:justify-between
            lg:items-center
            gap-4
            hover:bg-[#151E4D]
            transition
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                w-14 h-14
                sm:w-16 sm:h-16
                rounded-2xl
                bg-pink-500
                flex items-center justify-center
                text-2xl sm:text-3xl
                "
              >
                <FaPalette />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  Theme Color
                </h2>

                <p className="text-gray-400 text-sm sm:text-base">
                  Customize dashboard colors
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-500 cursor-pointer"></div>
            </div>
          </div>

        </div>

      </div>

      
                {/* FOOTER - CONSTANT */}
        <div className="mt-10">
          <Footer />
        </div>
    </div>
  );
}

export default Settings;