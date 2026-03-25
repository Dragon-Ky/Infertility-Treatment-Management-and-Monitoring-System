import { GrDocumentUser } from "react-icons/gr";
import { LuNotebookPen } from "react-icons/lu";
import { GiMedicines } from "react-icons/gi";
import { TbTimeline } from "react-icons/tb";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { BiRightArrow } from "react-icons/bi";
import React from "react";

function Home_S4() {
  const procedureHome = [
    {
      id: 1,
      icon: <GrDocumentUser />,
      title: "Tư vấn & Thăm khám",
      desc: "Đánh giá sức khỏe tổng quát, thực hiện các xét nghiệm chuyên sâu cho cả hai vợ chồng để xác định nguyên nhân.",
    },
    {
      id: 2,
      icon: <LuNotebookPen />,
      title: "Phác đồ Cá nhân",
      desc: "Xây dựng lộ trình điều trị riêng biệt dựa trên tình trạng sức khỏe, đảm bảo hiệu quả cao nhất và tiết kiệm thời gian.",
    },
    {
      id: 3,
      icon: <GiMedicines />,
      title: "Thực hiện Điều trị",
      desc: "Tiến hành các thủ thuật chuyên môn (Kích trứng, IUI, IVF...) với hệ thống trang thiết bị hiện đại và phòng Lab đạt chuẩn.",
    },
    {
      id: 1,
      icon: <TbTimeline />,
      title: "Theo dõi & Kết quả",
      desc: "Chăm sóc sau thủ thuật, nhắc lịch kiểm tra và đồng hành cùng gia đình cho đến khi quá trình thụ thai thành công.",
    },
  ];

  return (
    <div className="py-20">
      <div className="mx-auto lg:max-w-4xl xl:max-w-7xl">
        <div className="box-head">Quy trình Điều trị</div>
        <div className="mb-9 text-center text-[1vw]">
          Lộ trình khoa học giúp hiện thực hóa ước mơ làm cha mẹ
        </div>

        <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {procedureHome.map((proce, index) => (
            <React.Fragment key={proce.id}>
              <div className="btn-smooth rounded-xl bg-(--bg-section) px-[1vw] py-[5vh]">
                <div className="mb-3 flex justify-center text-4xl">
                  {proce.icon}
                </div>
                <p className="mb-3 text-center font-bold">{proce.title}</p>
                <p className="mb-3 min-h-[8vh] text-center">{proce.desc}</p>
                <Link>
                  <button className="hv-transition mx-auto flex cursor-pointer items-center rounded-lg text-sm font-semibold text-(--primary) hover:text-(--primary-bold)">
                    <span>Đăng ký tư vấn ngay</span>
                    <span>
                      <MdOutlineKeyboardDoubleArrowRight />
                    </span>
                  </button>
                </Link>
              </div>

              {index !== procedureHome.length - 1 && (
                <div className="flex justify-center text-3xl text-gray-400 transition-all duration-300 hover:translate-x-1">
                  <BiRightArrow />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home_S4;
