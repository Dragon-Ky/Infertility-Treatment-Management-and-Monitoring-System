import { getAllManagers } from "@/services/admin/adminService";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await getAllManagers();
        setManagers(res.data);
      } catch (error) {
        console.error("Lỗi lấy danh sách quản lí:", error);
      }
    };
    fetchManagers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Quản lí đội ngũ Managers</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {managers.map((man) => (
          <div
            key={man.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <h3 className="font-bold text-blue-600">{man.name}</h3>
            <p className="text-gray-600">{man.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
