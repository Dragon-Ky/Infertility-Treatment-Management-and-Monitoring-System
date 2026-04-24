import AddLabResultModal from "@/components/AddLabResultModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import HormoneChart from "@/components/HormoneChart";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProtocolData } from "@/contexts/ProtocolContext";

function LabTab() {
  const { protocol, labResults, fetchLabResults, handleDeleteLab } =
    useProtocolData();
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
          Phân tích kết quả xét nghiệm
        </h3>

        <AddLabResultModal protocol={protocol} onAdded={fetchLabResults} />
      </div>

      <Card className="rounded-[32px] border-none bg-white p-6 shadow-sm">
        {labResults?.length > 0 ? (
          <HormoneChart data={labResults} />
        ) : (
          <div className="flex h-[300px] items-center justify-center font-bold tracking-widest text-slate-300 uppercase italic">
            Cần ít nhất 1 kết quả để hiển thị biểu đồ
          </div>
        )}
      </Card>

      <Card className="overflow-hidden rounded-[32px] border-none bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="p-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Ngày XN{" "}
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Loại xét nghiệm
              </TableHead>
              <TableHead className="text-center text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Giá trị
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Đơn vị
              </TableHead>
              <TableHead className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Ghi chú lâm sàng
              </TableHead>
              <TableHead className="pr-8 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!labResults || labResults.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center font-black text-slate-300 uppercase italic"
                >
                  Chưa có bản ghi xét nghiệm nào
                </TableCell>
              </TableRow>
            ) : (
              labResults.map((lab) => (
                <TableRow
                  key={lab.id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="p-6 text-xs font-bold tracking-tighter text-slate-500 uppercase">
                    {lab.test_date_formatted}
                  </TableCell>
                  <TableCell>
                    <Badge className="border-none bg-blue-50 px-3 py-1 text-[9px] font-black text-blue-600 uppercase">
                      {lab.test_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-black text-slate-800">
                      {lab.result_data[0]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-black text-slate-400 uppercase">
                    {lab.unit}
                  </TableCell>
                  <TableCell className="max-w-[200px] text-xs leading-relaxed font-medium text-slate-500 italic">
                    {lab.doctor_notes || "---"}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <DeleteConfirm
                      description="kết quả xét nghiệm"
                      onConfirm={() => handleDeleteLab(lab.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default LabTab;
