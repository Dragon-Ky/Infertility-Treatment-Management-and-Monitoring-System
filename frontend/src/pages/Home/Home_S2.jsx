import { useEffect, useState } from "react";
import IUI from "../../assets/Images/iui.png";
import IVF from "../../assets/Images/ivf.png";
import MICRO from "../../assets/Images/micro.png";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { getAllServices } from "@/services/catalogService";

function Home_S2() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        // Gán ảnh dựa trên tên dịch vụ (nếu có)
        const mappedData = data.map((item) => {
          let img = MICRO; // mặc định
          if (item.name.toUpperCase().includes("IUI")) img = IUI;
          if (item.name.toUpperCase().includes("IVF")) img = IVF;
          return { ...item, img };
        });
        setServices(mappedData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center">
        Đang tải dịch vụ...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-20">
      <div className="box-head">Dịch vụ điều trị nổi bật</div>
      <div className="mb-9 text-center text-[1vw]">
        Lộ trình tối ưu cho hạnh phúc gia đình
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.length > 0 ? (
          services.slice(0, 3).map((service) => (
            <div
              className="btn-smooth rounded-lg border border-gray-400 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] h-full"
              key={service.id}
            >
              <div className="cursor-pointer p-[1.5vw] flex flex-col h-full">
                <img
                  className="mx-auto mb-4 h-[6vw] w-[6vw] object-cover"
                  src={service.img}
                  alt={service.name}
                />
                <p className="mb-3 text-center text-[1.3vw] font-extrabold">
                  {service.name}
                </p>
                <p className="mb-4 text-center line-clamp-3">
                  {service.description}
                </p>
                <div className="hv-transition flex items-center justify-center gap-1 text-(--primary) hover:text-(--primary-bold) mt-auto">
                  <p>Tìm hiểu thêm</p>
                  <TfiArrowCircleRight />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center">Chưa có dịch vụ nào.</div>
        )}
      </div>
    </div>
  );
}

export default Home_S2;
