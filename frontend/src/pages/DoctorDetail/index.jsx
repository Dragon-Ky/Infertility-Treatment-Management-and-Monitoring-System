import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoctorDetail, getDoctorRatings } from "@/services/catalogService";
import { 
  HiOutlineStar, 
  HiStar, 
  HiOutlineAcademicCap, 
  HiOutlineLocationMarker, 
  HiOutlineClock, 
  HiOutlineBadgeCheck,
  HiOutlineChevronLeft,
  HiOutlineChatAlt2
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AddAppointmentModal from "@/components/AddAppointmentModal";

function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docRes, ratingsRes] = await Promise.all([
          getDoctorDetail(id),
          getDoctorRatings(id)
        ]);

        console.log("Dữ liệu Bác sĩ:", docRes);
        console.log("Dữ liệu Đánh giá:", ratingsRes);

        setDoctor(docRes.data || docRes);
        
        const rData = ratingsRes.data || ratingsRes;
        setReviews(rData.ratings || []);
        setStats({
          avg: rData.rating_avg || 0,
          count: rData.rating_count || 0
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="p-20 text-center font-black text-slate-400">KHÔNG TÌM THẤY THÔNG TIN BÁC SĨ</div>;
  }

  // Tính toán phân bổ sao
  const starDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Nút quay lại */}
        <Link to="/doctors" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
          <HiOutlineChevronLeft size={20} /> Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN BÁC SĨ */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden rounded-[40px] border-none shadow-xl shadow-blue-100/20">
              <div className="relative h-[400px]">
                <img 
                  src={doctor.avatar || "https://via.placeholder.com/400x500"} 
                  alt={doctor.full_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-[32px] shadow-lg">
                  <Badge className="mb-2 bg-blue-600 text-[10px] font-black uppercase tracking-widest">{doctor.degree}</Badge>
                  <h1 className="text-2xl font-black text-slate-900 leading-tight">{doctor.full_name}</h1>
                  <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">{doctor.specialization}</p>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-blue-600">
                        <HiOutlineAcademicCap size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kinh nghiệm</p>
                        <p className="text-sm font-bold">{doctor.experience_years} năm trong ngành</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-blue-600">
                        <HiOutlineLocationMarker size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Công tác tại</p>
                        <p className="text-sm font-bold">Khoa Hỗ trợ sinh sản - Medicen</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phí tư vấn</p>
                        <p className="text-2xl font-black text-slate-900">{new Intl.NumberFormat("vi-VN").format(doctor.consultation_fee || 500000)} ₫</p>
                      </div>
                      <HiOutlineBadgeCheck className="text-green-500" size={32} />
                   </div>
                   <div className="flex-1">
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-widest shadow-lg shadow-slate-200 cursor-pointer transition-all active:scale-95"
                    >
                        Đặt lịch tư vấn ngay
                    </Button>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-none bg-blue-600 p-8 text-white shadow-xl shadow-blue-200">
                <HiOutlineClock size={32} className="mb-4 opacity-50" />
                <h4 className="text-lg font-black uppercase tracking-tight mb-2">Giờ làm việc</h4>
                <p className="text-sm font-medium opacity-90 leading-relaxed italic">
                  "Bác sĩ luôn sẵn sàng hỗ trợ các cặp đôi vào giờ hành chính từ Thứ 2 đến Thứ 7."
                </p>
            </Card>
          </div>

          {/* CỘT PHẢI: ĐÁNH GIÁ & BÌNH LUẬN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tóm tắt đánh giá */}
            <Card className="rounded-[40px] border-none bg-white p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:border-r border-slate-100 md:pr-12">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Đánh giá trung bình</p>
                        <div className="text-7xl font-black text-slate-900 mb-2">{stats.avg}</div>
                        <div className="flex justify-center gap-1 text-orange-400 mb-2">
                             {[...Array(5)].map((_, i) => (
                                <HiStar key={i} size={24} fill={i < Math.floor(stats.avg) ? "currentColor" : "#e2e8f0"} />
                             ))}
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stats.count} lượt đánh giá</p>
                    </div>

                    <div className="space-y-3">
                        {starDistribution.map((item) => (
                            <div key={item.star} className="flex items-center gap-4">
                                <span className="w-12 text-xs font-black text-slate-400 uppercase tracking-widest">{item.star} sao</span>
                                <Progress value={item.percentage} className="h-2 flex-1 bg-slate-100" />
                                <span className="w-8 text-right text-xs font-bold text-slate-400">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Danh sách bình luận */}
            <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-800 uppercase tracking-tight">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-blue-600">
                        <HiOutlineChatAlt2 size={22} />
                    </div>
                    Phản hồi từ bệnh nhân
                </h3>

                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <Card key={review.id} className="rounded-[32px] border-none bg-white p-8 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                                            {review.user_name?.charAt(0) || "B"}
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-800">Bệnh nhân #{review.user_id}</h5>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(review.created_at).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 text-orange-400">
                                        {[...Array(5)].map((_, i) => (
                                            <HiStar key={i} size={16} fill={i < review.rating ? "currentColor" : "#e2e8f0"} />
                                        ))}
                                    </div>
                                </div>
                                <div className="relative pl-6 border-l-4 border-blue-100">
                                    <p className="text-slate-600 font-medium leading-relaxed italic">
                                        "{review.feedback || "Bệnh nhân không để lại nội dung đánh giá."}"
                                    </p>
                                    <Badge className="mt-4 bg-green-50 text-green-600 border-none shadow-none text-[9px] font-black uppercase tracking-widest">
                                        <HiOutlineBadgeCheck className="mr-1" size={12} /> Đã hoàn thành điều trị
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="rounded-[32px] border-none bg-white p-20 text-center shadow-sm">
                        <p className="font-black text-slate-300 uppercase tracking-[0.2em] italic">Chưa có bình luận nào cho bác sĩ này</p>
                    </Card>
                )}
            </div>
          </div>
        </div>
      </div>

      <AddAppointmentModal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        initialDoctorId={id}
        initialDoctorName={doctor?.full_name}
        onAdded={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default DoctorDetail;
