import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaHome } from "react-icons/fa";

function Error403() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-5 text-center">
      <FaShieldAlt className="mb-4 animate-bounce text-8xl text-red-500" />
      <h1 className="mb-2 text-6xl font-bold text-gray-800">403</h1>
      <p className="mb-6 text-xl text-gray-600">
        Rất tiếc! Bạn không có quyền truy cập vào khu vực này.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
      >
        <FaHome /> Quay lại Trang chủ
      </Link>
    </div>
  );
}

export default Error403;
