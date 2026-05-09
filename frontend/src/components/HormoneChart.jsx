
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const HormoneChart = ({ data }) => {
  // Hàm xử lý dữ liệu để Recharts hiểu được
  const chartData = data.map((item) => {
    // Bóc tách con số từ chuỗi "hcd:20" hoặc "Chỉ số xét nghiệm: 4.2"
    const rawValue = item.result_data[0] || "";
    const numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, "")) || 0;

    return {
      date: item.test_date,
      value: numericValue,
      unit: item.unit,
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sắp xếp theo ngày

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-[32px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
          />
          <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey="value"
            name="Chỉ số xét nghiệm"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 8, shadow: "0 0 10px rgba(37,99,235,0.5)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HormoneChart;