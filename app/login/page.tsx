"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lock, Mail, Sparkles, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sinhvien@hcmut.edu.vn");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 500);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F1EC] p-4 text-[#202B24]">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#184B3A] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Về trang chủ BếpSV
        </Link>

        {/* Brand Card */}
        <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm sm:p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2ED] text-3xl shadow-sm mb-3">
              👨‍🍳
            </div>
            <h1 className="text-2xl font-black text-[#184B3A]">Đăng nhập BếpSV</h1>
            <p className="mt-1 text-xs text-[#77736D]">
              Giải pháp lên thực đơn & chuẩn ví dành riêng cho sinh viên
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                Email sinh viên
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu.vn"
                  required
                  className="w-full rounded-2xl border border-[#EEE7DF] bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#202B24]">
                  Mật khẩu
                </label>
                <Link
                  href="/profile/password"
                  className="text-[11px] font-semibold text-[#184B3A] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-[#EEE7DF] bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#184B3A] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#12392c] disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EEE7DF]" />
            </div>
            <span className="relative bg-[#FFFDF9] px-3 text-[11px] font-medium text-[#77736D]">
              hoặc tiếp tục với
            </span>
          </div>

          {/* Quick Demo Access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#D5E5DA] bg-[#EAF2ED] py-2.5 text-xs font-bold text-[#184B3A] shadow-sm transition hover:bg-[#d8eade]"
          >
            <Sparkles className="h-4 w-4" />
            Dùng thử ngay với tài khoản Sinh viên mẫu
          </button>

          <p className="mt-6 text-center text-xs text-[#77736D]">
            Chưa có tài khoản?{" "}
            <Link href="/" className="font-bold text-[#184B3A] hover:underline">
              Đăng ký miễn phí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
