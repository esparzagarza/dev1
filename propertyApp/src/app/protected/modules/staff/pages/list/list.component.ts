import { Component } from '@angular/core';
import { IStaff } from 'src/app/protected/interfaces/istaff';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  allData: IStaff[] = [];
  allDataByStatus: IStaff[] = [];
  module: string = 'staff';
  modules = environment.modules;
  selectedStatus: string = 'activo';


  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData(this.module).subscribe(resp => {
      this.allData = resp.reverse();
      this.getAllDataByStatus(this.selectedStatus);
    });
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

}
