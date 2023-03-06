import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './pages/list/list.component';
import { AddComponent } from './pages/add/add.component';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnteComponent } from './pages/ente/ente.component';
import { ItemComponent } from './pages/item/item.component';
import { HomeComponent } from './pages/home/home.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { EditComponent } from './pages/edit/edit.component';
import { RentComponent } from './pages/rent/rent.component';
import { DocumentComponent } from './pages/document/document.component';

@NgModule({
  declarations: [
    AddComponent,
    HeroeComponent,
    ListComponent,
    EnteComponent,
    ItemComponent,
    HomeComponent,
    PaymentComponent,
    RentComponent,
    ExpenseComponent,
    EditComponent,
    DocumentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: ListComponent },
        { path: 'add', component: AddComponent },
        { path: ':id/edit', component: EditComponent },
        { path: ':id', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class ContractModule { }
