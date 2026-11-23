"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, ShieldCheck } from "lucide-react";

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp với mật khẩu mới");
      return;
    }

    try {
      setLoading(true);
      // Giả lập lưu thành công cho tài khoản sinh viên
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra khi cập nhật mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1EC] text-[#202B24] p-4 lg:p-8">
      <div className="mx-auto max-w-xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-[#EEE7DF] hover:bg-[#FAF4ED] transition"
            aria-label="Quay lại hồ sơ"
          >
            <ArrowLeft className="h-5 w-5 text-[#184B3A]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#184B3A]">
              Đổi mật khẩu
            </h1>
            <p className="text-xs text-[#77736D]">
              Bảo mật tài khoản BếpSV của bạn bằng mật khẩu mạnh
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-[#EEE7DF] bg-[#FFFDF9] p-6 shadow-sm sm:p-8">
          {success ? (
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-black text-[#184B3A]">Đổi mật khẩu thành công!</h2>
              <p className="text-xs text-[#77736D]">
                Mật khẩu của bạn đã được cập nhật bảo mật an toàn.
              </p>
              <div className="pt-2">
                <Link
                  href="/profile"
                  className="inline-flex rounded-full bg-[#184B3A] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#12392c]"
                >
                  Quay lại trang cá nhân
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl bg-red-50 p-3.5 border border-red-200 text-xs font-bold text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202B24] mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#77736D]" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full rounded-2xl border border-[#EEE7DF] bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#184B3A]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#184B3A] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#12392c] disabled:opacity-50"
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
