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

  @ViewChild('closeModalEnte') closeModalEnte: ElementRef;
  @ViewChild('txtSearchEnte') txtSearchEnte!: ElementRef<HTMLInputElement>;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  startHeroe() {
    this.selectedEnte = {
      'id': '',
      "accountid": '0',
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
      'status': '',
      "created_by": '',
      "modified_by": ''
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

    if (this.selectedEnte.id) {
      this.summary.payments = this.allFilteredPayment.length;
      this.summary.sales = this.allFilteredSale.length;
      this.summary.expenses = this.allFilteredExpense.length;
    }
  }

  reload() {

    this.repository.getAllData('sale').subscribe((ISale: ISale[]) => {
      this.allSale = ISale;
      this.allFilteredSale = this.allSale;
    });

    this.repository.getAllExpenses('expense').subscribe((IExpense: IExpense[]) => {
      this.allExpense = IExpense;
    });

    this.repository.getAllPayments(this.module).subscribe((resp: IPayment[]) => {
      this.allPayment = resp.reverse();
    });

    this.getSummary();
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
    this.allFilteredExpense = this.allExpense.filter(f => f.eid === this.selectedEnte.id);
  }

  searchEnte() {
    this.modalEnte = [];
    const search = this.txtSearchEnte.nativeElement.value.toLowerCase();
    this.txtSearchEnte.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.modalEnte = this.allEnte;
      return;
    }

    this.allEnte.forEach(e => {
      if (Array.isArray(e.name.toLowerCase().match(search))
        || Array.isArray(e.email.toLowerCase().match(search))
        || Array.isArray(e.phone.toLowerCase().match(search))
      ) this.modalEnte.push(e);
    });
  }

  setSelectedEnte(ente: IEnte) {
    this.closeModalEnte.nativeElement.click();
    if (ente.id === this.selectedEnte.id) return;
    this.selectedEnte = ente;
    this.getAllDataByEnte();
    this.getSummary();
  }

  unSetSelectedEnte() {
    this.closeModalEnte.nativeElement.click();
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
