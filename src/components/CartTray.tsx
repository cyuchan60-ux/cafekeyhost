import React from 'react';
import { CartItem } from '../types';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';

interface CartTrayProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToOrder: () => void;
}

export const CartTray: React.FC<CartTrayProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToOrder
}) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 shadow-2xl p-4 sm:p-5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Left: Cart items carousel or list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                주문 내역 ({totalQuantity}잔)
              </span>
              <span className="text-xs text-neutral-400">· 균일가 잔당 5,000원</span>
            </div>
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>전체 비우기</span>
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-4 text-center text-xs text-neutral-500 bg-neutral-850/60 rounded-xl border border-neutral-800">
              상단 메뉴(아아, 라떼, 아이스티, 레몬에이드)를 터치하여 장바구니에 담아주세요.
            </div>
          ) : (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 bg-neutral-800/90 border border-neutral-700/80 rounded-xl p-2.5 flex items-center gap-3 min-w-[240px] max-w-[280px]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-neutral-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {item.options.packaging} · {item.options.ice} 얼음 · {item.options.sweetness}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-amber-400 tabular-nums">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                      <div className="flex items-center gap-1.5 bg-neutral-900 px-1.5 py-0.5 rounded-md border border-neutral-700">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="text-neutral-400 hover:text-white p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-white w-4 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="text-neutral-400 hover:text-white p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                    title="항목 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Total calculation and Checkout Button */}
        <div className="flex items-center justify-between lg:justify-end gap-5 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
          <div className="text-left lg:text-right">
            <span className="text-[11px] text-neutral-400 block font-medium">
              총 {totalQuantity}잔 주문
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-neutral-300 font-semibold">총 결제 금액:</span>
              <span className="text-2xl font-black text-amber-400 tabular-nums">
                {totalAmount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-white">원</span>
            </div>
          </div>

          <button
            onClick={onProceedToOrder}
            disabled={items.length === 0}
            className={`px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all shadow-lg ${
              items.length > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25 active:scale-95 cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 border border-neutral-700/60 cursor-not-allowed'
            }`}
          >
            <span>주문하기</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
