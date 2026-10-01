import * as XLSX from 'xlsx';
import { OrderRecord } from '../types';

export function exportSingleOrderExcel(order: OrderRecord): void {
  const wb = XLSX.utils.book_new();

  const aoaData: (string | number)[][] = [
    ['☕ 새내기 캠퍼스 카페 - 주문 영수증 (Receipt)'],
    [''],
    ['주문 정보', ''],
    ['주문 번호', `#${order.orderNumber}`],
    ['주문 일시', order.orderTime],
    ['결제 수단', order.paymentMethod],
    ['총 결제 금액', `${order.totalAmount.toLocaleString()}원`],
    [
      '포인트 적립',
      order.pointEarned
        ? `적립 완료 (${order.phoneNumber || '번호 미등록'} / +${order.pointAmount.toLocaleString()}P)`
        : '미적립 (적립 안 함)'
    ],
    [''],
    ['주문 상세 내역', '', '', '', ''],
    ['순번', '메뉴명', '선택 옵션', '수량', '단가(원)', '합계(원)']
  ];

  order.items.forEach((item, idx) => {
    aoaData.push([
      idx + 1,
      item.name,
      item.optionsText,
      item.quantity,
      item.price,
      item.subtotal
    ]);
  });

  aoaData.push(['']);
  aoaData.push([
    '합계',
    '',
    `총 ${order.totalQuantity}잔`,
    order.totalQuantity,
    '-',
    order.totalAmount
  ]);
  aoaData.push([
    '포인트 적립액',
    '',
    order.pointEarned ? `${order.pointAmount.toLocaleString()} 포인트` : '0 포인트',
    '',
    '',
    ''
  ]);
  aoaData.push(['']);
  aoaData.push(['비고', '대학교 1학년 학생이 제작한 키오스크 시스템']);

  const ws = XLSX.utils.aoa_to_sheet(aoaData);

  ws['!cols'] = [
    { wch: 10 },
    { wch: 20 },
    { wch: 32 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, `주문_${order.orderNumber}`);

  const fileName = `청춘카페_주문_${order.orderNumber}_${order.orderTime.replace(/[: ]/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportAllOrdersExcel(orders: OrderRecord[]): void {
  if (orders.length === 0) return;

  const wb = XLSX.utils.book_new();

  const headers = [
    '주문번호',
    '주문일시',
    '주문메뉴 및 수량',
    '총 주문수량(잔)',
    '단가 통일(원)',
    '총 결제금액(원)',
    '결제수단',
    '포인트 적립여부',
    '적립 휴대폰번호',
    '적립 포인트(P)'
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${item.name}(${item.quantity}잔)`)
      .join(', ');

    return [
      `#${order.orderNumber}`,
      order.orderTime,
      itemsSummary,
      order.totalQuantity,
      5000,
      order.totalAmount,
      order.paymentMethod,
      order.pointEarned ? '적립 완료' : '미적립',
      order.phoneNumber || '-',
      order.pointAmount
    ];
  });

  const wsData = [
    ['☕ 청춘 캠퍼스 카페 - 전체 주문 통합 장부'],
    ['작성자: 컴퓨터공학과 1학년 새내기 개발자'],
    ['다운로드 일시: ' + new Date().toLocaleString('ko-KR')],
    [],
    headers,
    ...rows
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  ws['!cols'] = [
    { wch: 12 },
    { wch: 22 },
    { wch: 35 },
    { wch: 16 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 18 },
    { wch: 16 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, '주문누적장부');

  const fileName = `청춘카페_전체주문장부_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
