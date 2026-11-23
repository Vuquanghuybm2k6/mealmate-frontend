import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F1EC] p-4 text-center text-[#202B24]">
      <div className="text-6xl mb-4">🍳</div>
      <h1 className="text-3xl font-black mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-sm text-[#77736D] mb-6 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi nơi khác.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[#184B3A] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#12382c]"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
