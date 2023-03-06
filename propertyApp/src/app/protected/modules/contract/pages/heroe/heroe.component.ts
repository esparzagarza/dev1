import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IAccount } from 'src/app/protected/interfaces/iaccount';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IZConfig } from 'src/app/protected/interfaces/izconfig';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent {

  module = 'sale';
  aclicked = false;
  eclicked = false;
  today: Date = new Date();
  modules = environment.modules;

  allAccount: IAccount;
  allZConfig: IZConfig;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  heroe: IContract;

  constructor(private activatedRoute: ActivatedRoute, private repository: RepositoryService) { }

  ngOnInit(): void {

    this.repository.getOneById('account', this.user.accountid).subscribe((IAccount: IAccount) => this.allAccount = IAccount);
    this.repository.getOneById('zconfig', this.user.accountid).subscribe((IZConfig: IZConfig) => this.allZConfig = IZConfig);

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getContract(this.module, id)))
      .subscribe((IContract: IContract) => this.heroe = IContract);
  }

  actionMethod(flag: boolean, email: string) {
    flag ? this.aclicked = true : this.eclicked = true;
    const payload: {} = { id: this.heroe.id, email: email }
    this.repository.sendEmail(payload).subscribe(resp => { Swal.fire('Correo Enviado', 'success'); });
  }

}
