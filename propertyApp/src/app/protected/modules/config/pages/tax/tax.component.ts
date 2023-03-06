import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITax } from 'src/app/protected/interfaces/itax';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html'

})
export class TaxComponent {

  module: string = 'tax';
  allData: ITax[] = [];
  allDataByStatus: ITax[] = [];
  modules = environment.modules;
  selectedStatus: string = 'activo';


  heroe: ITax = this.resetHeroe();
  shorForm: boolean = false;

  letsdoitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    status: ['', [Validators.required]]
  });

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void { this.reload(); }

  reload() {
    this.repository.getAllData(this.module).subscribe((resp: ITax[]) => {
      this.allData = resp.reverse();
      this.getAllDataByStatus(this.selectedStatus);

    });
  }

  getAllDataByStatus(newStatus: any = '') {
    this.selectedStatus = newStatus;
    this.allDataByStatus = newStatus === '' ? this.allData : this.allData.filter(f => f.status === this.selectedStatus);
  }

  resetForm(flag: boolean) {
    this.heroe = this.resetHeroe();
    this.shorForm = flag;
  }

  resetHeroe() {
        return {
      'id': '',
      'accountid': this.user.accountid,
      'name': '',
      'amount': 0,
      'status': 'activo',
      'created_by': this.user.id,
      'modified_by': this.user.id
    }
  }

  selectHeroe(heroe: ITax) { this.heroe = heroe; this.shorForm = true; }

  saveItem() {

    const { name, amount, status } = this.letsdoitForm.value;

    this.heroe.name = name;
    this.heroe.amount = amount;
    this.heroe.status = status;

    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => this.reload());
    else this.repository.putItem(this.module, this.heroe).subscribe();

    this.resetForm(false);
  }

}
