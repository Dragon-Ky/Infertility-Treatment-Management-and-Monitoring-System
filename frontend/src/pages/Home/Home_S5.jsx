import { Link } from "react-router-dom";

function Home_S5() {
  const blogHome = [
    {
      id: 1,
      images:
        "https://www.kidsplaza.vn/blog/wp-content/uploads/2025/08/raw-1024x683.png",
      title: "Cẩm nang chăm sóc sức khỏe toàn diện trước khi thực hiện IVF",
      desc: "Những lưu ý quan trọng về chế độ dinh dưỡng, tâm lý và sinh hoạt để chuẩn bị cho một thai kỳ khỏe mạnh.",
    },
    {
      id: 2,
      images:
        "https://img.lsvn.vn/resize/th/upload/2026/01/20/168599-639045077623056496-12092383.png",
      title:
        "Hành trình 10 năm tìm con và cái kết viên mãn nhờ phương pháp ICSI",
      desc: "Chia sẻ chân thực từ gia đình anh chị Minh - Hạnh về niềm tin và sự kiên trì trong hành trình đón thiên thần nhỏ.",
    },
    {
      id: 3,
      images:
        "https://afhanoi.com/wp-content/uploads/2023/04/BS.CKI-Pham-Van-Huong-Pho-giam-doc-chuyen-mon-Benh-vien-Nam-hoc-va-Hiem-muon-Ha-Noi-kham-tu-van-cho-benh-nhan.jpg",
      title: "Phân biệt phương pháp IUI và IVF: Lựa chọn nào phù hợp cho bạn?",
      desc: "Bác sĩ chuyên khoa giải thích chi tiết về sự khác biệt, tỉ lệ thành công và chi phí của từng phương pháp điều trị.",
    },
  ];

  return (
    <div className="bg-(--bg-section) py-20">
      <div className="mx-auto max-w-7xl">
        <div className="box-head">Blog & Tin tức</div>
        <div className="mb-9 text-center text-[1vw]">
          Kiến thức chuyên khoa và những câu chuyện truyền cảm hứng
        </div>

        <div className="grid grid-cols-3 gap-4">
          {blogHome.map((blog) => (
            <div className="cursor-pointer" key={blog.id}>
              <img
                className="mb-4 h-[55vh] w-[30vw] rounded-lg object-cover"
                src={blog.images}
                alt="Image Blog"
              />
              <p className="mb-2 text-center font-bold">{blog.title}</p>
              <p className="min-h-[11vh] text-center">{blog.desc}</p>
              <Link>
                <button className="hv-transition mx-auto flex cursor-pointer rounded-lg border bg-(--primary-bold) px-[1vw] py-[0.8vh] font-semibold text-white hover:border-(--primary-bold) hover:bg-transparent hover:text-(--primary-bold)">
                  Đọc thêm
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home_S5;
