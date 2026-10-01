export interface MenuItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  image: string;
  category: 'coffee' | 'beverage';
  tag: string;
}

export interface OrderItemOption {
  ice: '많이' | '보통' | '적게';
  sweetness: '기본' | '덜 달게' | '달게';
  packaging: '매장 이용' | '포장하기 (테이크아웃)';
}

export interface CartItem {
  id: string;
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options: OrderItemOption;
}

export interface OrderRecord {
  orderNumber: number;
  orderId: string;
  orderTime: string;
  timestamp: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    optionsText: string;
  }[];
  totalQuantity: number;
  totalAmount: number;
  pointEarned: boolean;
  phoneNumber?: string;
  pointAmount: number;
  paymentMethod: string;
}
