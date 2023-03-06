import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IContract } from 'src/app/protected/interfaces/icontract';
import { IItem } from 'src/app/protected/interfaces/iitem';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { ISale } from 'src/app/protected/interfaces/isale';
import { RepositoryService } from 'src/app/protected/repository.service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styles: [`
    img {
      width: 400;
      border-radius: 5px;
    }
  `]
})
export class HeroeComponent implements OnInit {

  module: string = 'item';
  allPayment: IPayment[] = [];
  allContract: IContract[] = [];

  get baseUrl() { return this.repository.baseUrl; }

  heroe: IItem = {
    "id": '',
    "accountid": '',
    "property": 'sin asignar',
    "code": '',
    "fulladdress": '',
    "description": '',
    "watermeter": '',
    "lightmeter": '',
    "floors": '',
    "beds": '',
    "baths": '',
    "landsize": '',
    "constructionsize": '',
    "color": '',
    "price": '',
    "image": '/assets/img/nofoto.png',
    "type": '',
    "status": '',
    "created_by": '',
    "modified_by": ''
  };

  constructor(private activatedRoute: ActivatedRoute, private repository: RepositoryService) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))
      .subscribe((IItem: IItem) => {
        if (IItem.id) {
          this.heroe = IItem
          this.repository.getAllContracts('sale').subscribe((IContract: IContract[]) => {
            if (IContract.length > 0) this.allContract = IContract.reverse().filter(c => c.itemid == IItem.id);
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
