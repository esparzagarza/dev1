import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICurrency } from 'src/app/protected/interfaces/icurrency';
import { ITax } from 'src/app/protected/interfaces/itax';
import { IZConfig } from 'src/app/protected/interfaces/izconfig';
import { RepositoryService } from 'src/app/protected/repository.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html'
})
export class SystemComponent {

  module: string = 'zconfig';

  allTax: ITax[] = [];
  allData: IZConfig[] = [];
  allCurrency: ICurrency[] = [];

  heroe: IZConfig = {
    'id': '',
    'accountid': this.user.accountid,
    'currencyid': '1',
    'taxid': '1',
    'smtpfromname': '',
    'smtpfromemail': '',
    'smtpfrompassword': '',
    'smtptoname': '',
    'smtptoemail': '',
    'smtptomensaje': '',
    'created_by': this.user.id,
    'modified_by': this.user.id
  };

  letsdoitForm: FormGroup = this.fb.group({
    currencyid: ['', [Validators.required]],
    taxid: ['', [Validators.required]],
    smtpfromname: ['', [Validators.required]],
    smtpfromemail: ['', [Validators.required]],
    smtpfrompassword: ['', []],
    smtptoname: ['', [Validators.required]],
    smtptoemail: ['', [Validators.required]],
    smtptomensaje: ['', [Validators.required]]
  });

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.repository.getOneById(this.module, this.user.accountid).subscribe((IZConfig: IZConfig) => { this.heroe = IZConfig; });
    this.repository.getAllData('tax').subscribe((ITax: ITax[]) => { this.allTax = ITax });
    this.repository.getAllData('currency').subscribe((ICurrency: ICurrency[]) => { this.allCurrency = ICurrency });
  }

  saveItem() {

    const { currencyid, taxid, smtpfromname, smtpfromemail, smtpfrompassword, smtptoname, smtptoemail, smtptomensaje } = this.letsdoitForm.value;

    const payloadZConfig = {
      'id': this.heroe.id,
      'currencyid': currencyid,
      'taxid': taxid,
      'smtpfromname': smtpfromname,
      'smtpfromemail': smtpfromemail,
      'smtpfrompassword': smtpfrompassword,
      'smtptoname': smtptoname,
      'smtptoemail': smtptoemail,
      'smtptomensaje': smtptomensaje,
      'modified_by': this.user.id
    }

    this.repository.putItem(this.module, payloadZConfig).subscribe(resp => {
      if (resp === 200) {
        Swal.fire('Cuenta acualizada', 'success');
        const ele: any = document.getElementById("smtpfrompassword");
        if (ele.value != "") ele.value = "";
      }
      else Swal.fire('Cuenta No actualizada', 'error');
    });

  }

}
