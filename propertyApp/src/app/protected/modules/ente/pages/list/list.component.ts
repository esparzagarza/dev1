import { Component, ElementRef, ViewChild } from '@angular/core';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  module: string = 'ente';
  allData: IEnte[] = [];
  allDataByStatus: IEnte[] = [];
  modules = environment.modules;
  selectedStatus: string = 'activo';

  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData(this.module).subscribe((resp: IEnte[]) => {
      this.allData = resp;
      this.getAllDataByStatus(this.selectedStatus);
    });
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

  searchItem() {
    this.selectedStatus = '';
    this.allDataByStatus = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByStatus(this.selectedStatus);
      return;
    }

    this.allData.forEach(e => {
      if (Array.isArray(e.id === search)
        || Array.isArray(e.name.toLowerCase().match(search))
        || Array.isArray(e.email.toLowerCase().match(search))
        || Array.isArray(e.phone.toLowerCase().match(search))
        || Array.isArray(e.created_at?.toLowerCase().match(search))
      ) this.allDataByStatus.push(e);
    });
  }

}
