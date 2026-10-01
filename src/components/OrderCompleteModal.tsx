import React, { useState } from 'react';
import { OrderRecord } from '../types';
import { exportSingleOrderExcel, exportAllOrdersExcel } from '../utils/excelExport';
import { CheckCircle, FileSpreadsheet, Download, RefreshCw, Award, ReceiptText } from 'lucide-react';

interface OrderCompleteModalProps {
  order: OrderRecord | null;
  orderHistory: OrderRecord[];
  onNewOrder: () => void;
}

export const OrderCompleteModal: React.FC<OrderCompleteModalProps> = ({
  order,
  orderHistory,
  onNewOrder
}) => {
  if (!order) return null;

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadSingle = () => {
    exportSingleOrderExcel(order);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadAll = () => {
    exportAllOrdersExcel(orderHistory);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center text-white relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <CheckCircle className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <span className="text-xs uppercase tracking-widest text-emerald-100 font-semibold">
            주문이 성공적으로 접수되었습니다
          </span>
          <div className="text-3xl font-black mt-1">
            주문번호 #{order.orderNumber}
          </div>
          <p className="text-xs text-emerald-100/90 mt-1">
            카운터 모니터에 주문번호가 호출되면 음료를 수령해주세요.
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-5">
          {/* Key Metric: Total Amount (Explicitly requested by user) */}
          <div className="bg-neutral-800/90 border-2 border-amber-500/40 rounded-xl p-4 flex items-center justify-between shadow-inner">
            <div>
              <span className="text-xs text-neutral-400 block font-medium">총 결제 금액</span>
              <span className="text-xs text-neutral-500">
                총 {order.totalQuantity}잔 주문 (잔당 5,000원 통일)
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                {order.totalAmount.toLocaleString()}
              </span>
              <span className="text-base font-bold text-white ml-1">원</span>
            </div>
          </div>

          {/* Point Accumulation Status (Explicitly requested by user) */}
          <div className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">포인트 적립 결과</span>
            </div>
            {order.pointEarned ? (
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">적립 여부:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    적립 완료
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">적립 전화번호:</span>
                  <span className="font-mono font-medium text-white">{order.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">적립 포인트 (5%):</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    +{order.pointAmount.toLocaleString()} P
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">적립 여부:</span>
                <span className="text-neutral-400 bg-neutral-700/50 px-2 py-0.5 rounded">
                  미적립 (적립 안 함 선택)
                </span>
              </div>
            )}
          </div>

          {/* Itemized Order List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span className="flex items-center gap-1 font-semibold text-neutral-300">
                <ReceiptText className="w-3.5 h-3.5" />
                주문 품목 내역
              </span>
              <span>결제수단: {order.paymentMethod}</span>
            </div>
            <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800 space-y-2 text-xs divide-y divide-neutral-800/80">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                  <div>
                    <span className="font-bold text-white">{item.name}</span>
                    <span className="text-neutral-500 ml-1.5 font-medium">x {item.quantity}</span>
                    <p className="text-[10px] text-neutral-400">{item.optionsText}</p>
                  </div>
                  <span className="font-semibold text-neutral-200 tabular-nums">
                    {item.subtotal.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Excel Download Section (Primary user requirement) */}
          <div className="pt-2 border-t border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                주문 및 적립 결과 엑셀(Excel) 다운로드
              </span>
              {downloadSuccess && (
                <span className="text-[11px] text-emerald-400 font-semibold animate-pulse">
                  ✓ 다운로드 완료!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadSingle}
                className="py-3 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs transition-all shadow-md shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>이번 주문 엑셀 저장</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAll}
                className="py-3 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-98 text-neutral-200 font-semibold text-xs transition-all border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>누적 전체 장부 엑셀</span>
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 text-center">
              주문 품목, 총 금액, 포인트 적립 여부 및 전화번호가 담긴 .xlsx 파일이 생성됩니다.
            </p>
          </div>

          {/* New Order Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onNewOrder}
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>새로운 주문 시작하기 (처음으로)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
