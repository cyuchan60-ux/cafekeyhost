import React, { useState } from 'react';
import { MenuItem, OrderItemOption } from '../types';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

interface OptionModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options: OrderItemOption, quantity: number) => void;
}

export const OptionModal: React.FC<OptionModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [packaging, setPackaging] = useState<OrderItemOption['packaging']>('매장 이용');
  const [ice, setIce] = useState<OrderItemOption['ice']>('보통');
  const [sweetness, setSweetness] = useState<OrderItemOption['sweetness']>('기본');

  const subtotal = item.price * quantity;

  const handleConfirm = () => {
    onAddToCart(
      item,
      {
        packaging,
        ice,
        sweetness
      },
      quantity
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-850 bg-neutral-900 border border-neutral-750 border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{item.name}</span>
            </h2>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              단일가 5,000원 · 옵션 맞춤 선택
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Options */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Packaging Option */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2.5">
              1. 포장 여부 선택
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['매장 이용', '포장하기 (테이크아웃)'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPackaging(opt)}
                  className={`py-3 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                    packaging === opt
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Option */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2.5">
              2. 얼음량 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['보통', '많이', '적게'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIce(opt)}
                  className={`py-2.5 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    ice === opt
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  {opt} 얼음
                </button>
              ))}
            </div>
          </div>

          {/* Sweetness Option */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2.5">
              3. 당도 / 시럽 조절
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['기본', '덜 달게', '달게'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSweetness(opt)}
                  className={`py-2.5 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                    sweetness === opt
                      ? 'bg-amber-500 text-neutral-950 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/60 border border-neutral-750">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">주문 수량</span>
              <span className="text-[11px] text-neutral-400">잔당 5,000원</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-bold text-white tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="w-9 h-9 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with subtotal and add button */}
        <div className="p-5 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400">선택 금액</div>
            <div className="text-xl font-bold text-amber-400 tabular-nums">
              {subtotal.toLocaleString()}원
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>장바구니 담기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
