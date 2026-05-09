import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HiStar } from "react-icons/hi";
import { createRating } from "@/services/catalogService";
import toast from "react-hot-toast";

function RatingModal({ isOpen, onOpenChange, appointment, onRated }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser) {
        toast.error("Vui lòng đăng nhập để đánh giá");
        return;
      }

      await createRating({
        doctor_id: appointment.doctorId,
        doctor_name: appointment.doctorName,
        user_id: currentUser.id,
        appointment_id: appointment.originalId,
        rating: rating,
        feedback: feedback,
      });

      toast.success("Cảm ơn bạn đã đánh giá dịch vụ!");
      onRated();
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      const msg = error.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau!";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[10001] rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase text-center">
            Đánh giá dịch vụ
          </DialogTitle>
          <p className="mt-2 text-center text-sm font-bold text-slate-400 italic">
            Chia sẻ trải nghiệm của bạn về Bác sĩ và quá trình điều trị
          </p>
        </DialogHeader>

        <div className="my-6 flex flex-col items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <HiStar
                  size={40}
                  className={`${
                    star <= rating ? "text-amber-400" : "text-slate-200"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <p className="mt-3 font-black text-amber-500 uppercase tracking-widest text-xs">
            {rating === 5 ? "Rất hài lòng" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : "Tệ"}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Nhận xét của bạn
            </label>
            <Textarea
              placeholder="Nhập cảm nhận của bạn về bác sĩ và dịch vụ..."
              className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus:border-blue-200 focus:ring-blue-100"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-8 flex-col gap-3 sm:flex-col">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 w-full rounded-2xl bg-blue-600 font-black text-white uppercase shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá ngay"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-12 w-full rounded-2xl font-black text-slate-400 uppercase hover:bg-slate-50"
          >
            Để sau
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RatingModal;
