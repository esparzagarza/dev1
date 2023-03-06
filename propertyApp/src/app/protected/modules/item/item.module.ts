import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddComponent } from './pages/add/add.component';
import { HeroeComponent } from './pages/heroe/heroe.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AddComponent,
    HeroeComponent,
    HomeComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
      children: [
        { path: '', component: ListComponent },
        { path: 'add', component: AddComponent },
        { path: ':id/edit', component: AddComponent },
        { path: ':id', component: HeroeComponent },
        { path: '**', redirectTo: '' }
      ]
    }]),
  ]
})
export class ItemModule { }
