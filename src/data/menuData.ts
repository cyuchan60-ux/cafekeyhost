import { MenuItem } from '../types';
import americanoImg from '../assets/images/iced_americano_1790816909417.jpg';
import latteImg from '../assets/images/cafe_latte_1790816921435.jpg';
import teaImg from '../assets/images/iced_tea_1790816931318.jpg';
import lemonadeImg from '../assets/images/lemonade_1790816941882.jpg';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'iced_americano',
    name: '아아 (아이스 아메리카노)',
    shortName: '아아',
    description: '과테말라 & 에티오피아 블렌드의 진한 에스프레소에 시원한 얼음을 띄운 깔끔한 커피',
    price: 5000,
    image: americanoImg,
    category: 'coffee',
    tag: 'BEST 인기 1위'
  },
  {
    id: 'cafe_latte',
    name: '라떼 (카페 라떼)',
    shortName: '라떼',
    description: '신선한 1등급 원유와 고소한 에스프레소 샷의 부드러운 밸런스',
    price: 5000,
    image: latteImg,
    category: 'coffee',
    tag: '부드러운 시그니처'
  },
  {
    id: 'iced_tea',
    name: '아이스티 (복숭아 아이스티)',
    shortName: '아이스티',
    description: '달콤한 복숭아 과즙과 향긋한 홍차가 어우러진 청량하고 달콤한 음료',
    price: 5000,
    image: teaImg,
    category: 'beverage',
    tag: '달콤 상쾌'
  },
  {
    id: 'lemonade',
    name: '레몬에이드 (상큼 레몬에이드)',
    shortName: '레몬에이드',
    description: '생레몬 과즙과 톡톡 터지는 탄산 스파클링의 환상적인 만남',
    price: 5000,
    image: lemonadeImg,
    category: 'beverage',
    tag: '비타민 충전'
  }
];
