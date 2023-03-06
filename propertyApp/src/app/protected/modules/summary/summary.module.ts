import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, AdminComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: AdminComponent },
      ]
    }]),
  ]
})
export class SummaryModule { }
