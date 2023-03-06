import { Component, ElementRef, ViewChild } from '@angular/core';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { ITax } from 'src/app/protected/interfaces/itax';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  allData: IContract[] = [];
  allDataByStatus: IContract[] = [];
  allEnte: IEnte[] = [];
  allTax: ITax[] = [];
  resumenEntes: any[] = [];
  module: string = 'sale';
  actualEntes: IEnte[] = [];
  modules = environment.modules;
  selectedStatus: string = 'activo';

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData('ente').subscribe((entes: IEnte[]) => { this.allEnte = entes; });
    this.repository.getAllData('tax').subscribe((resp: ITax[]) => this.allTax = resp);

    this.repository.getAllContracts(this.module).subscribe((IContract: IContract[]) => {
      this.allData = IContract.reverse();
      this.getAllDataByStatus(this.selectedStatus);
    });
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

  searchItem() {
    this.allDataByStatus = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByStatus(this.selectedStatus);
      return;
    }

    if (Number(search)) {
      const tmp: IContract | undefined = this.allData.find(d => d.id == search);
      if (tmp?.id) this.allDataByStatus.push(tmp);
    } else {

      this.allData.forEach(e => {
        if (Array.isArray(e.id === search)
          || Array.isArray(e.ename.toLowerCase().match(search))
          || Array.isArray(e.eemail.toLowerCase().match(search))
          || Array.isArray(e.icode.toLowerCase().match(search))
          || Array.isArray(e.ifulladdress.toLowerCase().match(search))
          || Array.isArray(e.iwatermeter.toLowerCase().match(search))
          || Array.isArray(e.ilightmeter.toLowerCase().match(search))
          || Array.isArray(e.iproperty.toLowerCase().match(search))
          || Array.isArray(e.startdate.toLowerCase().match(search))
          || Array.isArray(e.enddate.toLowerCase().match(search))
        ) this.allDataByStatus.push(e);
      });
    }
  }
}
