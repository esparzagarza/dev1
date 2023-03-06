import { Component, ElementRef, ViewChild } from '@angular/core';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IExpense } from 'src/app/protected/interfaces/iexpense';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent {

  module: string = 'payment';
  modules = environment.modules;

  allCurrency: ICurrency[] = [];
  allEnte: IEnte[] = [];
  allExpense: IExpense[] = [];
  allFilteredExpense: IExpense[] = [];
  allSale: ISale[] = [];
  allFilteredSale: ISale[] = [];
  allPayment: IPayment[] = [];
  allFilteredPayment: IPayment[] = [];
  allViewFilteredPayment: IPayment[] = [];
  allDataByStatus: IPayment[] = [];
  modalEnte: IEnte[] = [];
  allAccount: IAccount;
  today: Date = new Date();

  selectedYear: string = this.today.getFullYear().toString();
  selectedMonth: string = this.modules.basemonths[this.today.getMonth()];
  selectedMethod: string = '';
  selectedCurrency: string = '';

  summary = {
    'payments': 0,
    'sales': 0,
    'expenses': 0,
    'budgetspent': 0
  };
  selectedEnte: IEnte;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  startHeroe() {
    this.selectedEnte = {
      'id': '',
      "accountid": this.user.accountid,
      'name': '',
      'gender': '',
      'nationality': '',
      'doctype': '',
      'docnumber': '',
      'dob': '',
      'dni': '',
      'fiscalname': '',
      'fulladdress': '',
      'email': '',
      'phone': '',
      "image": '/assets/img/nofoto.png',
      'status': 'activo',
      "created_by": this.user.id,
      "modified_by": this.user.id
    };
  }

  ngOnInit(): void {
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => this.allCurrency = ICurrency);
    this.startHeroe();
    this.resetAllEnte();
    this.reload();
  }

  getSummary() {
    this.summary = {
      'payments': 0,
      'sales': 0,
      'expenses': 0,
      'budgetspent': 0
    };

    this.summary.payments = this.allFilteredPayment.length;
    this.summary.sales = this.allFilteredSale.length;
    this.summary.expenses = this.allFilteredExpense.length;
  }

  reload() {

    this.repository.getOneById('account', this.user.accountid).subscribe((IAccount: IAccount) => {
      this.allAccount = IAccount;
      this.selectedEnte.image = IAccount.image;
      this.selectedEnte.name = IAccount.name;
      this.selectedEnte.email = IAccount.email;
    });

    this.repository.getAllData('sale').subscribe((ISale: ISale[]) => {
      this.allSale = ISale;
      this.allFilteredSale = this.allSale;
    });

    this.repository.getAllData('expense').subscribe((IExpense: IExpense[]) => {
      this.allExpense = IExpense;
      this.allFilteredExpense = this.allExpense;
    });

    this.repository.getAllPayments(this.module).subscribe((resp: IPayment[]) => {
      this.allPayment = resp.reverse();
      this.allFilteredPayment = this.allPayment;
      this.getSummary();
    });
  }

  resetAllEnte() {
    this.repository.getAllData('ente').subscribe((IEnte: IEnte[]) => {
      this.allEnte = IEnte.reverse();
      this.modalEnte = this.allEnte;
    });
  }

  getAllDataByEnte() {
    this.allFilteredSale = this.allSale.filter(f => f.enteid === this.selectedEnte.id);
    this.allFilteredPayment = this.allPayment.filter(f => f.eid === this.selectedEnte.id);
    this.allViewFilteredPayment = this.allFilteredPayment;
  }

  setSelectedEnte(ente: IEnte) {
    if (ente.id === this.selectedEnte.id) return;
    this.selectedEnte = ente;
    this.getAllDataByEnte();
    this.getSummary();
  }

  unSetSelectedEnte() {
    if (!this.selectedEnte.id) return;
    this.startHeroe();
    this.reload();
  }

  emptySelecteds() {
    this.selectedYear = this.today.getFullYear().toString();
    this.selectedMonth = this.modules.basemonths[this.today.getMonth()];
    this.selectedMethod = '';
    this.selectedCurrency = '';
  }

}
