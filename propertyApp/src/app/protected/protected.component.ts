import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { IAccount } from './interfaces/iaccount';
import { RepositoryService } from './repository.service';

@Component({
  selector: 'app-protected',
  templateUrl: 'protected.component.html'
})
export class ProtectedComponent implements OnInit {

  module: string = 'account';
  baseUrl: string = environment.baseUrl;
  allAccount: IAccount = {
    'id': '',
    'email': '',
    'name': '',
    'appname': '',
    'description': '',
    'slug': '',
    "image": '/assets/img/nofoto.png',
    'type': '',
    'status': '',
    'modified_by': '',
    'modified_at': '',
  };

  @ViewChild('closeModalMenu') closeModalMenu: ElementRef;

  get user() { return this.authService.user; }
  get datenow() { return this.repository.datenow; }

  constructor(private router: Router, private authService: AuthService, private repository: RepositoryService) { }

  ngOnInit(): void { this.repository.getOneById(this.module, this.user.accountid).subscribe((IAccount: IAccount) => this.allAccount = IAccount); }

  logout() { this.router.navigateByUrl('/auth'); this.authService.logout(); }

  closeModal() { this.closeModalMenu.nativeElement.click(); }

}
