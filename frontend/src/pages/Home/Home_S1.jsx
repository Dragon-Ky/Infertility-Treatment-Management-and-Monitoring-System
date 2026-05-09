import { Link } from "react-router-dom";
import BannerHome from "../../assets/Images/banner-home.png";

function Home_S1() {
  return (
    <div className="relative">
      <img src={BannerHome} alt="Image Banner Home" />

      <div className="mx-auto max-w-7xl">
        <div className="absolute top-[25%] z-1 max-w-xl">
          <p className="mb-3 text-4xl/11 font-bold uppercase">
            Hành trình chào đón thiên thần nhỏ cùng MEDICEN
          </p>
          <p className="mb-4 max-w-lg text-black">
            Phần mềm quản lý và theo dõi điều trị hiếm muộn chuyên nghiệp - Đồng
            hành cùng bạn trên con đường tìm kiếm hạnh phúc gia đình
          </p>

          <Link to="">
            <button className="inline-flex transform cursor-pointer rounded-[20px] border border-white bg-(--primaryCustom) px-[1vw] py-[0.7vw] font-semibold text-white transition-(--hv-transition) duration-300 hover:translate-y-0.75 hover:border-(--primaryCustom) hover:bg-white hover:text-(--primaryCustom)">
              Khám phá dịch vụ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home_S1;
