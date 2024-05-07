export const CardIssuerName = {
  '3K': '기업BC',
  '46': '광주은행',
  '71': '롯데카드',
  '30': 'KDB산업은행',
  '31': 'BC카드',
  '51': '삼성카드',
  '38': '새마을금고',
  '41': '신한카드',
  '62': '신협',
  '36': '씨티카드',
  '33': '우리BC카드',
  W1: '우리카드',
  '37': '우체국예금보험',
  '39': '저축은행중앙회',
  '35': '전북은행',
  '42': '제주은행',
  '15': '카카오뱅크',
  '3A': '케이뱅크',
  '24': '토스뱅크',
  '21': '하나카드',
  '61': '현대카드',
  '11': '국민카드',
  '91': 'NH농협카드',
  '34': 'Sh수협은행',
} as const;

export type CardIssuerCode = keyof typeof CardIssuerName;

export interface PaymentConfig {
  title: string;
  paymentMethod: '토스페이';
  data: {
    mId: 'tgen_docs';
    lastTransactionKey: '2EEC65A6DB5EB284E4941ED2E00708AC';
    paymentKey: 'tgen_20240507231718WFM55';
    orderId: 'Ur=uPAW2Dxf2A3K8-RBFq=Btf';
    orderName: 'MONTHLY';
    taxExemptionAmount: 0;
    status: 'DONE';
    requestedAt: '2024-05-07T23:17:18+09:00';
    approvedAt: '2024-05-07T23:17:28+09:00';
    useEscrow: false;
    cultureExpense: false;
    card: null;
    virtualAccount: null;
    transfer: null;
    mobilePhone: null;
    giftCertificate: null;
    cashReceipt: null;
    cashReceipts: null;
    discount: null;
    cancels: null;
    secret: 'ps_GePWvyJnrKmNkPvw9PqE3gLzN97E';
    type: 'NORMAL';
    easyPay: {
      provider: '토스페이';
      amount: 30000;
      discountAmount: 0;
    };
    country: 'KR';
    failure: null;
    isPartialCancelable: true;
    receipt: {
      url: 'https://dashboard.tosspayments.com/receipt/redirection?transactionId=tgen_20240507231718WFM55&ref=PX';
    };
    checkout: {
      url: 'https://api.tosspayments.com/v1/payments/tgen_20240507231718WFM55/checkout';
    };
    currency: 'KRW';
    totalAmount: 30000;
    balanceAmount: 30000;
    suppliedAmount: 27273;
    vat: 2727;
    taxFreeAmount: 0;
    method: '간편결제';
    version: '2022-11-16';
  };
}
