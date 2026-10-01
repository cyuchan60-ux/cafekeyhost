import React from 'react';
import { OrderRecord } from '../types';
import { exportSingleOrderExcel, exportAllOrdersExcel } from '../utils/excelExport';
import { X, FileSpreadsheet, Download, History, Award } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">키오스크 주문 누적 내역</h2>
              <p className="text-xs text-neutral-400">총 {orders.length}건의 주문이 기록되어 있습니다</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={() => exportAllOrdersExcel(orders)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>전체 엑셀 다운로드</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Orders list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs">
              아직 완료된 주문이 없습니다. 메뉴를 선택하여 주문을 진행해보세요!
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.orderId}
                className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-400">
                      주문 #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-neutral-400">· {ord.orderTime}</span>
                    <span className="text-[11px] text-neutral-500">({ord.paymentMethod})</span>
                  </div>

                  <div className="text-xs text-neutral-300 font-medium">
                    {ord.items.map((it) => `${it.name} ${it.quantity}잔`).join(', ')}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400 pt-0.5">
                    <span>
                      총 결제 금액:{' '}
                      <strong className="text-white font-bold tabular-nums">
                        {ord.totalAmount.toLocaleString()}원
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      {ord.pointEarned ? (
                        <span className="text-emerald-400">
                          적립 완료 ({ord.phoneNumber}) +{ord.pointAmount}P
                        </span>
                      ) : (
                        <span className="text-neutral-500">미적립</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <button
                    onClick={() => exportSingleOrderExcel(ord)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-xs font-semibold text-neutral-100 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>개별 엑셀</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
