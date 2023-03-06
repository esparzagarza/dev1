import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { ICategory } from 'src/app/protected/interfaces/icategory';
import { IEnte } from 'src/app/protected/interfaces/iente';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent {

  module: string = 'expense';
  modules = environment.modules;

  selectedEnte: IEnte;

  @Input('ente')
  set ente(val: IEnte) {
    this.emptySelecteds();
    if (val.id) this.setSelectedEnte(val);
    else this.unSetSelectedEnte();
  }

  allCurrency: ICurrency[] = [];
  allCategory: ICategory[] = [];
  allExpense: IExpense[] = [];
  allFilteredExpense: IExpense[] = [];
  allViewFilteredExpense: IExpense[] = [];
  allDataByStatus: IExpense[] = [];

  selectedStatus: string = 'activo';
  selectedCategory: string = '';
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
    this.repository.getAllData('category').subscribe((ICategory: ICategory[]) => this.allCategory = ICategory);

    this.repository.getAllExpenses(this.module).subscribe((IExpense: IExpense[]) => {
      this.allExpense = IExpense.reverse();
    });
  }

  getAllDataByEnte() {
    this.allFilteredExpense = this.allExpense.filter(f => f.eid === this.selectedEnte.id);
    this.getAllDataByFilters(this.selectedStatus, this.selectedCategory, this.selectedCurrency);
  }

  getAllDataByFilters(status: string = '', category: string = '', currency: string = '') {
    this.selectedStatus = status;
    this.selectedCategory = category;
    this.selectedCurrency = currency;
    this.allViewFilteredExpense = this.allFilteredExpense;

    if (this.selectedStatus) this.allViewFilteredExpense = this.allViewFilteredExpense.filter(f => f.status === this.selectedStatus);
    if (this.selectedCategory) this.allViewFilteredExpense = this.allViewFilteredExpense.filter(f => f.categoryname === this.selectedCategory);
    if (this.selectedCurrency) this.allViewFilteredExpense = this.allViewFilteredExpense.filter(f => f.currency === this.selectedCurrency);
  }

  searchItem() {
    this.emptySelecteds();
    this.allViewFilteredExpense = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByFilters(this.selectedStatus, this.selectedCategory, this.selectedCurrency);
      return;
    }

    if (Number(search)) {
      const tmp: IExpense | undefined = this.allExpense.find(d => d.id == search);
      if (tmp?.id) this.allViewFilteredExpense.push(tmp);
    } else {

      this.allFilteredExpense.forEach(e => {
        if (Array.isArray(e.id === search)
          || Array.isArray(e.categoryname.toLowerCase().match(search))
          || Array.isArray(e.description.toLowerCase().match(search))
          || Array.isArray(e.expensedate.toLowerCase().match(search))
        ) this.allViewFilteredExpense.push(e);
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
    this.selectedCategory = '';
    this.selectedCurrency = '';
  }

}
