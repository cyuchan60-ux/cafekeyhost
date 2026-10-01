import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from './data/menuData';
import { CartItem, MenuItem, OrderItemOption, OrderRecord } from './types';
import { Header } from './components/Header';
import { MenuCard } from './components/MenuCard';
import { OptionModal } from './components/OptionModal';
import { CartTray } from './components/CartTray';
import { PointModal } from './components/PointModal';
import { PaymentModal } from './components/PaymentModal';
import { OrderCompleteModal } from './components/OrderCompleteModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { FreshmanIntroModal } from './components/FreshmanIntroModal';
import { ProjectDownloadModal } from './components/ProjectDownloadModal';
import { Sparkles, Utensils, Coffee, GlassWater, Code2, Download } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'campus_cafe_kiosk_orders';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coffee' | 'beverage'>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Checkout flow states
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingPointInfo, setPendingPointInfo] = useState<{
    earned: boolean;
    phoneNumber?: string;
    pointAmount: number;
  } | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Utility modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isProjectDownloadOpen, setIsProjectDownloadOpen] = useState(false);

  // Orders history
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orderHistory));
    } catch {
      // ignore storage full
    }
  }, [orderHistory]);

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    options: OrderItemOption,
    quantity: number
  ) => {
    const optionKey = `${item.id}-${options.packaging}-${options.ice}-${options.sweetness}`;
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === optionKey);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev,
          {
            id: optionKey,
            menuId: item.id,
            name: item.name,
            price: item.price,
            quantity,
            image: item.image,
            options
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Step 1: Open Point Accumulation Modal
  const handleProceedToOrder = () => {
    if (cart.length === 0) return;
    setIsPointModalOpen(true);
  };

  // Step 2: Receive response to Point Accumulation inquiry, then open Payment Modal
  const handleConfirmPoint = (
    earned: boolean,
    phoneNumber?: string,
    pointAmount: number = 0
  ) => {
    setPendingPointInfo({
      earned,
      phoneNumber,
      pointAmount
    });
    setIsPointModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Step 3: Payment processed -> generate final Order Record
  const handleCompletePayment = (paymentMethod: string) => {
    const now = new Date();
    const formattedTime = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const nextOrderNumber = 100 + orderHistory.length + 1;
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsSummary = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      optionsText: `${item.options.packaging} / ${item.options.ice} 얼음 / ${item.options.sweetness}`
    }));

    const newOrder: OrderRecord = {
      orderNumber: nextOrderNumber,
      orderId: `ORDER-${Date.now()}`,
      orderTime: formattedTime,
      timestamp: Date.now(),
      items: itemsSummary,
      totalQuantity,
      totalAmount,
      pointEarned: pendingPointInfo?.earned ?? false,
      phoneNumber: pendingPointInfo?.phoneNumber,
      pointAmount: pendingPointInfo?.pointAmount ?? 0,
      paymentMethod
    };

    setOrderHistory((prev) => [newOrder, ...prev]);
    setCompletedOrder(newOrder);
    setIsPaymentModalOpen(false);
    setCart([]);
  };

  const handleNewOrder = () => {
    setCompletedOrder(null);
    setPendingPointInfo(null);
    setCart([]);
  };

  // Filtered menu items
  const filteredItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory === 'coffee') return item.category === 'coffee';
    if (selectedCategory === 'beverage') return item.category === 'beverage';
    return true;
  });

  const cartTotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header
        orderHistory={orderHistory}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenIntro={() => setIsIntroOpen(true)}
        onOpenProjectDownload={() => setIsProjectDownloadOpen(true)}
      />

      {/* Main Kiosk Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Welcome / Notice Banner */}
        <section className="mb-4 p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide uppercase">
                주문 가능 (키오스크 정상 운영 중)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              원하시는 음료를 선택해주세요
            </h2>
            <p className="text-xs text-neutral-400">
              새내기 추천 인기 메뉴 4종 모두 <strong className="text-amber-400 font-bold">5,000원</strong> 균일가로 제공됩니다!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700/80 text-right">
              <span className="text-[10px] text-neutral-400 block font-medium">전 메뉴 균일가</span>
              <span className="text-base font-extrabold text-amber-400 tabular-nums">5,000원</span>
            </div>
          </div>
        </section>

        {/* VS Code Source Code Download Promo Bar */}
        <div className="mb-6 p-3 px-4 rounded-xl bg-blue-950/40 border border-blue-900/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-300">
            <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Visual Studio / VS Code 프로젝트 코드 파일</strong>을 컴퓨터로 다운로드하여 실행할 수 있습니다.
            </span>
          </div>
          <button
            onClick={() => setIsProjectDownloadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>코드 파일 다운로드 (.zip)</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>전체 메뉴 (4)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('coffee')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'coffee'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>커피류 (아아, 라떼)</span>
          </button>
          <button
            onClick={() => setSelectedCategory('beverage')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'beverage'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <GlassWater className="w-3.5 h-3.5" />
            <span>음료류 (아이스티, 레몬에이드)</span>
          </button>
        </div>

        {/* 4 Menu Items Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {filteredItems.map((item) => {
            const countInCart = cart
              .filter((c) => c.menuId === item.id)
              .reduce((sum, c) => sum + c.quantity, 0);

            return (
              <MenuCard
                key={item.id}
                item={item}
                cartCount={countInCart}
                onSelect={(selected) => setSelectedMenuItem(selected)}
              />
            );
          })}
        </section>

        {/* Quick Guide / Feature Highlight */}
        <section className="mt-auto pt-6 border-t border-neutral-900 grid grid-cols-1 md:grid-cols-3 gap-4 text-neutral-400 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-bold text-neutral-200">균일가 5,000원</h4>
              <p className="mt-0.5 text-neutral-400 leading-relaxed">
                아아, 라떼, 아이스티, 레몬에이드 모두 5,000원으로 통일되어 고민 없이 즐길 수 있습니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-bold text-neutral-200">5% 포인트 적립 질문</h4>
              <p className="mt-0.5 text-neutral-400 leading-relaxed">
                주문 시 포인트 적립 여부를 확인하며, 번호 입력 시 5%가 즉시 적립됩니다.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-bold text-neutral-200">주문 결과 엑셀 다운로드</h4>
              <p className="mt-0.5 text-neutral-400 leading-relaxed">
                마지막 답변과 주문 금액 내역이 포함된 실제 .xlsx 파일 다운로드를 지원합니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Cart Tray (Bottom Sticky) */}
      <CartTray
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToOrder={handleProceedToOrder}
      />

      {/* Option Selection Modal */}
      <OptionModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Point Accumulation Modal (Step 1) */}
      <PointModal
        isOpen={isPointModalOpen}
        totalAmount={cartTotalAmount}
        totalQuantity={cartTotalQuantity}
        onConfirmPoint={handleConfirmPoint}
        onCancel={() => setIsPointModalOpen(false)}
      />

      {/* Payment Selection Modal (Step 2) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        totalAmount={cartTotalAmount}
        onBack={() => {
          setIsPaymentModalOpen(false);
          setIsPointModalOpen(true);
        }}
        onCompletePayment={handleCompletePayment}
      />

      {/* Order Complete & Excel Download Modal (Step 3) */}
      <OrderCompleteModal
        order={completedOrder}
        orderHistory={orderHistory}
        onNewOrder={handleNewOrder}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orderHistory}
      />

      {/* Freshman Developer Intro Modal */}
      <FreshmanIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
      />

      {/* Visual Studio / VS Code Project Code Download Modal */}
      <ProjectDownloadModal
        isOpen={isProjectDownloadOpen}
        onClose={() => setIsProjectDownloadOpen(false)}
      />
    </div>
  );
}
