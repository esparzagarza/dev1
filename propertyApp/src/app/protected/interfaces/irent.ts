export interface IRent {
  id: string;
  accountid: string;
  saleid: string;
  balancedue: string;
  amount: string;
  currency: string;
  parity: string;
  method: string;
  reference: string;
  startdate: string;
  enddate: string;
  pyear: string;
  pmonth: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
}
