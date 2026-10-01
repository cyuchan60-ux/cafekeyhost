import React, { useState } from 'react';
import { Award, CheckCircle2, Delete, XCircle, ArrowLeft } from 'lucide-react';

interface PointModalProps {
  isOpen: boolean;
  totalAmount: number;
  totalQuantity: number;
  onConfirmPoint: (earned: boolean, phoneNumber?: string, pointAmount?: number) => void;
  onCancel: () => void;
}

export const PointModal: React.FC<PointModalProps> = ({
  isOpen,
  totalAmount,
  totalQuantity,
  onConfirmPoint,
  onCancel
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'ask' | 'inputPhone'>('ask');
  const [phoneNumber, setPhoneNumber] = useState('010');
  const [errorMsg, setErrorMsg] = useState('');

  const pointAmount = Math.round(totalAmount * 0.05); // 5% point rewards

  const handleKeyPress = (num: string) => {
    setErrorMsg('');
    if (phoneNumber.length >= 11) return;
    setPhoneNumber((prev) => prev + num);
  };

  const handleDelete = () => {
    setErrorMsg('');
    setPhoneNumber((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  const handleClear = () => {
    setErrorMsg('');
    setPhoneNumber('010');
  };

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handleCompletePhone = () => {
    const raw = phoneNumber.replace(/\D/g, '');
    if (raw.length < 10) {
      setErrorMsg('전화번호 10~11자리를 정확히 입력해주세요.');
      return;
    }
    onConfirmPoint(true, formatPhone(raw), pointAmount);
  };

  const handleSkip = () => {
    onConfirmPoint(false, undefined, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {mode === 'ask' ? (
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
                CAMPUS POINT SYSTEM
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                포인트 적립을 하시겠습니까?
              </h2>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                총 주문 금액의 <span className="text-amber-400 font-bold">5%</span>가 포인트로 적립됩니다.
                <br />
                다음 주문 시 현금처럼 사용할 수 있습니다!
              </p>
            </div>

            {/* Expected Point Box */}
            <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs text-neutral-400 block">주문 금액 ({totalQuantity}잔)</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-400 font-semibold block">이번 적립 예상 포인트</span>
                <span className="text-lg font-black text-amber-400 tabular-nums">
                  +{pointAmount.toLocaleString()} P
                </span>
              </div>
            </div>

            {/* Choice Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setMode('inputPhone')}
                className="w-full py-4 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-base transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>네, 적립할게요 (전화번호 입력)</span>
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white font-semibold text-sm transition-all border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-neutral-400" />
                <span>아니오 (적립 없이 바로 결제)</span>
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-neutral-500 hover:text-neutral-300 underline underline-offset-4"
              >
                메뉴 선택으로 돌아가기
              </button>
            </div>
          </div>
        ) : (
          /* Phone Input Keypad Mode */
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMode('ask')}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>이전으로</span>
              </button>
              <span className="text-xs text-amber-400 font-semibold">
                포인트 적립 번호 입력
              </span>
            </div>

            {/* Display formatted phone */}
            <div className="bg-neutral-800 border-2 border-amber-500/50 rounded-xl p-4 text-center">
              <span className="text-xs text-neutral-400 block mb-1">
                휴대폰 번호 (010 포함)
              </span>
              <div className="text-2xl font-mono font-bold text-white tracking-widest min-h-[36px]">
                {formatPhone(phoneNumber) || '010-____-____'}
              </div>
              {errorMsg && (
                <p className="text-xs text-red-400 mt-1 font-medium">{errorMsg}</p>
              )}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className="py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-lg font-bold text-white transition-all shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition-all"
              >
                초기화
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 text-lg font-bold text-white transition-all shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-3.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition-all"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={handleCompletePhone}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-base transition-all shadow-lg shadow-amber-500/20 active:scale-98"
            >
              입력 완료 및 결제 진행
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
