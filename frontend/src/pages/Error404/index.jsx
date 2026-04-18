import React from "react";
import { Link } from "react-router-dom";
import { FaGhost, FaHome } from "react-icons/fa";

function Error404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-5 text-center">
      <FaGhost className="mb-4 text-8xl text-gray-400" />
      <h1 className="mb-2 text-6xl font-bold text-blue-600">404</h1>
      <p className="mb-6 text-xl text-gray-600">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di dời.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all hover:bg-black"
      >
        <FaHome /> Trở về nhà thôi
      </Link>
    </div>
  );
}

export default Error404;
