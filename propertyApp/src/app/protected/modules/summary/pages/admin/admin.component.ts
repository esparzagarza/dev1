import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { IContractSummary, IPaymentSummary } from 'src/app/protected/interfaces/isummary';
import { ITax } from 'src/app/protected/interfaces/itax';
import { IZConfig } from 'src/app/protected/interfaces/izconfig';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {

  module: string = 'account';
  modules = environment.modules;
  baseUrl: string = environment.baseUrl;
  allSale: ISale[] = [];
  allSaleFiltered: ISale[] = [];
  allPayment: IPayment[] = [];
  allPaymentFiltered: IPayment[] = [];
  allTax: ITax[] = [];
  allCurrency: ICurrency[] = [];
  salebasecurrency: any = this.reloadBaseCurrency();
  paymentbasecurrency: any = this.reloadBaseCurrency();
  selectedFilter: string = 'thisyear';
  summaryContracts: IContractSummary = this.reloadsummaryContracts();
  summaryPayments: IPaymentSummary = this.reloadsummaryPayments();

  reloadBaseCurrency() {
    return [
      { ccode: 'AED', camount: 0 },
      { ccode: 'ARS', camount: 0 },
      { ccode: 'AUD', camount: 0 },
      { ccode: 'BDT', camount: 0 },
      { ccode: 'BRL', camount: 0 },
      { ccode: 'CAD', camount: 0 },
      { ccode: 'CHF', camount: 0 },
      { ccode: 'CNY', camount: 0 },
      { ccode: 'COP', camount: 0 },
      { ccode: 'DKK', camount: 0 },
      { ccode: 'EGP', camount: 0 },
      { ccode: 'EUR', camount: 0 },
      { ccode: 'GBP', camount: 0 },
      { ccode: 'GTQ', camount: 0 },
      { ccode: 'HKD', camount: 0 },
      { ccode: 'IDR', camount: 0 },
      { ccode: 'ILS', camount: 0 },
      { ccode: 'INR', camount: 0 },
      { ccode: 'KES', camount: 0 },
      { ccode: 'MXN', camount: 0 },
      { ccode: 'MYR', camount: 0 },
      { ccode: 'NGN', camount: 0 },
      { ccode: 'NOK', camount: 0 },
      { ccode: 'NZD', camount: 0 },
      { ccode: 'PHP', camount: 0 },
      { ccode: 'SEK', camount: 0 },
      { ccode: 'SGD', camount: 0 },
      { ccode: 'THB', camount: 0 },
      { ccode: 'USD', camount: 0 },
      { ccode: 'VND', camount: 0 },
      { ccode: 'XOF', camount: 0 },
      { ccode: 'ZAR', camount: 0 },
    ];
  }

  selectedCurrency: ICurrency = {
    'id': '',
    'accountid': this.user.accountid,
    'name': 'US Dollar',
    'amount': 1,
    'symbol': '$',
    'currency_precision': '2',
    'thousand_separator': ',',
    'decimal_separator': '.',
    'currency_code': 'USD',
    'status': 'activo',
    'created_by': this.user.id,
    'modified_by': this.user.id
  }


  IZConfig: IZConfig = {
    'id': '',
    'accountid': this.user.accountid,
    'currencyid': '1',
    'taxid': '1',
    'smtpfromname': '',
    'smtpfromemail': '',
    'smtpfrompassword': '',
    'smtptoname': '',
    'smtptoemail': '',
    'smtptomensaje': '',
    'created_by': this.user.id,
    'modified_by': this.user.id
  };

  allAccount: IAccount = {
    'id': '',
    'email': '',
    'name': '',
    'appname': '',
    'description': '',
    'slug': '',
    "image": '/assets/img/nofoto.png',
    'type': '',
    'status': '',
    'modified_by': '',
    'modified_at': '',
  };

  reloadsummaryContracts() {
    return {
      'borrador': { 'qty': 0, 'total': 0 },
      'activos': { 'qty': 0, 'total': 0 },
      'cancelados': { 'qty': 0, 'total': 0 },
      'otros': { 'qty': 0, 'total': 0 }
    }
  };

  reloadsummaryPayments() {
    return {
      'cheque': { 'qty': 0, 'total': 0 },
      'deposito': { 'qty': 0, 'total': 0 },
      'efectivo': { 'qty': 0, 'total': 0 },
      'transferencia': { 'qty': 0, 'total': 0 },
      'otros': { 'qty': 0, 'total': 0 }
    }
  }

  @ViewChild('closeModalMenu') closeModalMenu: ElementRef;

  get user() { return this.authService.user; }
  get datenow() { return this.repository.datenow; }
  get dateyear() { return this.repository.datenow.getFullYear(); }
  get datemonth() { return this.modules.basemonths[this.repository.datenow.getMonth()]; }

  constructor(private authService: AuthService, private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData('sale').subscribe((ISale: ISale[]) => this.allSale = ISale);
    this.repository.getAllData('payment').subscribe((IPayment: IPayment[]) => this.allPayment = IPayment);
    this.repository.getOneById(this.module, this.user.accountid).subscribe((IAccount: IAccount) => this.allAccount = IAccount);
    this.repository.getOneById('zconfig', this.user.accountid).subscribe((IZConfig: IZConfig) => {
      this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => {
        this.allCurrency = ICurrency;
        const tmpcurrency = this.allCurrency.find(d => d.id == IZConfig.currencyid);
        if (tmpcurrency?.id) this.selectedCurrency = tmpcurrency;
        this.reload(this.selectedFilter);
      });
    });
  }

  reload(filter: string) {
    this.selectedFilter = filter;
    this.filterSummarySale();
    this.filterSummaryPayment();
  }

  filterSummarySale() {

    if (this.selectedFilter == 'thisyear') { this.allSaleFiltered = this.allSale.filter(s => s.startdate.substring(0, 4) == this.dateyear.toString()); }
    if (this.selectedFilter == 'thismonth') { this.allSaleFiltered = this.allSale.filter(s => s.startdate.substring(0, 4) == this.dateyear.toString() && (parseInt(s.startdate.substring(5, 7)) - 1) == this.repository.datenow.getMonth()); }

    this.summaryContracts = this.reloadsummaryContracts();
    this.salebasecurrency = this.reloadBaseCurrency();

    this.summaryContracts.borrador.qty = this.allSaleFiltered.filter(d => d.status == 'finalizado').length;
    this.summaryContracts.activos.qty = this.allSaleFiltered.filter(d => d.status == 'activo').length;
    this.summaryContracts.cancelados.qty = this.allSaleFiltered.filter(d => d.status == 'cancelado').length;
    this.summaryContracts.otros.qty = this.allSaleFiltered.filter(d => d.status != 'activo' && d.status != 'finalizado' && d.status != 'cancelado').length;

    this.allSaleFiltered.forEach(d => {
      if (d.status == 'activo') { this.summaryContracts.activos.total += (parseFloat(d.total) / parseFloat(d.parity)); }
      else if (d.status == 'borrador') { this.summaryContracts.borrador.total += (parseFloat(d.total) / parseFloat(d.parity)); }
      else if (d.status == 'cancelado') { this.summaryContracts.cancelados.total += (parseFloat(d.total) / parseFloat(d.parity)); }
      else { this.summaryContracts.otros.total += (parseFloat(d.total) / parseFloat(d.parity)); }

      if (d.status == 'finalizado') {
        this.salebasecurrency.forEach((c: any) => {
          if (c.ccode == d.currency) {
            const tmp = c.camount;
            const sum = tmp + parseFloat(d.total)
            c.camount = sum;
          }
        });
      }
    });
  }

  filterSummaryPayment() {

    if (this.selectedFilter == 'thisyear') { this.allPaymentFiltered = this.allPayment.filter(p => p.pyear.toString() == this.dateyear.toString()); }
    if (this.selectedFilter == 'thismonth') { this.allPaymentFiltered = this.allPayment.filter(p => p.pyear.toString() == this.dateyear.toString() && p.pmonth == this.datemonth); }

    this.summaryPayments = this.reloadsummaryPayments();
    this.paymentbasecurrency = this.reloadBaseCurrency();

    this.summaryPayments.cheque.qty = this.allPaymentFiltered.filter(p => p.method == 'cheque').length;
    this.summaryPayments.deposito.qty = this.allPaymentFiltered.filter(p => p.method == 'deposito').length;
    this.summaryPayments.efectivo.qty = this.allPaymentFiltered.filter(p => p.method == 'efectivo').length;
    this.summaryPayments.transferencia.qty = this.allPaymentFiltered.filter(p => p.method == 'transferencia').length;

    this.allPaymentFiltered.forEach(p => {
      if (p.method == 'cheque') { this.summaryPayments.cheque.total += (parseFloat(p.amount) / parseFloat(p.parity)); }
      else if (p.method == 'deposito') { this.summaryPayments.deposito.total += (parseFloat(p.amount) / parseFloat(p.parity)); }
      else if (p.method == 'efectivo') { this.summaryPayments.efectivo.total += (parseFloat(p.amount) / parseFloat(p.parity)); }
      else if (p.method == 'transferencia') { this.summaryPayments.transferencia.total += (parseFloat(p.amount) / parseFloat(p.parity)); }
      else { this.summaryPayments.otros.total += (parseFloat(p.amount) / parseFloat(p.parity)); }

      if (p.status == 'completo') {
        this.paymentbasecurrency.forEach((c: any) => {
          if (c.ccode == p.currency) {
            const tmp = c.camount;
            const sum = tmp + parseFloat(p.amount)
            c.camount = sum;
          }
        });
      }
    });
  }

}
