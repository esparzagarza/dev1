import { Component, Input, OnInit } from '@angular/core';
import { IExpense } from 'src/app/protected/interfaces/iexpense';
import { RepositoryService } from 'src/app/protected/repository.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html'
})
export class ExpenseComponent implements OnInit {

  module: string = 'expense';
  allExpense: IExpense[] = [];

  @Input() saleid: string;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData(this.module).subscribe((IExpense: IExpense[]) => this.allExpense = IExpense.reverse().filter(e => e.saleid == this.saleid));
  }
}
