import { Component, ElementRef, ViewChild } from '@angular/core';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { IItem } from 'src/app/protected/interfaces/iitem';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent {

  module: string = 'payment';
  modules = environment.modules;

  allCurrency: ICurrency[] = [];
  allItem: IItem[] = [];
  allExpense: IExpense[] = [];
  allFilteredExpense: IExpense[] = [];
  allSale: ISale[] = [];
  allFilteredSale: ISale[] = [];
  allPayment: IPayment[] = [];
  allFilteredPayment: IPayment[] = [];
  allDataByStatus: IPayment[] = [];
  modalItem: IItem[] = [];
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
  selectedItem: IItem;

  @ViewChild('closeModalItem') closeModalItem: ElementRef;
  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  startHeroe() {
    this.selectedItem = {
      'id': '',
      'accountid': '',
      "property": 'sin asignar',
      'code': '',
      'fulladdress': '',
      "description": '',
      "watermeter": '',
      "lightmeter": '',
      'floors': '',
      'beds': '',
      'baths': '',
      'landsize': '',
      'constructionsize': '',
      'color': '',
      'price': '',
      "image": '/assets/img/nofoto.png',
      'type': '',
      'status': '',
      "created_by": '',
      "modified_by": ''
    };
  }

  ngOnInit(): void {
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => this.allCurrency = ICurrency);
    this.startHeroe();
    this.resetAllItem();
    this.reload();
  }

  getSummary() {
    this.summary = {
      'payments': 0,
      'sales': 0,
      'expenses': 0,
      'budgetspent': 0
    };

    if (this.selectedItem.id) {
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

  resetAllItem() {
    this.repository.getAllData('item').subscribe((IItem: IItem[]) => {
      this.allItem = IItem.reverse();
      this.modalItem = this.allItem;
    });
  }

  getAllDataByItem() {
    this.allFilteredSale = this.allSale.filter(f => f.itemid === this.selectedItem.id);
    this.allFilteredPayment = this.allPayment.filter(f => f.iid === this.selectedItem.id);
    this.allFilteredExpense = this.allExpense.filter(f => f.iid === this.selectedItem.id);
  }

  searchItem() {
    this.modalItem = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) { this.modalItem = this.allItem; return; }

    this.allItem.forEach(e => {
      if (Array.isArray(e.code.toLowerCase().match(search))
        || Array.isArray(e.fulladdress.toLowerCase().match(search))
        || Array.isArray(e.description.toLowerCase().match(search))
        || Array.isArray(e.watermeter.toLowerCase().match(search))
        || Array.isArray(e.lightmeter.toLowerCase().match(search))
        || Array.isArray(e.property.toLowerCase().match(search))
        || Array.isArray(e.color.toLowerCase().match(search))
      ) this.modalItem.push(e);
    });
  }

  setSelectedItem(item: IItem) {
    this.closeModalItem.nativeElement.click();
    if (item.id === this.selectedItem.id) return;
    this.selectedItem = item;
    this.getAllDataByItem();
    this.getSummary();
  }

  unSetSelectedItem() {
    this.closeModalItem.nativeElement.click();
    if (!this.selectedItem.id) return;
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
