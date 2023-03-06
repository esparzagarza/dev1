import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html'
})
export class RentsComponent {

  module: string = 'payment';
  modules = environment.modules;

  selectedEnte: IEnte;

  @Input('ente')
  set ente(val: IEnte) {
    this.emptySelecteds();
    if (val.id) this.setSelectedEnte(val);
    else this.unSetSelectedEnte();
  }

  allCurrency: ICurrency[] = [];
  allSale: ISale[] = [];
  allFilteredSale: ISale[] = [];
  allPayment: IPayment[] = [];
  allFilteredPayment: IPayment[] = [];
  allViewFilteredPayment: IPayment[] = [];
  allDataByStatus: IPayment[] = [];
  today: Date = new Date();

  selectedYear: string = this.today.getFullYear().toString();
  selectedMonth: string = this.modules.basemonths[this.today.getMonth()];
  selectedMethod: string = '';
  selectedCurrency: string = '';

  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;

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
    this.startHeroe();
    this.reload();
  }

  reload() {
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => this.allCurrency = ICurrency);

    this.repository.getAllData('sale').subscribe((ISale: ISale[]) => {
      this.allSale = ISale;
      this.allFilteredSale = this.allSale;
    });

    this.repository.getAllPayments(this.module).subscribe((resp: IPayment[]) => {
      this.allPayment = resp.reverse();
    });
  }

  getAllDataByEnte() {
    this.allFilteredSale = this.allSale.filter(f => f.enteid === this.selectedEnte.id);
    this.allFilteredPayment = this.allPayment.filter(f => f.eid === this.selectedEnte.id);
    this.getAllDataByFilters(this.selectedYear, this.selectedMonth, this.selectedMethod, this.selectedCurrency);
  }

  getAllDataByFilters(year: string = '', month: string = '', method: string = '', currency: string = '') {
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedMethod = method;
    this.selectedCurrency = currency;
    this.allViewFilteredPayment = this.allFilteredPayment;

    if (this.selectedYear) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.pyear === this.selectedYear);
    if (this.selectedMonth) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.pmonth === this.selectedMonth);
    if (this.selectedMethod) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.method === this.selectedMethod);
    if (this.selectedCurrency) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.currency === this.selectedCurrency);
  }

  searchItem() {
    this.emptySelecteds();
    this.allViewFilteredPayment = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByFilters(this.selectedYear, this.selectedMonth, this.selectedMethod, this.selectedCurrency);
      return;
    }

    if (Number(search)) {
      const tmp: IPayment | undefined = this.allPayment.find(d => d.id == search);
      if (tmp?.id) this.allViewFilteredPayment.push(tmp);
    } else {

      this.allFilteredPayment.forEach(p => {
        if (Array.isArray(p.id === search)
          || Array.isArray(p.icode.toLowerCase().match(search))
          || Array.isArray(p.ifulladdress.toLowerCase().match(search))
          || Array.isArray(p.iwatermeter.toLowerCase().match(search))
          || Array.isArray(p.ilightmeter.toLowerCase().match(search))
          || Array.isArray(p.iproperty.toLowerCase().match(search))
          || Array.isArray(p.ename.toLowerCase().match(search))
          || Array.isArray(p.eemail.toLowerCase().match(search))
          || Array.isArray(p.ephone.toLowerCase().match(search))
        ) this.allViewFilteredPayment.push(p);
      });
    }
  }

  setSelectedEnte(ente: IEnte) {
    if (ente.id === this.selectedEnte.id) return;
    this.selectedEnte = ente;
    this.getAllDataByEnte();
  }

  unSetSelectedEnte() {
    if (!this.selectedEnte?.id) return;
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
