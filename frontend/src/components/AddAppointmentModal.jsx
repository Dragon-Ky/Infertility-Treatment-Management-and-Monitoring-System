import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { HiOutlineCalendar } from "react-icons/hi";
import { FaUserMd } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { createAppointment } from "@/services/appointmentService";
import { getDoctors } from "@/services/managerService";

const formSchema = z.object({
  doctor_id: z.string({ required_error: "Vui lòng chọn bác sĩ" }),
  type: z.string({ required_error: "Vui lòng chọn loại khám" }),
  appointment_date: z.string().min(1, "Vui lòng chọn ngày khám"),
  appointment_time: z
    .string({ required_error: "Vui lòng chọn giờ khám" })
    .min(1, "Vui lòng chọn giờ khám"),
  notes: z.string().optional(),
});

const AddAppointmentModal = ({ isOpen, onOpenChange, onAdded }) => {
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);

  const todayString = new Date().toISOString().split("T")[0];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  //Gọi api lấy Bs
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        const res = await getDoctors();
        const doctorsData = res?.data || res || [];
        setDoctors(doctorsData);
      } catch (error) {
        console.error("Lỗi tải danh sách bác sĩ:", error);
        toast.error("Không thể tải danh sách bác sĩ.");
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const formattedData = {
        ...values,
        user_id: JSON.parse(localStorage.getItem("user"))?.id || 1,
      };

      await createAppointment(formattedData);
      toast.success("Đặt lịch khám thành công! Bác sĩ sẽ sớm xác nhận.");

      onOpenChange(false);
      form.reset();
      onAdded();
    } catch (error) {
      console.error("Lỗi tạo lịch:", error);
      toast.error("Thao tác thất bại! Kiểm tra lại dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999] rounded-[32px] border-none p-8 sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-800 uppercase">
            <FaUserMd className="text-(--primaryCustom)" />
            Thiết lập lịch khám
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Chọn BS - Đồng bộ api */}
              <FormField
                control={form.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                      Bác sĩ điều trị
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-(--primaryCustom)">
                          <SelectValue
                            placeholder={
                              isLoadingDoctors
                                ? "Đang tải..."
                                : "Chọn bác sĩ..."
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[10001] rounded-xl border-none bg-white p-2 shadow-2xl">
                        {isLoadingDoctors ? (
                          <div className="p-3 text-center text-xs font-bold text-slate-400">
                            Đang tải dữ liệu...
                          </div>
                        ) : doctors.length === 0 ? (
                          <div className="p-3 text-center text-xs font-bold text-slate-400">
                            Chưa có dữ liệu bác sĩ
                          </div>
                        ) : (
                          doctors.map((doc) => (
                            <SelectItem
                              key={doc.id}
                              value={doc.id.toString()}
                              className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                            >
                              {doc.name || `Bác sĩ ID: ${doc.id}`}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Loại khám */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                      Dịch vụ khám
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-xl border-none bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-(--primaryCustom)">
                          <SelectValue placeholder="Chọn dịch vụ..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[10001] rounded-xl border-none bg-white p-2 shadow-2xl">
                        <SelectItem
                          value="consultation"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Khám tư vấn
                        </SelectItem>
                        <SelectItem
                          value="ultrasound"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Siêu âm
                        </SelectItem>
                        <SelectItem
                          value="blood_test"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Xét nghiệm máu
                        </SelectItem>
                        <SelectItem
                          value="injection"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Tiêm thuốc
                        </SelectItem>
                        <SelectItem
                          value="egg_retrieval"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Chọc hút trứng
                        </SelectItem>
                        <SelectItem
                          value="embryo_transfer"
                          className="cursor-pointer rounded-lg font-bold transition-colors focus:bg-(--primaryCustom) focus:text-white"
                        >
                          Chuyển phôi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Ngày khám */}
              <FormField
                control={form.control}
                name="appointment_date"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                      Ngày khám
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={todayString}
                        className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-(--primaryCustom)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Giờ khám */}
              <FormField
                control={form.control}
                name="appointment_time"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                      Giờ dự kiến
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="h-12 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-(--primaryCustom)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ghi chú*/}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="ml-1 text-[10px] font-black text-slate-400 uppercase">
                    Ghi chú (Tùy chọn)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Tôi hay bị chóng mặt..."
                      className="min-h-[80px] resize-none rounded-xl border-none bg-slate-50 p-4 font-bold focus-visible:ring-2 focus-visible:ring-(--primaryCustom)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 h-14 w-full cursor-pointer rounded-2xl bg-(--primaryCustom) font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-blue-600 active:scale-95"
            >
              {loading ? "ĐANG XỬ LÝ..." : "HOÀN TẤT THIẾT LẬP"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentModal;
