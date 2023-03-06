import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from 'src/app/protected/interfaces/icategory';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent {

  fileName = '';
  module: string = 'category';
  allData: ICategory[] = [];
  allDataByStatus: ICategory[] = [];
  modules = environment.modules;
  selectedStatus: string = 'activo';

  heroe: ICategory = this.resetHeroe();
  shorForm: boolean = false;

  letsdoitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', []],
    status: ['', [Validators.required]]
  });

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void { this.reload(); }

  reload() {
    this.repository.getAllData(this.module).subscribe((resp: ICategory[]) => {
      this.allData = resp.reverse()
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
      'description': '',
      "image": '/assets/img/nofoto.png',
      'status': 'activo',
      'created_by': this.user.id,
      'modified_by': this.user.id
    }
  }

  selectHeroe(heroe: ICategory) { this.heroe = heroe; this.shorForm = true; }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;
      const formData = new FormData();

      formData.append("id", this.heroe.id);
      formData.append("module", this.module);
      formData.append("file", file);

      this.repository.uploadFile(formData).subscribe(resp => this.heroe.image = '/' + resp);
    }
  }

  saveItem() {

    const { name, description, status } = this.letsdoitForm.value;

    this.heroe.name = name;
    this.heroe.description = description;
    this.heroe.status = status;

    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => this.reload());
    else this.repository.putItem(this.module, this.heroe).subscribe();

    this.resetForm(false);
  }
}
