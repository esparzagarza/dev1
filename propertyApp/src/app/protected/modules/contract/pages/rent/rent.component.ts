import { Component, Input, OnInit } from '@angular/core';
import { IRent } from 'src/app/protected/interfaces/irent';
import { RepositoryService } from 'src/app/protected/repository.service';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html'
})
export class RentComponent implements OnInit {

  module: string = 'rent';
  allRent: IRent[] = [];

  @Input() saleid: string;

  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  ngOnInit(): void {
    this.repository.getAllRents(this.module).subscribe((IRent: IRent[]) => this.allRent = IRent.reverse().filter(p => p.saleid == this.saleid));
  }
}
