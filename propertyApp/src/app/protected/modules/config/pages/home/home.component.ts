import { Component } from '@angular/core';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  fileName = '';
  module: string = 'account';
  modules = environment.modules;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IAccount = {
    'id': '',
    'email': '',
    'name': '',
    'appname': '',
    'description': '',
    'slug': '',
    "image": '/assets/img/nofoto.png',
    'type': '',
    'status': '',
    'modified_by': '',
    'modified_at': '',
  };

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void { this.repository.getOneById(this.module, this.user.accountid).subscribe(resp => this.heroe = resp); }

  patchItem(key: string) {

    if (this.heroe.id) {

      let value: any;
      if (key == 'type') value = this.heroe.type;
      if (key == 'status') value = this.heroe.status;
      const patchPayload = { "id": this.heroe.id, [key]: value, }

      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire(value.toUpperCase(), 'success');
        else Swal.fire(value.toUpperCase(), 'error');
      });
    }
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

  letsdoitEmail() {

    const email = 'this.letsdoitEmailForm.value';
    const expression: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (expression.test(email)) {
      const patchPayload = { "id": this.heroe.id, 'email': email, };
      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire('Correo Actualizado', resp, 'success');
        else Swal.fire('Correo No actualizado', 'error');
      });
    } else Swal.fire('Correo no valido', 'error')

  }
}
