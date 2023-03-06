import { Component, Input } from '@angular/core';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IEnte } from 'src/app/protected/interfaces/iente';
import { RepositoryService } from 'src/app/protected/repository.service';
import { IPayment } from '../../../../interfaces/ipayment';

@Component({
  selector: 'app-ente',
  templateUrl: './ente.component.html'
})
export class EnteComponent {

  module: string = 'ente';
  allPayment: IPayment[] = [];
  allContract: IContract[] = [];

  @Input() enteid: string;

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

  get baseUrl() { return this.repository.baseUrl; }


  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getOneById(this.module, this.enteid)
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
