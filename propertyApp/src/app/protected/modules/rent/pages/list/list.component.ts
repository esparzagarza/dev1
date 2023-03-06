import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IRents } from 'src/app/protected/interfaces/irents';
import { IZConfig } from 'src/app/protected/interfaces/izconfig';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  module: string = 'rent';
  allCurrency: ICurrency[] = [];
  allRent: IRents[] = [];
  allViewFilteredRent: IRents[] = [];
  allContract: IContract[] = [];
  allZConfig: IZConfig;
  modalContract: IContract[] = [];
  today: Date = new Date();
  contractStatus: string[] = ['borrador', 'activo', 'creado'];
  modules = environment.modules;
  balanceDue: number = 0;
  payable: number = 0;
  heroe: IRents;

  selectedContract: IContract;
  selectedYear: string = this.today.getFullYear().toString();
  selectedMonth: string = this.modules.basemonths[this.today.getMonth()];
  selectedMethod: string = '';
  selectedCurrency: string = '';

  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;
  @ViewChild('closeModalContract') closeModalContract: ElementRef;
  @ViewChild('txtSearchContract') txtSearchContract!: ElementRef<HTMLInputElement>;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  startHeroe() {
    this.heroe = {
      'id': '',
      "accountid": this.user.accountid,
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
      'status': 'completo',
      "created_by": this.user.id,
      "modified_by": this.user.id,
      'stype': '',
      'stotal': '',
      'scurrency': '',
      'sstartdate': '',
      'senddate': '',
      'eid': '',
      'eimage': '',
      'ename': '',
      'eemail': '',
      'ephone': '',
      'iid': '',
      'iimage': '',
      'icode': '',
      'ifulladdress': '',
      'iwatermeter': '',
      'ilightmeter': '',
      'iproperty': ''
    };

    this.selectedContract = {
      'id': '',
      "accountid": this.user.accountid,
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
      "created_by": this.user.id,
      "modified_by": this.user.id,
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
  }

  letsdoitForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    parity: ['', [Validators.required]],
    method: ['', [Validators.required]],
    reference: ['', []],
    startdate: ['', [Validators.required]],
    enddate: ['', [Validators.required]],
    pyear: ['', [Validators.required]],
    pmonth: ['', [Validators.required]]
  });

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.startHeroe();
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => {
      this.allCurrency = ICurrency
      this.repository.getOneById('zconfig', this.user.accountid).subscribe((zconfig: IZConfig) => {
        this.allZConfig = zconfig
        this.emptySelecteds();
      });
    });

    this.resetAllContract();
    this.reload();
  }

  reload() {
    this.repository.getAllRents(this.module).subscribe((resp: IRents[]) => {
      this.allRent = resp.reverse();
      this.getAllDataByFilters(this.selectedYear, this.selectedMonth, this.selectedMethod, this.selectedCurrency);
    });
  }

  resetAllContract() {
    this.repository.getAllContracts('sale').subscribe((resp: IContract[]) => this.allContract = resp.reverse().filter(r => this.contractStatus.includes(r.status)));
  }

  getAllDataByFilters(year: string = '', month: string = '', method: string = '', currency: string = '') {
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedMethod = method;
    this.selectedCurrency = currency;
    this.allViewFilteredRent = this.allRent;

    if (this.selectedYear) this.allViewFilteredRent = this.allViewFilteredRent.filter(f => f.pyear === this.selectedYear);
    if (this.selectedMonth) this.allViewFilteredRent = this.allViewFilteredRent.filter(f => f.pmonth === this.selectedMonth);
    if (this.selectedMethod) this.allViewFilteredRent = this.allViewFilteredRent.filter(f => f.method === this.selectedMethod);
    if (this.selectedCurrency) this.allViewFilteredRent = this.allViewFilteredRent.filter(f => f.currency === this.selectedCurrency);
  }

  saveItem() {

    const { amount, currency, parity, method, reference, pyear, pmonth } = this.letsdoitForm.value;
    if (amount > this.payable) { Swal.fire('El valor del monto a pagar no puede ser mayor al saldo por pagar', 'error'); return; }

    this.heroe.balancedue = (this.payable - amount).toFixed(2).toString();
    this.heroe.amount = amount;
    this.heroe.currency = currency;
    this.heroe.parity = parity;
    this.heroe.method = method;
    this.heroe.reference = reference;
    this.heroe.pyear = pyear;
    this.heroe.pmonth = pmonth;
    this.heroe.status = this.payable == amount ? 'completo' : 'abono';

    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => { Swal.fire('Nuevo Pago Agregado', 'success'); this.reload(); });
    else this.repository.putItem(this.module, this.heroe).subscribe(resp => { Swal.fire('Pago Editado', 'success'); this.reload(); });

    this.closeModalContract.nativeElement.click();
    this.startHeroe();
  }

  patchItem(id: string) {
    const patch: IRents | undefined = this.allRent.find(d => d.id === id);
    if (patch?.id) {
      const value: string = patch.status == 'activo' ? 'inactivo' : 'activo';
      const patchPayload = { "id": patch.id, 'status': value, }
      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) { this.allRent.find(d => { if (d.id === patch.id) { d.status = value; return; } }); }
        else Swal.fire(value.toUpperCase(), 'error');
      });
    }
  }


  searchItem() {
    this.emptySelecteds();
    this.allViewFilteredRent = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByFilters(this.selectedYear, this.selectedMonth, this.selectedMethod, this.selectedCurrency);
      return;
    }

    if (Number(search)) {
      this.allViewFilteredRent = this.allRent.filter(d => d.saleid == search);
    } else {

      this.allRent.forEach(p => {
        if (Array.isArray(p.id === search)
          || Array.isArray(p.pmonth.toLowerCase().match(search))
          || Array.isArray(p.currency.toLowerCase().match(search))
          || Array.isArray(p.method.toLowerCase().match(search))
          || Array.isArray(p.icode.toLowerCase().match(search))
          || Array.isArray(p.ifulladdress.toLowerCase().match(search))
          || Array.isArray(p.iwatermeter.toLowerCase().match(search))
          || Array.isArray(p.ilightmeter.toLowerCase().match(search))
          || Array.isArray(p.iproperty.toLowerCase().match(search))
          || Array.isArray(p.ename.toLowerCase().match(search))
          || Array.isArray(p.eemail.toLowerCase().match(search))
          || Array.isArray(p.ephone.toLowerCase().match(search))
        ) this.allViewFilteredRent.push(p);
      });
    }
  }


  resetModalContract() {
    this.heroe.saleid = '';
    this.resetAllContract();
    this.modalContract = this.allContract;
  }

  calculateBalanceDue() {

    this.payable = 0;
    this.balanceDue = 0;
    this.allRent.forEach(d => {
      if (d.saleid == this.heroe.saleid && d.pyear == this.heroe.pyear && d.pmonth == this.heroe.pmonth) {
        this.balanceDue += parseFloat(d.amount) / parseFloat(d.parity);
      }
    });

    this.payable = parseFloat(((this.selectedContract.total - this.balanceDue) * parseFloat(this.heroe.parity)).toFixed(2));
  }

  setSelectedContract(id: string) {
    this.heroe.saleid = id;
    const tmp = this.allContract.find(c => c.id == id);
    if (tmp?.id) {
      this.selectedContract = tmp;
      this.heroe.amount = tmp.total.toString();
      this.heroe.currency = tmp.currency;
      this.balanceDue = tmp.total;
      this.heroe.startdate = tmp.startdate;
      this.heroe.enddate = tmp.enddate;
      this.heroe.saleid = tmp.id;
      this.calculateBalanceDue();
    }
  }

  unsetSelectedContract() {
    if (this.heroe.saleid != '') this.heroe.saleid = '';
    if (this.selectedContract.id != '') this.selectedContract.id = '';
  }

  closeModal() {
    this.closeModalContract.nativeElement.click();
    this.unsetSelectedContract();
  }

  updateModal(id: string) {
    this.allRent.find(d => {
      if (d.id === id) {
        this.heroe = d;
        this.setSelectedContract(d.saleid);
        return;
      }
    });
  }

  emptySelecteds() {
    this.selectedYear = this.today.getFullYear().toString();
    this.selectedMonth = this.modules.basemonths[this.today.getMonth()];
    this.selectedMethod = '';
    this.selectedCurrency = '';
  }

  changeParity(currency_code: string) {
    const tmpcurrency = this.allCurrency.find(c => c.currency_code == currency_code);
    if (tmpcurrency?.id) this.heroe.parity = tmpcurrency?.amount.toString();
    this.calculateBalanceDue();
  }

  calcBalance(total: string, paid: string): number { return parseFloat(total) - parseFloat(paid); }

}
