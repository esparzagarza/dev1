import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from 'src/app/protected/interfaces/icategory';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  module: string = 'expense';
  allData: IExpense[] = [];
  allDataByStatus: IExpense[] = [];
  allContract: IContract[] = [];
  allCategory: ICategory[] = [];
  allCurrency: ICurrency[] = [];
  modalContract: IContract[] = [];
  selectedStatus: string = '';
  selectedCategory: string = '';
  selectedContract: IContract;
  today: Date = new Date();
  contractStatus: string[] = ['borrador', 'activo', 'creado'];

  modules = environment.modules;

  @ViewChild('closeModalContract') closeModalContract: ElementRef;
  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;
  @ViewChild('txtSearchContract') txtSearchContract!: ElementRef<HTMLInputElement>;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IExpense = {
    'id': '',
    "accountid": this.user.accountid,
    'saleid': '',
    'categoryname': 'Sin categoría',
    'currency': 'USD',
    'description': '',
    'amount': '1',
    'expensedate': this.today.toLocaleDateString('en-CA'),
    'status': 'activo',
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
  }

  letsdoitForm: FormGroup = this.fb.group({
    categoryname: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    description: ['', []],
    amount: ['', [Validators.required]],
    expensedate: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.repository.getAllData('currency').subscribe((resp: ICurrency[]) => this.allCurrency = resp);
    this.repository.getAllData('category').subscribe((resp: ICategory[]) => this.allCategory = resp);
    this.resetAllContract();
    this.reload();
  }

  reload() {
    this.repository.getAllData(this.module).subscribe((resp: IExpense[]) => {
      this.allData = resp.reverse();
      this.getAllDataByStatus(this.selectedStatus);
    });
  }

  resetAllContract() {
    this.repository.getAllContracts('sale').subscribe((resp: IContract[]) => this.allContract = resp.reverse().filter(r => this.contractStatus.includes(r.status)));
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

  getAllDataByCategory(newCategory: any = '') {
    this.selectedCategory = newCategory;
    this.allDataByStatus = newCategory === '' ? this.allData : this.allData.filter(f => f.categoryname === this.selectedCategory);
  }

  saveItem() {

    const { categoryname, currency, description, amount, expensedate, status } = this.letsdoitForm.value;

    this.heroe.categoryname = categoryname;
    this.heroe.currency = currency;
    this.heroe.description = description;
    this.heroe.amount = amount;
    this.heroe.expensedate = expensedate;
    this.heroe.status = status;
    this.heroe.saleid = this.selectedContract.id;

    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => { Swal.fire('Nuevo Servicio Agregado', 'success'); this.reload(); });
    else this.repository.putItem(this.module, this.heroe).subscribe(resp => { Swal.fire('Servicio Editado', 'success'); this.reload(); });
    this.closeModalContract.nativeElement.click();
  }

  patchItem(id: string) {
    const patch: IExpense | undefined = this.allData.find(d => d.id === id);
    if (patch?.id) {
      const value: string = patch.status == 'activo' ? 'inactivo' : 'activo';
      const patchPayload = { "id": patch.id, 'status': value, }
      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) { this.allData.find(d => { if (d.id === patch.id) { d.status = value; return; } }); }
        else Swal.fire(value.toUpperCase(), 'error');
      });
    }
  }

  searchItem() {
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.allDataByStatus = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByStatus(this.selectedStatus);
      return;
    }

    if (Number(search)) {
      const tmp: IExpense | undefined = this.allData.find(d => d.id == search);
      if (tmp?.id) this.allDataByStatus.push(tmp);
    } else {

      this.allData.forEach(e => {
        if (Array.isArray(e.id === search)
          || Array.isArray(e.description.toLowerCase().match(search))
          || Array.isArray(e.expensedate.toLowerCase().match(search))
        ) this.allDataByStatus.push(e);
      });
    }
  }

  searchContract() {
    this.modalContract = [];
    const search = this.txtSearchContract.nativeElement.value.toLowerCase();
    this.txtSearchContract.nativeElement.value = '';


    if (search.trim().length === 0) {
      this.modalContract = this.allContract;
      return;
    }

    if (Number(search)) {
      const tmp: IContract | undefined = this.allContract.find(d => d.id == search);
      if (tmp?.id) this.modalContract.push(tmp);
    } else {

      this.allContract.forEach(e => {
        if (Array.isArray(e.ename.toLowerCase().match(search))
          || Array.isArray(e.eemail.toLowerCase().match(search))
          || Array.isArray(e.ephone.toLowerCase().match(search))
          || Array.isArray(e.icode.toLowerCase().match(search))
          || Array.isArray(e.ifulladdress.toLowerCase().match(search))
          || Array.isArray(e.iwatermeter.toLowerCase().match(search))
          || Array.isArray(e.ilightmeter.toLowerCase().match(search))
          || Array.isArray(e.iproperty.toLowerCase().match(search))
        ) this.modalContract.push(e);
      });
    }
  }

  resetModalContract() {
    this.resetAllContract();
    this.modalContract = this.allContract;
  }

  setSelectedContract(id: string) {
    this.heroe.saleid = id;
    const tmp = this.allContract.find(c => c.id == id);
    if (tmp?.id) this.selectedContract = tmp;
  }

  unsetSelectedContract() {
    this.heroe.saleid = '';
    if (this.selectedContract.id) this.selectedContract.id = '';
  }

  closeModal() {
    this.closeModalContract.nativeElement.click();
    this.unsetSelectedContract();
  }

  updateModal(id: string) {
    this.allData.find(d => {
      if (d.id === id) {
        this.heroe = d;
        this.setSelectedContract(d.saleid);
        return;
      }
    });
  }

}
