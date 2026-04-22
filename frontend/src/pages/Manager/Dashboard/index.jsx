import { useEffect, useState } from "react";
import { getDoctors } from "@/services/managerService";

function ManagerDashboard() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Quản lý Đội ngũ Bác sĩ</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="font-bold text-blue-600">{doc.name}</h3>
            <p className="text-gray-600">{doc.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerDashboard;
