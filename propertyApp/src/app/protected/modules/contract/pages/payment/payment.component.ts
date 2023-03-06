import { Component, Input, OnInit } from '@angular/core';
import { IPayment } from 'src/app/protected/interfaces/ipayment';
import { RepositoryService } from 'src/app/protected/repository.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {

  module: string = 'payment';
  allPayment: IPayment[] = [];

  @Input() saleid: string;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllPayments(this.module).subscribe((IPayment: IPayment[]) => this.allPayment = IPayment.reverse().filter(p => p.saleid == this.saleid));
  }
}
