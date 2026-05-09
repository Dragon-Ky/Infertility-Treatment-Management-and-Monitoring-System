import { useEffect, useState } from "react";
import { getAllDoctors } from "@/services/catalogService";
import { Link } from "react-router-dom";
import { HiOutlineStar, HiOutlineLocationMarker, HiOutlineAcademicCap } from "react-icons/hi";
import AddAppointmentModal from "@/components/AddAppointmentModal";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
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
    return <div className="min-h-screen py-20 text-center font-bold">Đang tải danh sách bác sĩ...</div>;
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Đội ngũ chuyên gia y tế</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Hội tụ những chuyên gia hàng đầu trong lĩnh vực hỗ trợ sinh sản, tận tâm đồng hành cùng gia đình bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
            >
              <div className="relative h-80 overflow-hidden">
                <Link to={`/doctors/${doctor.id}`}>
                  <img
                    src={doctor.avatar || "https://via.placeholder.com/400x500"}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                  />
                </Link>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-black text-blue-600 uppercase tracking-widest">
                  {doctor.degree}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-1 text-orange-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <HiOutlineStar key={i} fill={i < Math.floor(doctor.rating_avg || 5) ? "currentColor" : "none"} />
                  ))}
                  <span className="text-slate-400 text-xs font-bold ml-1">({doctor.rating_count || 0} đánh giá)</span>
                </div>
                
                <Link to={`/doctors/${doctor.id}`}>
                  <h3 className="text-2xl font-black text-slate-800 mb-1 hover:text-blue-600 transition-colors cursor-pointer">{doctor.full_name}</h3>
                </Link>
                <p className="text-blue-600 font-bold text-sm mb-6 uppercase tracking-wider">{doctor.specialization}</p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <HiOutlineAcademicCap className="text-blue-500" size={18} />
                    <span>{doctor.experience_years} năm kinh nghiệm</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <HiOutlineLocationMarker className="text-blue-500" size={18} />
                    <span>Khoa Hỗ trợ sinh sản</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-50 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí tư vấn</span>
                    <span className="text-lg font-black text-slate-900">
                        {new Intl.NumberFormat("vi-VN").format(doctor.consultation_fee || 500000)} ₫
                    </span>
                  </div>
                  <div className="flex-1">
                    <button 
                      onClick={() => {
                        setSelectedDoctorId(doctor.id);
                        setIsModalOpen(true);
                      }}
                      className="w-full cursor-pointer bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      Đặt lịch ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAppointmentModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        initialDoctorId={selectedDoctorId}
        initialDoctorName={doctors.find(d => d.id === selectedDoctorId)?.full_name}
        onAdded={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default DoctorList;
