import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Sparkles,
  ChevronDown,
  Share2,
  Award,
  Music2,
  Check,
  Compass,
  FileText
} from 'lucide-react';
import { GlowingEdmRing, VISUALIZER_THEMES } from './components/GlowingEdmRing';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { CeremonyDetails } from './components/CeremonyDetails';
import { InvitationDetails } from './types';
import { triggerCelebrationConfetti } from './utils/confetti';

const FPT_INVITATION_DATA: InvitationDetails = {
  graduateName: 'Phạm Hoàng Minh Anh',
  studentId: 'SE183496',
  degree: 'Bachelor of Software Engineering (Kỹ thuật phần mềm)',
  major: 'Software Engineering',
  university: 'Trường Đại học FPT TP. Hồ Chí Minh',
  dateStr: 'Thứ Bảy, 07/11/2026',
  session: 'Ca 1 (Buổi Sáng)',
  checkinTime: '06h00 – 06h50',
  ceremonyTime: '07h00 – 09h30',
  seatNumber: 'H23',
  parentArea: 'Khu vực 1',
  parentSeats: '02 ghế phụ huynh',
  venueName: 'Đại Học FPT Thành Phố Hồ Chí Minh',
  address: 'Lô E2a-7 Đường D1, Khu Công nghệ cao, Phường Tăng Nhơn Phú, TP. Hồ Chí Minh',
  mapsUrl: 'https://maps.app.goo.gl/A6jZw87SY9Hv5USa9',
  countdownTarget: '2026-11-07T07:00:00+07:00',
  photoUrl: '/assets/aistudio/1793799153181_2085483732473358139_3965287971240573645_690e14e8e074fa22494cddce6e4347cc_1764ebe2.jpg',
  officialInvitationImage: '/assets/aistudio/image_9ef08e0d.png',
  campusImageUrl: '/assets/aistudio/FPT_d95d1d0d.png'
};

export default function App() {
  const [details] = useState<InvitationDetails>(FPT_INVITATION_DATA);
  const [isPlaying, setIsPlaying] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentTheme = VISUALIZER_THEMES[themeIndex];

  const handleToggleTheme = () => {
    setThemeIndex((prev) => (prev + 1) % VISUALIZER_THEMES.length);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleStartMusic = () => {
    setIsPlaying(true);
    triggerCelebrationConfetti();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Dynamic Background Ambient Gradients */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 z-0"
        style={{
          background: `radial-gradient(circle at 50% 18%, ${currentTheme.primary}16 0%, ${currentTheme.secondary}0a 45%, #020617 92%)`
        }}
      />

      {/* Cyber Grid Mesh Backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 z-0"
        style={{
          backgroundImage: `radial-gradient(${currentTheme.primary} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single line, no subtitle clutter) */}
          <a
            href="#"
            className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 group"
          >
            <span className="text-xl">🎓</span>
            <span className="font-display group-hover:text-orange-400 transition-colors">
              {details.graduateName} · FPTU
            </span>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#thong-tin" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
              Thông Tin Tham Dự
            </a>
            <a href="#thong-tin" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
              Số Ghế {details.seatNumber}
            </a>
            <a href="#thong-tin" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
              Lịch Trình
            </a>
            <a href="#dia-diem" className="hover:text-orange-400 transition-colors whitespace-nowrap shrink-0">
              Địa Điểm
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Sao chép liên kết thư mời"
            >
              {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <a
              href={details.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:brightness-110 rounded-lg shadow-md shadow-orange-500/20 transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN HERO SECTION */}
      <main className="relative z-10 flex-1">
        <section className="relative pt-8 pb-12 px-4 flex flex-col items-center justify-center text-center max-w-4xl mx-auto min-h-[78vh]">
          {/* School Header Kicker */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            <span>FPT University 20 Years</span>
            <span aria-hidden="true">·</span>
            <span>Graduation Ceremony</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-mono">SE183496</span>
          </div>

          {/* Personalized VIP Invitation Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-amber-500/20 border border-orange-400/40 shadow-lg shadow-orange-500/10 mb-3 animate-pulse">
            <span className="text-base">😊</span>
            <span className="text-xs sm:text-sm font-bold text-orange-200">
              Kính mời chị Chu
            </span>
            <span className="text-base">✨</span>
          </div>

          {/* Invitation Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mb-3 font-display">
            Thư Mời Lễ Tốt Nghiệp
            <br />
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-300"
              style={{
                textShadow: `0 0 40px ${currentTheme.primary}44`
              }}
            >
              {details.graduateName}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-4 leading-relaxed">
            Tân Cử Nhân {details.degree}
            <br />
            <span className="text-slate-400 text-xs sm:text-sm">
              {details.university} · {details.dateStr}
            </span>
          </p>

          {/* CENTERPIECE: Photo of Minh Anh at the middle + Glowing EDM Ring at the back */}
          <div className="my-2 relative flex items-center justify-center">
            <GlowingEdmRing
              photoUrl={details.photoUrl}
              isPlaying={isPlaying}
              theme={currentTheme}
              onToggleTheme={handleToggleTheme}
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 max-w-md w-full">
            <button
              onClick={handleStartMusic}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xl ${
                isPlaying
                  ? 'bg-slate-900 text-orange-300 border border-orange-400/40 ring-2 ring-orange-500/20'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 shadow-orange-500/30'
              }`}
            >
              <Music2 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{isPlaying ? 'Đang Phát Nhạc (0:32 Drop)' : 'Phát Nhạc Lễ Tốt Nghiệp (0:32)'}</span>
            </button>

            <a
              href={details.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-orange-500/50 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Chỉ Đường Đến Đại Học FPT</span>
            </a>
          </div>

          {/* Quick Details Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>{details.dateStr} (Ca 1)</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Số ghế: <strong className="text-white font-mono">{details.seatNumber}</strong></span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-yellow-400" />
              <span>Khu Công nghệ cao, TP.HCM</span>
            </div>
          </div>

          {/* Scroll Down */}
          <div className="mt-8">
            <a
              href="#thong-tin"
              className="text-slate-500 hover:text-orange-400 transition-colors p-2 flex flex-col items-center gap-1 text-[11px]"
            >
              <span>Xem Thông Tin & Lịch Trình Chi Tiết</span>
              <ChevronDown className="w-4 h-4 animate-bounce text-orange-400" />
            </a>
          </div>
        </section>

        {/* 3. REFACTORED INVITATION CARDS & SCHEDULE */}
        <CeremonyDetails details={details} />
      </main>

      {/* 4. FLOATING AUDIO CONTROLLER DOCK (Different Heaven & EH!DE - My Heart @ 0:32) */}
      <AudioPlayerBar
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        accentColor={currentTheme.primary}
      />

      {/* 5. QUIET FOOTER */}
      <footer className="mt-16 pb-24 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              Lễ Tốt Nghiệp · Tân Cử Nhân {details.graduateName}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              MSSV: {details.studentId} · {details.university}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href={details.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
              Google Maps
            </a>
            <button
              onClick={() => triggerCelebrationConfetti()}
              className="text-orange-400 hover:underline cursor-pointer"
            >
              🎉 Tung Pháo Hoa
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
