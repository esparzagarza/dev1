import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html'
})
export class CurrencyComponent {

  fileName = '';
  module: string = 'currency';
  allData: ICurrency[] = [];
  allDataByStatus: ICurrency[] = [];
  selectedStatus: string = 'activo';
  modules = environment.modules;

  heroe: ICurrency = this.resetHeroe();
  shorForm: boolean = false;

  letsdoitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    symbol: ['', []],
    currency_precision: ['', []],
    thousand_separator: ['', []],
    decimal_separator: ['', []],
    currency_code: ['', []],
    status: ['', [Validators.required]]
  });

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void { this.reload(); }

  reload() {
    this.repository.getAllData(this.module).subscribe((resp: ICurrency[]) => {
      this.allData = resp.reverse();
      this.getAllDataByStatus(this.selectedStatus);

    });
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

  resetForm(flag: boolean) {
    this.heroe = this.resetHeroe();
    this.shorForm = flag;
  }

  resetHeroe() {
    return {
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
  }

  selectHeroe(heroe: ICurrency) { this.heroe = heroe; this.shorForm = true; }

  saveItem() {

    const { name, amount, symbol, currency_precision, thousand_separator, decimal_separator, currency_code, status } = this.letsdoitForm.value;

    this.heroe.name = name;
    this.heroe.amount = amount;
    this.heroe.symbol = symbol;
    this.heroe.currency_precision = currency_precision;
    this.heroe.thousand_separator = thousand_separator;
    this.heroe.decimal_separator = decimal_separator;
    this.heroe.currency_code = currency_code;
    this.heroe.status = status;

    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => this.reload());
    else this.repository.putItem(this.module, this.heroe).subscribe();

    this.resetForm(false);
  }

  changecurrency(ccode: string) {
    const tmpCode = this.modules.basecurrency.find(f => f.ccode == ccode);
    if (tmpCode?.ccode) this.heroe.name = tmpCode.cname;
  }

}
