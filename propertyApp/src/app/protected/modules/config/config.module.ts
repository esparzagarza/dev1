import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { CategoryComponent } from './pages/category/category.component';
import { CurrencyComponent } from './pages/currency/currency.component';
import { PropertyComponent } from './pages/property/property.component';
import { RouterModule } from '@angular/router';
import { SystemComponent } from './pages/system/system.component';
import { TaxComponent } from './pages/tax/tax.component';



@NgModule({
  declarations: [
    HomeComponent,
    AccountComponent,
    CategoryComponent,
    CurrencyComponent,
    PropertyComponent,
    SystemComponent,
    TaxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }])
  ]
})
export class ConfigModule { }
