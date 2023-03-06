import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IItem } from 'src/app/protected/interfaces/iitem';
import { IProperty } from 'src/app/protected/interfaces/iproperty';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {

  fileName = '';
  allProperty: IProperty[];
  module: string = 'item';
  modules = environment.modules;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }


  heroe: IItem = {
    "id": '',
    "accountid": this.user.accountid,
    "property": 'Sin Asignar',
    "code": '',
    "fulladdress": '',
    "description": '',
    "watermeter": '',
    "lightmeter": '',
    "floors": '1',
    "beds": '',
    "baths": '',
    "landsize": '',
    "constructionsize": '',
    "color": '',
    "price": '0',
    "image": '/assets/img/nofoto.png',
    "type": 'casa',
    "status": 'disponible',
    "created_by": this.user.id,
    "modified_by": this.user.id
  };

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private repository: RepositoryService
  ) {
  }

  ngOnInit(): void {
    this.repository.getAllData('property').subscribe((IProperty: IProperty[]) => this.allProperty = IProperty);

    if (!this.router.url.includes('edit')) { return; }

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.repository.getOneById(this.module, id)))
      .subscribe(resp => this.heroe = resp);
  }

  saveItem() {
    if (!this.heroe.id) this.repository.postItem(this.module, this.heroe).subscribe(resp => { this.router.navigate(['app/administracion-de-inmuebles']); });
    else this.repository.putItem(this.module, this.heroe).subscribe(resp => { this.router.navigate(['app/administracion-de-inmuebles/' + this.heroe.id]); });
  }

  patchItem(key: string) {

    if (this.heroe.id) {

      let value: any;
      if (key == 'status') value = this.heroe.status
      if (key == 'type') value = this.heroe.type
      if (key == 'property') value = this.heroe.property
      const patchPayload = { "id": this.heroe.id, [key]: value, }

      this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
        if (resp === 200) Swal.fire(value.toUpperCase(), 'success');
        else Swal.fire(value.toUpperCase(), 'error');
      });
    }
  }

  deleteItem() {
    this.repository.deleteItem('item', this.heroe.id)
      .subscribe(resp => { this.router.navigate(['app/administracion-de-inmuebles']); });
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
}
