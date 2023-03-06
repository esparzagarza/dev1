export interface IContractSummary {
  borrador: { qty: number, total: number };
  activos: { qty: number, total: number };
  cancelados: { qty: number, total: number };
  otros: { qty: number, total: number };
}

export interface IPaymentSummary {
  cheque: { qty: number, total: number };
  deposito: { qty: number, total: number };
  efectivo: { qty: number, total: number };
  transferencia: { qty: number, total: number };
  otros: { qty: number, total: number };
}
