import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IPSummary } from 'src/app/protected/interfaces/idashboard';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { IItem } from 'src/app/protected/interfaces/iitem';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { IRent } from 'src/app/protected/interfaces/irent';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  modules = environment.modules;

  allRent: IRent[] = [];
  allPSummary: IPSummary[] = [];
  allPayment: IPayment[] = [];
  allExpense: IExpense[] = [];
  allExpenseFiltered: IExpense[] = [];

  allContract: IContract[] = [];
  allContractFiltered: IContract[] = [];

  today: Date = new Date();
  selectedYear: string = this.today.getFullYear().toString();
  selectedMonth: string = this.modules.basemonths[this.today.getMonth()];
  selectedMethod: string = '';
  selectedCurrency: string = '';

  firstPayment: IPayment = {
    'id': '',
    "accountid": '',
    'saleid': '',
    'balancedue': '0',
    'amount': '1',
    'currency': 'USD',
    'parity': '1',
    'method': 'efectivo',
    'reference': '',
    'startdate': '',
    'enddate': '',
    'pyear': '',
    'pmonth': '',
    'status': 'completo',
    "created_by": '',
    "modified_by": '',
    'stype': '',
    'stotal': '',
    'scurrency': '',
    'sstartdate': '',
    'senddate': '',
    'eid': '',
    'eimage': '/assets/img/nofoto.png',
    'ename': '',
    'eemail': '',
    'ephone': '',
    'iid': '',
    'iimage': '/assets/img/nofoto.png',
    'icode': '',
    'ifulladdress': '',
    'iwatermeter': '',
    'ilightmeter': '',
    'iproperty': ''
  }

  firstContract: IContract = {
    'id': '',
    "accountid": '',
    'enteid': '1',
    'itemid': '1',
    'currency': 'USD',
    'parity': 1,
    'taxname': 'IVA',
    'taxamount': 0,
    'subtotal': 0,
    'total': 0,
    'paid': 0,
    'day': '1',
    'interestrate': 0,
    'daysoftolerance': 1,
    'guaranteedeposit': 0,
    'type': 'casa habitación',
    'startdate': '',
    'enddate': '',
    'duration': '12',
    'comments': '',
    'status': 'activo',
    "created_by": '',
    "modified_by": '',
    "eimage": '/assets/img/nofoto.png',
    'ename': '',
    'eemail': '',
    'ephone': '',
    "iimage": '/assets/img/nofoto.png',
    'icode': '',
    'ifulladdress': '',
    'iwatermeter': '',
    'ilightmeter': '',
    'iproperty': ''
  }

  firstExpense: IExpense = {
    'id': '',
    "accountid": '0',
    'saleid': '',
    'categoryname': 'Sin categoría',
    'currency': 'USD',
    'description': '',
    'amount': '1',
    'expensedate': '',
    'status': 'activo',
    "created_by": '',
    "modified_by": '',
    'stype': '',
    'stotal': '',
    'scurrency': '',
    'sstartdate': '',
    'senddate': '',
    'eid': '',
    'eimage': '/assets/img/nofoto.png',
    'ename': '',
    'eemail': '',
    'ephone': '',
    'iid': '',
    'iimage': '/assets/img/nofoto.png',
    'icode': '',
    'ifulladdress': '',
    'iwatermeter': '',
    'ilightmeter': '',
    'iproperty': ''
  }

  get baseUrl() { return this.repository.baseUrl; }
  get user() { return this.repository.user; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {

    this.repository.getListByColumn('rent', 'status', 'activo').subscribe((IRent: IRent[]) => { this.allRent = IRent.reverse(); });

    this.repository.getAllPayments('payment').subscribe((IPayment: IPayment[]) => {
      this.allPayment = IPayment.reverse();
      this.firstPayment = this.allPayment[this.allPayment.length - 1];
    });

    this.repository.getAllContracts('sale').subscribe((IContract: IContract[]) => {
      this.allContract = IContract.reverse();
      this.sort_by_key(this.allContract, 'enddate').reverse();
      this.leftContracts();
      this.firstContract = this.allContractFiltered[this.allContractFiltered.length - 1];
    });

    this.repository.getAllData('expense').subscribe((IExpense: IExpense[]) => {
      this.allExpense = IExpense.reverse();
      this.sort_by_key(this.allExpense, 'expensedate').reverse();
      this.leftExpenses();
      this.firstExpense = this.allExpenseFiltered[this.allExpenseFiltered.length - 1];
    });

    this.repository.getPSummary('payment', this.selectedYear, this.selectedMonth).subscribe((IPSummary: IPSummary[]) => this.allPSummary = IPSummary);
  }

  sort_by_key(array: any, key: string) {
    return array.sort(function (a: any, b: any) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  leftExpenses() { this.allExpense.forEach(e => { if (e.status == 'activo') this.allExpenseFiltered.push(e); }) }
  leftContracts() { this.allContract.forEach(e => { if (e.status == 'activo') this.allContractFiltered.push(e); }) }
}
