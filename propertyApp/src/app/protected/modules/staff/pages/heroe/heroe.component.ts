import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IStaff } from '../../../../interfaces/istaff';


@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'

})
export class HeroeComponent {

  @ViewChild('resetInput') resetInput: ElementRef;

  letsdoitNameForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });

  letsdoitEmailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  letsdoitResetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    confirm_password: ['', [Validators.required]],
  });

  fileName = '';
  allHistorySale: ISale[] = [];
  allHistoryPayment: IPayment[] = [];
  allHistoryEnte: IEnte[] = [];
  module: string = 'staff';
  modules = environment.modules;

  get baseUrl() { return this.repository.baseUrl; }

  heroe: IStaff = {
    'id': '',
    'accountid': '',
    'name': '',
    'api_key': '',
    'email': '',
    'password': '',
    'role': '',
    'lastlogin': '',
    "image": '/assets/img/nofoto.png',
    'status': '',
    'created_by': '',
    'created_at': '',
    'modified_by': '',
    'modified_at': '',
  };

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private repository: RepositoryService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))
      .subscribe(resp => {

        if (resp.id) {

          this.heroe = resp;

          this.repository.getListByColumn('sale', 'created_by', resp.id).subscribe(result => this.allHistorySale = result.reverse());
          this.repository.getListByColumn('payment', 'created_by', resp.id).subscribe(result => this.allHistoryPayment = result.reverse());
          this.repository.getListByColumn('ente', 'created_by', resp.id).subscribe(result => this.allHistoryEnte = result.reverse());
        }
      });
  }

  patchItem(key: string) {

    if (this.heroe.id) {

      let value: any;
      if (key == 'status') value = this.heroe.status
      if (key == 'role') value = this.heroe.role
      const patchPayload = { "id": this.heroe.id, [key]: value, }

      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire(value.toUpperCase(), resp, 'success');
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

  letsdoitName() {

    const { name } = this.letsdoitNameForm.value;

    const patchPayload = { "id": this.heroe.id, ['name']: name, }

    this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
      if (resp === 200) Swal.fire(name, resp, 'success');
      else Swal.fire(name, 'error');
    });

    this.resetInput.nativeElement.click()

  }

  letsdoitEmail() {

    const { email } = this.letsdoitEmailForm.value;
    const expression: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (expression.test(email)) {
      const patchPayload = { "id": this.heroe.id, 'email': email, };
      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire('Correo Actualizado', resp, 'success');
        else Swal.fire('Correo No actualizado', 'error');
      });
    } else Swal.fire('Correo no valido', 'error')

    this.resetInput.nativeElement.click()
  }

  letsdoitReset() {

    const { password, confirm_password } = this.letsdoitResetForm.value;

    if (password === confirm_password) {
      const patchPayload = { "id": this.heroe.id, 'password': password, };
      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire('Contraseña Actualizada', resp, 'success');
        else Swal.fire('Contraseña No actualizada', 'error');
      });
    } else Swal.fire('Contraseña no coincide', 'intentarlo nuevamente', 'error');

    this.resetInput.nativeElement.click();
  }
}
