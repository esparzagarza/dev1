import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RepositoryService } from 'src/app/protected/repository.service';
import { IItem } from 'src/app/protected/interfaces/iitem';
import { environment } from 'src/environments/environment';
import { IProperty } from 'src/app/protected/interfaces/iproperty';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

  module: string = 'item';
  allProperty: IProperty[] = [];
  allItem: IItem[] = [];
  allFilteredItem: IItem[] = [];
  allViewFilteredItem: IItem[] = [];
  modules = environment.modules;
  selectedStatus: string = 'activa';
  selectedType: string = '';
  selectedProperty: string = '';

  @ViewChild('txtSearchItem') txtSearchItem!: ElementRef<HTMLInputElement>;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllData('property').subscribe((IProperty: IProperty[]) => this.allProperty = IProperty);
    this.repository.getAllData(this.module).subscribe((resp: IItem[]) => {
      this.allItem = resp.reverse();
      this.allFilteredItem = this.allItem;
      this.getAllDataByFilters(this.selectedProperty, this.selectedType, this.selectedStatus);
    });
  }

  getAllDataByFilters(property: string = '', type: string = '', status: string = '') {
    this.selectedProperty = property;
    this.selectedType = type;
    this.selectedStatus = status;
    this.allViewFilteredItem = this.allFilteredItem;

    if (this.selectedProperty) this.allViewFilteredItem = this.allViewFilteredItem.filter(f => f.property === this.selectedProperty);
    if (this.selectedType) this.allViewFilteredItem = this.allViewFilteredItem.filter(f => f.type === this.selectedType);
    if (this.selectedStatus) this.allViewFilteredItem = this.allViewFilteredItem.filter(f => f.status === this.selectedStatus);
  }


  searchItem() {

    this.emptySelecteds();
    this.allViewFilteredItem = [];
    const search = this.txtSearchItem.nativeElement.value.toLowerCase();
    this.txtSearchItem.nativeElement.value = '';

    if (search.trim().length === 0) {
      this.getAllDataByFilters(this.selectedProperty, this.selectedType, this.selectedStatus);
      return;
    }

    this.allFilteredItem.forEach(i => {
      if (Array.isArray(i.id === search)
        || Array.isArray(i.code.toLowerCase().match(search))
        || Array.isArray(i.watermeter.toLowerCase().match(search))
        || Array.isArray(i.lightmeter.toLowerCase().match(search))
        || Array.isArray(i.fulladdress.toLowerCase().match(search))
        || Array.isArray(i.created_at?.toLowerCase().match(search))
      ) this.allViewFilteredItem.push(i);
    });
  }

  emptySelecteds() {
    this.selectedProperty = '';
    this.selectedType = '';
    this.selectedStatus = 'activa';
  }

}
