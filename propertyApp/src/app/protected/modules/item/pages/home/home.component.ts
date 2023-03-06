import { Component } from '@angular/core';
import { RepositoryService } from 'src/app/protected/repository.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  get datenow() { return this.repository.datenow; }
  constructor(private repository: RepositoryService) { }
}
