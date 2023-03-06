import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { IItem } from 'src/app/protected/interfaces/iitem';
import { IRent } from 'src/app/protected/interfaces/irent';
import { ITax } from 'src/app/protected/interfaces/itax';
import { IZConfig } from 'src/app/protected/interfaces/izconfig';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {

  module: string = 'sale';
  modules = environment.modules;
  allEnte: IEnte[] = [];
  allProperty: IItem[] = [];
  allCurrency: ICurrency[] = [];
  allTax: ITax[] = [];
  allZConfig: IZConfig;
  modalEnte: IEnte[] = [];
  modalProperty: IItem[] = [];
  selectedEnte: IEnte;
  selectedProperty: IItem;
  today: Date = new Date();

  @ViewChild('closeModalEnte') closeModalEnte: ElementRef;
  @ViewChild('closeModalProperty') closeModalProperty: ElementRef;
  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;
  @ViewChild('txtSearchProperty') txtSearchProperty!: ElementRef<HTMLInputElement>;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IContract = {
    'id': '',
    'accountid': this.user.accountid,
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
    'startdate': this.today.toLocaleDateString('en-CA'),
    'enddate': this.today.toLocaleDateString('en-CA'),
    'duration': '12',
    'comments': '',
    'status': 'activo',
    'created_by': this.user.id,
    'modified_by': this.user.id,
    'eimage': '/assets/img/nofoto.png',
    'ename': '',
    'eemail': '',
    'ephone': '',
    'iimage': '/assets/img/nofoto.png',
    'icode': '',
    'ifulladdress': '',
    'iwatermeter': '',
    'ilightmeter': '',
    'iproperty': ''
  }

  reloadRent(): IRent {
    return {
      'id': '',
      'accountid': this.user.accountid,
      'saleid': '',
      'balancedue': '0',
      'amount': '1',
      'currency': 'USD',
      'parity': '1',
      'method': 'efectivo',
      'reference': '',
      'startdate': this.today.toLocaleDateString('en-CA'),
      'enddate': this.today.toLocaleDateString('en-CA'),
      'pyear': this.today.getFullYear().toString(),
      'pmonth': this.modules.basemonths[this.today.getMonth()],
      'status': 'por pagar',
      'created_by': this.user.id,
      'modified_by': this.user.id,
    }

  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getOneById('zconfig', this.user.accountid).subscribe((zConfig: IZConfig) => {
      this.allZConfig = zConfig
      this.repository.getAllData('currency').subscribe((Currencies: ICurrency[]) => { this.allCurrency = Currencies; this.resetCurrency(Currencies.find(c => c.id == zConfig.currencyid)); });
      this.repository.getAllData('tax').subscribe((Tax: ITax[]) => { this.allTax = Tax; this.resetTax(Tax.find(c => c.id == zConfig.taxid)); });
    });

    this.resetAllEnte();
    this.resetAllProperty();

    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))
      .subscribe((resp: IContract) => {
        this.heroe = resp;
        const iente: IEnte | undefined = this.allEnte.find(e => e.id == this.heroe.enteid);
        if (iente?.id) this.setSelectedEnte(iente);
        const iitem: IItem | undefined = this.allProperty.find(e => e.id == this.heroe.itemid);
        if (iitem?.id) this.setSelectedProperty(iitem);
      });
  }

  onChangeCurrency(event: string) { this.resetCurrency(this.allCurrency.find(c => c.currency_code == event)); }

  onChangeTax(event: string) {
    this.resetTax(this.allTax.find(c => c.name == event));
    this.calculateTotal();
  }

  calculateTotal() { this.heroe.total = this.heroe.subtotal + (this.heroe.subtotal * this.heroe.taxamount); }

  resetCurrency(currency: ICurrency | undefined) { this.heroe.currency = currency!.currency_code; this.heroe.parity = currency!.amount; }

  resetTax(tax: ITax | undefined) { this.heroe.taxname = tax!.name; this.heroe.taxamount = tax!.amount; }

  resetAllEnte() { this.repository.getAllData('ente').subscribe(resp => this.allEnte = resp); }

  resetAllProperty() { this.repository.getAllData('item').subscribe(resp => this.allProperty = resp); }

  saveItem() {
    console.log(this.heroe);
    this.repository.putItem(this.module, this.heroe).subscribe(resp => {
      if (resp === 200) this.router.navigate(['app/administracion-de-contratos', this.heroe.id]);
      else Swal.fire('Contrato No actualizado', 'error');
    });
  }

  patchItem(key: string) {
    let value: any;
    if (key == 'status') value = this.heroe.status
    const patchPayload = { 'id': this.heroe.id, [key]: value, }
    this.repository.patchItem(this.module, patchPayload).subscribe(patch => {
      if (patch === 200) {
        this.repository.getListByColumn('rent', 'saleid', this.heroe.id).subscribe(rents => {
          rents.forEach((rent: IRent) => {
            if (rent.status != 'abono' && rent.status != 'completo') {
              rent.status = this.heroe.status;
              this.repository.putItem('rent', rent).subscribe();
            }
          });
          this.router.navigate(['app/administracion-de-contratos']);
        });
      }
      else Swal.fire(value.toUpperCase(), 'error');
    });
  }

  searchItem() {
    this.modalEnte = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';
    if (search.trim().length === 0) { this.modalEnte = this.allEnte; return; }
    this.allEnte.forEach(e => {
      if (Array.isArray(e.name.toLowerCase().match(search))
        || Array.isArray(e.email.toLowerCase().match(search))
        || Array.isArray(e.phone.toLowerCase().match(search))
      ) this.modalEnte.push(e);
    });
  }

  searchProperty() {
    this.modalProperty = [];
    const search = this.txtSearchProperty.nativeElement.value.toLowerCase();
    this.txtSearchProperty.nativeElement.value = '';
    if (search.trim().length === 0) { this.modalProperty = this.allProperty; return; }
    this.allProperty.forEach(p => {
      if (Array.isArray(p.code.toLowerCase().match(search))
        || Array.isArray(p.fulladdress.toLowerCase().match(search))
        || Array.isArray(p.description.toLowerCase().match(search))
        || Array.isArray(p.watermeter.toLowerCase().match(search))
        || Array.isArray(p.lightmeter.toLowerCase().match(search))
        || Array.isArray(p.property.toLowerCase().match(search))
      ) this.modalProperty.push(p);
    });
  }

  resetModalEnte() {
    this.resetAllEnte();
    this.modalEnte = this.allEnte;
  }

  resetModalProperty() {
    this.resetAllProperty();
    this.modalProperty = this.allProperty;
  }

  setSelectedEnte(ente: IEnte) {
    this.selectedEnte = ente;
    this.closeModalEnte.nativeElement.click();
    this.heroe.enteid = ente.id;
  }

  setSelectedProperty(property: IItem) {
    this.selectedProperty = property;
    this.closeModalProperty.nativeElement.click();
    this.heroe.itemid = property.id;
  }

  closeModal() {
    this.closeModalEnte.nativeElement.click();
    this.closeModalProperty.nativeElement.click();
  }
}
