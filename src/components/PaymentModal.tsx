import React, { useState } from 'react';
import { CreditCard, QrCode, GraduationCap, Banknote, Loader2, ArrowLeft } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  totalAmount: number;
  onBack: () => void;
  onCompletePayment: (paymentMethod: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  totalAmount,
  onBack,
  onCompletePayment
}) => {
  if (!isOpen) return null;

  const [processingMethod, setProcessingMethod] = useState<string | null>(null);

  const methods = [
    {
      id: 'credit_card',
      name: '신용 / 체크카드',
      desc: 'IC칩을 리더기에 꽂아주세요',
      icon: CreditCard,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'simple_pay',
      name: '간편결제 (카카오·토스·네이버)',
      desc: '바코드 또는 QR코드를 스캔해주세요',
      icon: QrCode,
      color: 'from-amber-500 to-yellow-600'
    },
    {
      id: 'student_pay',
      name: '캠퍼스 학생증 / 새내기 페이',
      desc: '학생증 바코드를 리더기에 접촉해주세요',
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'cash',
      name: '현금 결제 (카운터)',
      desc: '영수증 출력 후 카운터에서 결제합니다',
      icon: Banknote,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handleSelectMethod = (name: string) => {
    setProcessingMethod(name);
    setTimeout(() => {
      onCompletePayment(name);
      setProcessingMethod(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {processingMethod ? (
          <div className="p-10 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">결제 처리 중입니다...</h3>
              <p className="text-xs text-neutral-400 mt-1">
                [{processingMethod}] 결제가 진행되고 있습니다. 카드를 뽑거나 창을 닫지 마세요.
              </p>
            </div>
            <div className="text-sm font-bold text-amber-400 tabular-nums">
              결제 금액: {totalAmount.toLocaleString()}원
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase">
                  STEP 2. 결제 수단 선택
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  결제 방식을 선택해주세요
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">최종 결제 금액</span>
                <span className="text-xl font-black text-amber-400 tabular-nums">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methods.map((m) => {
                const IconComponent = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMethod(m.name)}
                    className="p-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-500 text-left transition-all group flex flex-col justify-between h-28 shadow-sm active:scale-98"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-white border border-neutral-700 group-hover:border-amber-500/50">
                        <IconComponent className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-[10px] text-neutral-500 group-hover:text-amber-400 font-medium">
                        터치
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {m.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {m.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>포인트 적립 단계로 돌아가기</span>
              </button>
              <span className="text-[11px] text-neutral-500">
                영수증 출력 및 엑셀 다운로드가 지원됩니다
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
