import React from 'react';
import { X, GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface FreshmanIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreshmanIntroModal: React.FC<FreshmanIntroModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">개발자 소개 (대학교 1학년)</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-neutral-300 leading-relaxed space-y-3">
            <p>
              안녕하세요! <strong>대학교 1학년 새내기 학생</strong>입니다! 👋
            </p>
            <p>
              이번 학기 프로젝트로 우리 대학교 동아리/캠퍼스 카페에서 바로 사용할 수 있는 
              <strong>실전 터치 키오스크 웹앱</strong>을 직접 개발했습니다.
            </p>

            <div className="bg-neutral-800/80 rounded-xl p-3 border border-neutral-700/80 space-y-2">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                구현한 핵심 요구사항:
              </div>
              <ul className="space-y-1.5 text-neutral-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>4가지 인기 메뉴</strong> (아아, 라떼, 아이스티, 레몬에이드)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>가격 전 메뉴 5,000원 통일</strong> 책정</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>주문 완료 후 총 금액</strong> 명확 계산 및 영수증 제공</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>포인트 적립 질문 단계</strong> (5% 적립, 전화번호 패드)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>답변 및 주문 내역 Excel (.xlsx) 파일 다운로드</strong> 완벽 지원</span>
                </li>
              </ul>
            </div>

            <p className="text-neutral-400 text-[11px]">
              키오스크 화면에서 메뉴를 고르고 담아보세요. 주문 완료 시 자동으로 생성되는 엑셀 파일도 즉시 다운로드해 확인해보실 수 있습니다!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
          >
            키오스크 사용해보기
          </button>
        </div>
      </div>
    </div>
  );
};
