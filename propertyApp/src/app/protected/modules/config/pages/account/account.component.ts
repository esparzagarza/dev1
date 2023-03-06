import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'

})
export class AccountComponent {

  module: string = 'account';
  modules = environment.modules;

  letsdoitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    appname: ['', []],
    description: ['', []]
  });

  get user() { return this.repository.user; }

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

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void { this.repository.getOneById(this.module, this.user.accountid).subscribe(resp => this.heroe = resp); }

  saveItem() {

    const { name, appname, description } = this.letsdoitForm.value;

    this.heroe.name = name;
    this.heroe.appname = appname;
    this.heroe.description = description;

    this.repository.putItem(this.module, this.heroe).subscribe(resp => {
      if (resp === 200) Swal.fire('Cuenta acualizada', 'success');
      else Swal.fire('Cuenta No actualizada', 'error');
    });
  }

}
