import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';
import { IPayment } from '../../../../interfaces/ipayment';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent {

  module: string = 'ente';
  allPayment: IPayment[] = [];
  allContract: IContract[] = [];

  get baseUrl() { return this.repository.baseUrl; }

  heroe: IEnte = {
    'id': '',
    "accountid": '',
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
    'status': '',
    "created_by": '',
    "modified_by": ''
  };

  constructor(private activatedRoute: ActivatedRoute, private repository: RepositoryService) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))
      .subscribe((IEnte: IEnte) => {
        if (IEnte.id) {
          this.heroe = IEnte
          this.repository.getAllContracts('sale').subscribe((IContract: IContract[]) => {
            if (IContract.length > 0) this.allContract = IContract.reverse().filter(c => c.enteid == IEnte.id);
            if (this.allContract.length > 0) {
              let sales: string[] = [];
              this.allContract.forEach(c => sales.push(c.id));
              if (sales.length > 0) {
                this.repository.getAllPayments('payment').subscribe((IPayment: IPayment[]) => {
                  if (IPayment.length > 0) this.allPayment = IPayment.reverse().filter(c => sales.includes(c.saleid));
                });
              }
            }
          });
        }
      });
  }
}
