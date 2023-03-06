import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from "./pages/add/add.component";
import { SearchComponent } from "./pages/search/search.component";
import { HeroeComponent } from "./pages/heroe/heroe.component";
import { HomeComponent } from "./pages/home/home.component";
import { ListComponent } from "./pages/list/list.component";


const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: '', component: ListComponent },
      { path: 'add', component: AddComponent },
      { path: 'search', component: SearchComponent },
      { path: ':id', component: HeroeComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StaffRoutingModule { }
