import React from 'react';
import { Coffee, FileSpreadsheet, History, Info, Code2 } from 'lucide-react';
import { OrderRecord } from '../types';
import { exportAllOrdersExcel } from '../utils/excelExport';

interface HeaderProps {
  orderHistory: OrderRecord[];
  onOpenHistory: () => void;
  onOpenIntro: () => void;
  onOpenProjectDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  orderHistory,
  onOpenHistory,
  onOpenIntro,
  onOpenProjectDownload
}) => {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Zone: Clean single mark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-900/30">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                청춘 캠퍼스 카페
              </h1>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-500/30">
                새내기 키오스크 v1.0
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              전 메뉴 균일가 5,000원 · 빠른 터치 주문 시스템
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visual Studio / VS Code Download button */}
          <button
            onClick={onOpenProjectDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 hover:text-white transition-colors border border-blue-800/80 shadow-sm"
            title="Visual Studio / VS Code 프로젝트 코드 다운로드"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">VS Code 코드 다운로드</span>
            <span className="md:hidden">코드 다운로드</span>
          </button>

          {/* Student Intro */}
          <button
            onClick={onOpenIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
            title="개발자 새내기 소개"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">새내기 소개</span>
          </button>

          {/* History modal */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span>주문 내역</span>
            {orderHistory.length > 0 && (
              <span className="bg-amber-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {orderHistory.length}
              </span>
            )}
          </button>

          {/* Master Excel download */}
          <button
            onClick={() => exportAllOrdersExcel(orderHistory)}
            disabled={orderHistory.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              orderHistory.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/30 active:scale-95'
                : 'bg-neutral-800 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
            }`}
            title={orderHistory.length > 0 ? '전체 주문 누적 장부 엑셀 다운로드' : '완료된 주문이 없습니다'}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">누적 장부 엑셀</span>
            <span className="sm:hidden">엑셀</span>
          </button>
        </div>
      </div>
    </header>
  );
};

