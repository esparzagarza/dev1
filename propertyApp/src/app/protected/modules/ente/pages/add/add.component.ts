import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent {

  fileName = '';
  module: string = 'ente';
  modules = environment.modules;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IEnte = {
    'id': '',
    "accountid": this.user.accountid,
    'name': '',
    'gender': '',
    'nationality': '',
    'doctype': '',
    'docnumber': '',
    'dob': '',
    'dni': '',
    'fiscalname': '',
    'fulladdress': '',
    'email': '',
    'phone': '',
    "image": '/assets/img/nofoto.png',
    'status': 'activo',
    "created_by": this.user.id,
    "modified_by": this.user.id
  };

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private repository: RepositoryService
  ) {
  }

  ngOnInit(): void {

    if (!this.router.url.includes('edit')) { return; }

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))

      .subscribe(resp => this.heroe = resp);
  }

  saveItem() {
    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => { this.router.navigate(['app/administracion-de-inquilinos']); });
    else this.repository.putItem(this.module, this.heroe).subscribe(resp => { this.router.navigate(['app/administracion-de-inquilinos/' + this.heroe.id]); });
  }

  patchItem(key: string) {

    if (this.heroe.id) {

      let value: any;
      if (key == 'status') value = this.heroe.status
      const patchPayload = { "id": this.heroe.id, [key]: value, }

      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire(value.toUpperCase(), resp, 'success');
        else Swal.fire(value.toUpperCase(), 'error');
      });
    }
  }

  deleteItem() {
    this.repository.deleteItem(this.module, this.heroe.id)
      .subscribe(resp => { this.router.navigate(['app/administracion-de-inquilinos']); });
  }

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

}
