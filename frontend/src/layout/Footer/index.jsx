import { Link } from "react-router-dom";
import bocongthuong from "../../assets/Images/bocongthuong.svg";

function Footer() {
  return (
    <div className="bg-(--primary-bold) text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-4 border-y pt-20 pb-10">
          <div>
            <Link to="/">
              <img
                className="mb-4 w-[12vw] object-cover"
                src="https://medicen.peacefulqode.co.in/wp-content/uploads/2024/05/logo-white.webp"
                atl="Image Logo"
              />
            </Link>
            <p>
              <b>Website:</b> https://medicen.com
            </p>
            <p>
              <b>Email:</b> cskh@medicen.com
            </p>
          </div>

          <div>
            <div className="mb-2">
              <b>Liên hệ hợp tác</b>
            </div>
            <div>Cơ sở y tế</div>
            <div>Phòng mạch</div>
            <div>Doanh nghiệp</div>
            <div>Quảng cáo</div>
            <div>Tuyển Dụng</div>
          </div>

          <div>
            <div className="mb-2">
              <b>Tin tức</b>
            </div>
            <div>Tin dịch vụ</div>
            <div>Tin Y Tế</div>
            <div className="mb-2">Y Học thường thức</div>

            <div className="grid grid-cols-2">
              <img src={bocongthuong} alt="Image" className="mb-3 w-[90%]" />
              <img
                className="w-[90%]"
                src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbocongthuong.53714ee6.png&w=1920&q=75"
                alt="Image"
              />
              <img
                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_ios.svg%3Ft%3D11111111&w=1920&q=75"
                alt="Image"
                className="w-[90%]"
              />
              <img
                className="w-[90%]"
                src="https://medpro.vn/_next/image?url=https%3A%2F%2Fbo-api.medpro.com.vn%2Fstatic%2Fimages%2Fmedpro%2Fweb%2Ficon_google_play.svg%3Ft%3D1111111&w=1920&q=75"
                alt="Image"
              />
            </div>
          </div>

          <div>
            <div className="mb-2">
              <b>Về Medicen</b>
            </div>
            <div>Giới thiệu</div>
            <div>Điều khoản dịch vụ</div>
            <div>Chính sách bảo mật</div>
            <div>Quy định sử dụng</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-5">
          <div> © 2020 - Bản quyền thuộc Công Ty Cổ Phần Ứng Dụng PKH</div>
          <div>
            <img
              src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-06.png?ID=c40b02e0-e3fb-4099-8bfa-16900ae9bd87"
              alt="T"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
