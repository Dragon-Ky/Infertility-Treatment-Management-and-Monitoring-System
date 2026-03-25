import IUI from "../../assets/Images/iui.png";
import IVF from "../../assets/Images/ivf.png";
import MICRO from "../../assets/Images/micro.png";
import { TfiArrowCircleRight } from "react-icons/tfi";

function Home_S2() {
  const servicesHome = [
    {
      id: 1,
      img: IUI,
      title: "IUI",
      des: "Kỹ thuật hỗ trợ sinh sản bằng cách chọn lọc những tinh trùng khỏe mạnh nhất để bơm trực tiếp vào buồng tử cung vào ngày rụng trứng, giúp tăng tỉ lệ thụ thai tự nhiên.",
    },
    {
      id: 2,
      img: IVF,
      title: "IVF",
      des: "Phương pháp hiện đại giúp trứng và tinh trùng kết hợp trong phòng thí nghiệm để tạo thành phôi, sau đó phôi được chuyển lại vào tử cung của người mẹ.",
    },
    {
      id: 3,
      img: MICRO,
      title: "Khám & Chuẩn đoán",
      des: "Quản lý thông tin khám lâm sàng và các kết quả xét nghiệm định kỳ",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl py-20">
      <div className="box-head">Dịch vụ điều trị nổi bật</div>
      <div className="mb-9 text-center text-[1vw]">
        Lộ trình tối ưu cho hạnh phúc gia đình
      </div>

      <div className="grid grid-cols-3 gap-6">
        {servicesHome.map((service) => (
          <div
            className="btn-smooth hover:text- rounded-lg border border-gray-400 shadow-[0px_3px_8px_rgba(0,0,0,0.24)]"
            key={service.id}
          >
            <div className="cursor-pointer p-[1.5vw]">
              <img
                className="mx-auto mb-4 h-[6vw] w-[6vw] object-cover"
                src={service.img}
                alt={`Image ${service.title}`}
              />
              <p className="mb-3 text-center text-[1.3vw] font-extrabold">
                {service.title}
              </p>
              <p className="mb-4 text-center">{service.des}</p>
              <div className="hv-transition flex items-center justify-center gap-1 text-(--primary) hover:text-(--primary-bold)">
                <p>Tìm hiểu thêm</p>
                <TfiArrowCircleRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home_S2;
