import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { ICategory } from 'src/app/protected/interfaces/icategory';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent {

  module: string = 'expense';
  modules = environment.modules;

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

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => this.allCurrency = ICurrency);
    this.repository.getAllData('category').subscribe((ICategory: ICategory[]) => this.allCategory = ICategory);

    this.repository.getAllData(this.module).subscribe((IExpense: IExpense[]) => {
      this.allExpense = IExpense.reverse();
      this.allFilteredExpense = this.allExpense;
      this.getAllDataByFilters(this.selectedStatus, this.selectedCategory, this.selectedCurrency);
    });
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

  emptySelecteds() {
    this.selectedStatus = 'activo';
    this.selectedCategory = '';
    this.selectedCurrency = '';
  }

}
