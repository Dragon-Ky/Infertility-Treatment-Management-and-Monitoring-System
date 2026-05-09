import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDoctors } from "@/services/catalogService";

function Home_S3() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        // Backend trả về data trong object nếu dùng apiResource (tùy version Laravel)
        // Nhưng catalog controller đang trả trực tiếp mảng hoặc object
        const doctorsData = Array.isArray(data) ? data : (data.data || []);
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="bg-(--bg-section) py-20 text-center">
        Đang tải danh sách bác sĩ...
      </div>
    );
  }

  return (
    <div className="bg-(--bg-section) py-20">
      <div className="mx-auto max-w-7xl">
        <div className="box-head">Đội ngũ bác sĩ </div>
        <div className="mb-9 text-center text-[1vw]">
          Tận tâm vì giấc mơ làm cha mẹ
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.length > 0 ? (
            doctors.slice(0, 4).map((info) => (
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow" key={info.id}>
                <img
                  className="mb-4 h-[40vh] w-full rounded-lg object-cover"
                  src={info.avatar || "https://via.placeholder.com/300x400?text=No+Avatar"}
                  alt={info.full_name}
                />
                <p className="mb-2 text-center font-bold text-lg text-slate-800">
                  {info.degree} {info.full_name}
                </p>
                <p className="min-h-[6vh] text-center text-slate-500 text-sm mb-4">
                  {info.specialization}
                </p>
                <Link to="/customer/appointments">
                  <button className="hv-transition mx-auto flex cursor-pointer rounded-lg border bg-(--primary-bold) px-[1.5vw] py-[1vh] font-semibold text-white hover:border-(--primary-bold) hover:bg-transparent hover:text-(--primary-bold) w-full justify-center">
                    Đặt lịch khám
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-slate-400 italic">
              Hiện chưa có thông tin bác sĩ.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home_S3;
