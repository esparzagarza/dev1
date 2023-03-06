import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { RentsComponent } from './pages/rents/rents.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeroeComponent,
    RentsComponent,
    ContractsComponent,
    PaymentsComponent,
    ExpensesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class ItemReportModule { }
