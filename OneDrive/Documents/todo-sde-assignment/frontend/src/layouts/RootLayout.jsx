import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function RootLayout() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#F1F7F7] via-[#FFF8EF] to-[#DDD3D3] text-[#3A2A2D] font-sans antialiased flex items-center justify-center overflow-hidden p-0 sm:p-4">
      {/* Background Soft Glows */}
      <div className="fixed top-[10%] left-[15%] w-[320px] h-[320px] bg-[#F7CBCA]/30 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] right-[15%] w-[320px] h-[320px] bg-[#B0D7D8]/25 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Strict Fixed Height Frame */}
      <div className="w-full sm:max-w-[420px] h-full sm:h-[840px] max-h-screen bg-[#FFF8EF]/90 backdrop-blur-2xl sm:rounded-[40px] sm:border sm:border-[#C88A93]/30 sm:shadow-[0_20px_50px_rgba(122,83,90,0.15)] flex flex-col relative overflow-hidden">
        
        {/* Fixed Non-Scrollable iOS Header */}
        <div className="shrink-0 flex items-center justify-between px-7 pt-4 pb-1 text-[11px] font-semibold text-[#7A535A]/60 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B0D7D8] border border-[#5D6B6B]/20" />
            <span className="text-[10px] text-[#5D6B6B] font-medium tracking-wide">Sync Live</span>
          </div>
        </div>

        {/* Scrollable Content Container (Only tasks scroll, frame stays locked) */}
        <main className="flex-1 px-5 pt-2 pb-24 overflow-y-auto no-scrollbar">
          <Outlet />
        </main>

        {/* Pinned Bottom Navigation Dock */}
        <BottomNav />
      </div>
    </div>
  );
}