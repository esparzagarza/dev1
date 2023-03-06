import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { Routing } from './modules/routing';
import { ProtectedComponent } from './protected.component';

const routes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    ProtectedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class ProtectedModule { }
