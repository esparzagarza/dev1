import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { ITax } from 'src/app/protected/interfaces/itax';
import { IItem } from 'src/app/protected/interfaces/iitem';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html'
})
export class ContractsComponent {

  module: string = 'sale';
  modules = environment.modules;

  selectedItem: IItem;

  @Input('item')
  set item(val: IItem) {
    this.emptySelecteds();
    if (val.id) this.setSelectedItem(val);
    else this.unSetSelectedItem();
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

  getAllDataByItem() {
    this.allFilteredContract = this.allContract.filter(f => f.itemid === this.selectedItem.id);
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

  setSelectedItem(item: IItem) {
    if (item.id === this.selectedItem.id) return;
    this.selectedItem = item;
    this.getAllDataByItem();
  }

  unSetSelectedItem() {
    if (!this.selectedItem?.id) return;
    this.startHeroe();
    this.reload();
  }

  emptySelecteds() {
    this.selectedStatus = 'activo';
    this.selectedTax = '';
    this.selectedCurrency = '';
  }

}
