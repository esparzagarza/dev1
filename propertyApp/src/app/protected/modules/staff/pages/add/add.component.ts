import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IStaff } from 'src/app/protected/interfaces/istaff';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent {

  letsdoitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirm_password: ['', [Validators.required]]
  });

  fileName = '';
  module: string = 'staff';
  modules = environment.modules;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IStaff = {
    'id': '',
    "accountid": this.user.accountid,
    'name': '',
    'api_key': '',
    'email': '',
    'password': '',
    'role': 'desarrollador',
    'lastlogin': '',
    "image": '/assets/img/nofoto.png',
    'status': 'activo',
    "created_by": this.user.id,
    "modified_by": this.user.id
  };

  constructor(private router: Router,
    private repository: RepositoryService,
    private fb: FormBuilder) { }

  ngOnInit(): void { if (!this.router.url.includes('add')) { return; } }

  saveItem() {

    const { name, email, password, confirm_password } = this.letsdoitForm.value;
    const expression: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (expression.test(email)) {

      if (password === confirm_password) {

        this.heroe.name = name;
        this.heroe.email = email;
        this.heroe.password = password;
        this.heroe.role = 'desarrrollador';

        this.repository.postItem(this.module, this.heroe).subscribe(resp => {
          if (resp === 200) { Swal.fire('Usuario creado', 'success'); this.router.navigate(['app/control-de-usuarios']); }
          else Swal.fire('Usuario No creado', 'error');
        });
      } else Swal.fire('Contraseña no coincide', 'intentarlo nuevamente', 'error');
    } else Swal.fire('Correo no valido', 'error')
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
