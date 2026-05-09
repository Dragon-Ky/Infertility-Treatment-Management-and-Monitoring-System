import { useEffect, useState } from "react";
import { getAllServices } from "@/services/catalogService";
import { TfiArrowCircleRight } from "react-icons/tfi";
import IUI from "../../assets/Images/iui.png";
import IVF from "../../assets/Images/ivf.png";
import MICRO from "../../assets/Images/micro.png";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        const mappedData = data.map((item) => {
          let img = MICRO;
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
    return <div className="min-h-screen py-20 text-center font-bold">Đang tải danh sách dịch vụ...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Danh mục dịch vụ điều trị</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Chúng tôi cung cấp các giải pháp hỗ trợ sinh sản tiên tiến nhất với đội ngũ chuyên gia giàu kinh nghiệm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-blue-100 flex flex-col h-full"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-colors">
              <img src={service.img} alt={service.name} className="h-10 w-10 object-contain group-hover:invert transition-all" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-4">{service.name}</h3>
            <p className="text-slate-500 leading-relaxed mb-6 line-clamp-4">
              {service.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
              <span className="text-blue-600 font-black text-lg">
                {new Intl.NumberFormat("vi-VN").format(service.price)} ₫
              </span>
              <div className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all cursor-pointer">
                <span>Chi tiết</span>
                <TfiArrowCircleRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceList;
