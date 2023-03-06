import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { ITax } from 'src/app/protected/interfaces/itax';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent {

  module: string = 'sale';
  modules = environment.modules;

  selectedEnte: IEnte;

  @Input('ente')
  set ente(val: IEnte) {
    this.emptySelecteds();
    if (val.id) this.setSelectedEnte(val);
    else this.unSetSelectedEnte();
  }

  allTax: ITax[] = [];
  allCurrency: ICurrency[] = [];
  allContract: IContract[] = [];
  allFilteredContract: IContract[] = [];
  allViewFilteredPayment: IContract[] = [];
  allDataByStatus: IContract[] = [];

  selectedStatus: string = 'activo';
  selectedTax: string = '';
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
    this.repository.getAllData('tax').subscribe((ITax: ITax[]) => this.allTax = ITax);

    this.repository.getAllContracts(this.module).subscribe((resp: IContract[]) => {
      this.allContract = resp.reverse();
    });
  }

  getAllDataByEnte() {
    this.allFilteredContract = this.allContract.filter(f => f.enteid === this.selectedEnte.id);
    this.getAllDataByFilters(this.selectedStatus, this.selectedTax, this.selectedCurrency);
  }

  getAllDataByFilters(status: string = '', tax: string = '', currency: string = '') {
    this.selectedStatus = status;
    this.selectedTax = tax;
    this.selectedCurrency = currency;
    this.allViewFilteredPayment = this.allFilteredContract;

    if (this.selectedStatus) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.status === this.selectedStatus);
    if (this.selectedTax) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.taxname === this.selectedTax);
    if (this.selectedCurrency) this.allViewFilteredPayment = this.allViewFilteredPayment.filter(f => f.currency === this.selectedCurrency);
  }

  searchItem() {
    this.emptySelecteds();
    this.allViewFilteredPayment = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByFilters(this.selectedStatus, this.selectedTax, this.selectedCurrency);
      return;
    }

    if (Number(search)) {
      const tmp: IContract | undefined = this.allContract.find(d => d.id == search);
      if (tmp?.id) this.allViewFilteredPayment.push(tmp);
    } else {

      this.allFilteredContract.forEach(p => {
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
    this.selectedStatus = 'activo';
    this.selectedTax = '';
    this.selectedCurrency = '';
  }

}
