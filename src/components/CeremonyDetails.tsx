import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  Compass,
  Download,
  ExternalLink,
  Copy,
  Check,
  Eye,
  X
} from 'lucide-react';
import { InvitationDetails } from '../types';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface CeremonyDetailsProps {
  details: InvitationDetails;
}

export const CeremonyDetails: React.FC<CeremonyDetailsProps> = ({ details }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [copied, setCopied] = useState(false);
  const [showOfficialModal, setShowOfficialModal] = useState(false);

  useEffect(() => {
    const targetDate = new Date(details.countdownTarget).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [details.countdownTarget]);

  const copyAddress = () => {
    navigator.clipboard.writeText(
      `${details.venueName}, ${details.address}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="thong-tin" className="py-14 px-4 max-w-5xl mx-auto">
      {/* 1. Countdown Strip */}
      <div className="mb-12 p-6 glass-panel-glow rounded-3xl border border-orange-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Đếm Ngược Đến Giờ Khai Mạc Buổi Lễ</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Thứ Bảy, 07/11/2026 · Bắt đầu lúc 07h00 sáng (Ca 1)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={createGoogleCalendarUrl(details)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-orange-300 hover:text-white rounded-lg border border-orange-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Lưu Lịch Google</span>
            </a>
            <button
              onClick={() => downloadIcsFile(details)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tải .iCal</span>
            </button>
          </div>
        </div>

        {/* Tabular Countdown Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
            <span className="block text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 block">
              Ngày
            </span>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
            <span className="block text-3xl sm:text-4xl font-extrabold text-orange-400 font-mono tabular-nums">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 block">
              Giờ
            </span>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
            <span className="block text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 block">
              Phút
            </span>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
            <span className="block text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono tabular-nums">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider mt-1 block">
              Giây
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Information Cards Grid (Refactored based on School Invitation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Card A: Official Candidate & Seating Pass */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-orange-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Thông Tin Tân Cử Nhân
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30 font-semibold font-mono">
                {details.session}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Họ và tên Tân Cử Nhân</p>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {details.graduateName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Mã số sinh viên (MSSV)</p>
                  <p className="text-base font-bold text-orange-400 font-mono mt-0.5">
                    {details.studentId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase">Chuyên ngành</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">
                    {details.degree}
                  </p>
                </div>
              </div>

              {/* Crucial Seating & Order */}
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-orange-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Số Ghế & Thứ Tự Trao Bằng</span>
                  <span className="text-xs text-orange-300 font-medium">Khu vực sinh viên nhận bằng</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-orange-400 font-mono tracking-tight drop-shadow-md">
                    {details.seatNumber}
                  </span>
                </div>
              </div>

              {/* Parent Seating */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-900 rounded-xl text-yellow-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Khu Vực Phụ Huynh</span>
                    <span className="text-sm font-semibold text-white">{details.parentArea}</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-yellow-950/40 text-yellow-300 border border-yellow-500/30 rounded-lg font-medium">
                  {details.parentSeats}
                </span>
              </div>

              {/* VIP Guest Dedication */}
              <div className="p-3.5 bg-gradient-to-r from-orange-950/50 via-slate-950 to-pink-950/40 rounded-2xl border border-orange-500/40 flex items-center gap-3 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0 text-base">
                  💌
                </div>
                <div>
                  <span className="text-[10px] text-orange-400/90 uppercase tracking-wider block font-semibold">
                    Khách Mời Đặc Biệt
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    Kính mời bợn Bẻo Chu iu zấu
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>FPT University Ho Chi Minh City</span>
            <span className="text-orange-400 font-semibold">20 Năm Thành Lập</span>
          </div>
        </div>

        {/* Card B: Ceremony Schedule (Lịch Trình Chi Tiết) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Lịch Trình Buổi Lễ
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {details.dateStr}
              </span>
            </div>

            <div className="relative pl-6 border-l border-orange-500/30 space-y-6 my-2">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-orange-400" />
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Check-in & Sinh Hoạt Tân Cử Nhân
                  </h4>
                  <span className="text-xs font-mono font-bold text-orange-400 shrink-0">
                    {details.checkinTime}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Tân cử nhân có mặt đúng giờ để điểm danh, nhận lễ phục, xếp hàng vào vị trí ghế <strong>{details.seatNumber}</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-cyan-400 animate-pulse" />
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Lễ Trao Bằng Chính Thức (Graduation Ceremony)
                  </h4>
                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                    {details.ceremonyTime}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Khai mạc, thông điệp chúc mừng từ Hiệu trưởng, nghi thức xướng tên trao bằng cử nhân và vinh danh.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-yellow-400" />
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Nghi Thức Tung Nón & Chụp Ảnh Kỷ Niệm
                  </h4>
                  <span className="text-xs font-mono font-bold text-yellow-400 shrink-0">
                    09h30+
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Khoảnh khắc tung nón tốt nghiệp rực rỡ, giao lưu và chụp ảnh lưu niệm cùng gia đình và người thân.
                </p>
              </div>
            </div>
          </div>

          {/* Quick action to preview official invitation poster */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowOfficialModal(true)}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-orange-300 hover:text-white border border-orange-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-orange-400" />
              <span>Xem Thư Mời Gốc Của Trường FPT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Location & Google Maps Card (Featuring FPT Campus Architecture Image) */}
      <div id="dia-diem" className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Campus Image Header */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900 group">
          <img
            src={details.campusImageUrl || '/assets/aistudio/FPT_d95d1d0d.png'}
            alt="Khuôn viên Trường Đại học FPT TP. Hồ Chí Minh"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Floating Campus Badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/85 backdrop-blur-md rounded-full border border-orange-500/40 text-[11px] font-semibold text-orange-400 flex items-center gap-1.5 shadow-lg">
            <span>🏫</span>
            <span>Khuôn Viên Trường Đại Học FPT TP.HCM</span>
          </div>

          {/* Venue Details Overlay on Bottom */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1 drop-shadow">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Địa Điểm Tổ Chức Lễ Tốt Nghiệp</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                {details.venueName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 drop-shadow">
                {details.address}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={details.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Mở Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                onClick={copyAddress}
                className="px-3.5 py-2.5 bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer backdrop-blur-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã Sao Chép' : 'Sao Chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Location Logistics Strip */}
        <div className="p-5 sm:p-6 bg-slate-950/70 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="font-semibold text-orange-400 block mb-0.5">Khu Vực Tổ Chức</span>
            <span className="text-slate-400">Hội trường chính & Sảnh trung tâm Lễ tốt nghiệp</span>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-0.5">Chụp Ảnh Kỷ Niệm</span>
            <span className="text-slate-400">Quảng trường cây xanh & Bậc thang kiến trúc biểu tượng</span>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="font-semibold text-yellow-400 block mb-0.5">Gửi Xe & Hướng Dẫn</span>
            <span className="text-slate-400">Bãi xe sinh viên & phụ huynh tại Cổng chính trường</span>
          </div>
        </div>
      </div>

      {/* Modal to view official invitation image provided by school */}
      {showOfficialModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Thư Mời Lễ Tốt Nghiệp Gốc · FPT University
                </h3>
                <p className="text-xs text-slate-400">
                  Phạm Hoàng Minh Anh · SE183496
                </p>
              </div>
              <button
                onClick={() => setShowOfficialModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 rounded-2xl bg-black/40 flex items-center justify-center p-2">
              <img
                src={details.officialInvitationImage}
                alt="Thư Mời Tốt Nghiệp FPT University - Phạm Hoàng Minh Anh"
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-2xl"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Đại học FPT Thành phố Hồ Chí Minh</span>
              <button
                onClick={() => setShowOfficialModal(false)}
                className="text-orange-400 hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
