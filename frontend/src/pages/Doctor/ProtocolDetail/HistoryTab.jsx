import AddEventModal from "@/components/AddEventModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useProtocolData } from "@/contexts/ProtocolContext";
import { HiOutlineClock, HiOutlineCalendar, HiOutlineBell } from "react-icons/hi";
import { sendEmailNotification } from "@/services/notificationService";
import toast from "react-hot-toast";


function HistoryTab() {
  const { id, customer, events, fetchEvents, handleDeleteEvent } = useProtocolData();

  const handleSendEmail = async (event) => {
    try {
      if (!customer || !customer.email) {
        toast.error("Không tìm thấy email của bệnh nhân!");
        return;
      }

      const doctorStr = localStorage.getItem("user");
      const currentDoctor = doctorStr ? JSON.parse(doctorStr) : null;

      const emailData = {
        user_id: customer.id,
        email: customer.email,
        user_name: customer.name,
        appointment_type: event.event_type || "Sự kiện điều trị",
        appointment_date: new Date(event.event_date).toLocaleDateString("vi-VN"),
        appointment_time: new Date(event.event_date).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        doctor_name: currentDoctor?.name || "Bác sĩ phụ trách",
        notes: event.description || "",
      };

      await toast.promise(sendEmailNotification(emailData), {
        loading: "Đang gửi email thông báo...",
        success: "Đã gửi email thành công!",
        error: "Gửi email thất bại. Vui lòng kiểm tra cấu hình!",
      });
    } catch (error) {
      console.error("Lỗi gửi email:", error);
    }
  };


  return (
    <>
      <div className="mb-10 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Dòng thời gian sự kiện
        </h3>
        <AddEventModal protocolId={id} onEventAdded={fetchEvents} />
      </div>
      <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-1 before:bg-slate-100 md:before:mx-auto">
        {!events || events.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-slate-100 bg-white py-24 text-center">
            <p className="font-black tracking-widest text-slate-300 uppercase italic">
              Chưa có dữ liệu nhật ký sự kiện
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-50 bg-slate-900 text-white shadow-xl md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <HiOutlineClock size={18} />
              </div>
              <div className="w-[calc(100%-4.5rem)] rounded-[32px] border border-slate-50 bg-white p-8 shadow-sm transition-all hover:shadow-lg md:w-[45%]">
                <div className="mb-3 flex items-center justify-between">
                  <time className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-600 uppercase italic">
                    <HiOutlineCalendar size={14} />{" "}
                    {new Date(event.event_date).toLocaleString("vi-VN")}
                  </time>
                  <div className="flex items-center gap-3">
                    <Badge className="rounded-xl border-none bg-slate-900 px-3 text-[9px] font-black text-white uppercase">
                      {event.event_type}
                    </Badge>

                    <Button
                      onClick={() => handleSendEmail(event)}
                      variant="ghost"
                      className="h-8 w-8 cursor-pointer rounded-full p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      title="Gửi email thông báo"
                    >
                      <HiOutlineBell size={18} />
                    </Button>


                    <AddEventModal
                      protocolId={id}
                      onEventAdded={fetchEvents}
                      editData={event}
                    />

                    <DeleteConfirm
                      description="sự kiện nhật ký"
                      onConfirm={() => handleDeleteEvent(event.id)}
                    />
                  </div>
                </div>
                <p className="text-sm font-black tracking-tight text-slate-700 uppercase">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default HistoryTab;
