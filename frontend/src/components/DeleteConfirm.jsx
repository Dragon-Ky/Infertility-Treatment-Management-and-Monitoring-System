import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HiOutlineTrash } from "react-icons/hi";

function DeleteConfirm({ onConfirm, description }) {
  return (
    <AlertDialog>
      {/* */}

      <AlertDialogTrigger asChild>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 shadow-sm transition-colors hover:bg-red-600 hover:text-white">
          <HiOutlineTrash size={18} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[32px] border-none p-8 shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black tracking-tighter text-slate-800 uppercase">
            Xác nhận gỡ bỏ?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-bold text-slate-400 italic">
            "Hành động này sẽ xóa vĩnh viễn {description} khỏi hồ sơ Medicen và
            không thể khôi phục."
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="h-12 rounded-2xl border-none bg-slate-100 font-black tracking-widest text-slate-500 uppercase hover:bg-slate-200">
            Quay lại
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-12 rounded-2xl bg-red-500 font-black tracking-widest text-white uppercase shadow-lg shadow-red-100 hover:bg-red-600"
          >
            Đồng ý xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteConfirm;
