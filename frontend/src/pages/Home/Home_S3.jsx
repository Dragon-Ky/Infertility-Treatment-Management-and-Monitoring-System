import { Link } from "react-router-dom";

function Home_S3() {
  const infoDoctorHome = [
    {
      id: 1,
      avatar:
        "https://www.fvhospital.com/wp-content/uploads/2018/09/drminhhien.jpg",
      name: "ThS.BS Nguyễn Thanh Thảo",
      role: "Trưởng khoa Hỗ trợ sinh sản (IVF)",
    },
    {
      id: 2,
      avatar:
        "https://img.freepik.com/free-photo/doctor-hospital_1098-19685.jpg",
      name: "TS. BS Trần Văn Nam",
      role: "Chuyên gia Phẫu thuật Nội soi & Hiếm muộn",
    },
    {
      id: 3,
      avatar:
        "https://img.freepik.com/free-photo/portrait-woman-working-healthcare-system-as-pediatrician_23-2151686712.jpg?semt=ais_rp_50_assets&w=740&q=80",
      name: "ThS.BS Lê Thị Phương Anh",
      role: "Bác sĩ chuyên khoa Phụ sản & Vô sinh nam",
    },
    {
      id: 4,
      avatar:
        "https://www.fvhospital.com/wp-content/uploads/2020/10/Dr-Tran-Xuan-Tiem-5028.jpg",
      name: "BS. CKII. Phạm Minh Hoàng",
      role: "Chuyên gia Di truyền học & Sàng lọc phôi",
    },
  ];

  return (
    <div className="bg-(--bg-section) py-20">
      <div className="mx-auto max-w-7xl">
        <div className="box-head">Đội ngũ bác sĩ </div>
        <div className="mb-9 text-center text-[1vw]">
          Tận tâm vì giấc mơ làm cha mẹ
        </div>

        <div className="grid grid-cols-4 gap-4">
          {infoDoctorHome.map((info) => (
            <div className="" key={info.id}>
              <img
                className="mb-4 h-[55vh] w-[20vw] rounded-lg object-cover"
                src={info.avatar}
                alt="Image Doctor"
              />
              <p className="mb-2 text-center font-bold">{info.name}</p>
              <p className="min-h-[8vh] text-center">{info.role}</p>
              <Link to="/customer/appointments">
                <button className="hv-transition mx-auto flex cursor-pointer rounded-lg border bg-(--primary-bold) px-[1vw] py-[0.8vh] font-semibold text-white hover:border-(--primary-bold) hover:bg-transparent hover:text-(--primary-bold)">
                  Đặt lịch khám
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home_S3;
