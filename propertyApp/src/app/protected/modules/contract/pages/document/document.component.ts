import { Component, Input, OnInit } from '@angular/core';
import { IDocument } from 'src/app/protected/interfaces/idocument';
import { RepositoryService } from 'src/app/protected/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnInit {

  clicked: boolean = true;
  fileName = '';
  error: string = '';
  module: string = 'document';
  modules = environment.modules;
  allDocument: IDocument[] = []

  @Input() saleid: string;

  heroe: IDocument;

  get user() { return this.repository.user; }
  get baseUrl() { return this.repository.baseUrl; }

  constructor(private repository: RepositoryService) { }

  refreshHeroe() {
    this.error = '';
    this.clicked = true;
    return {
      'id': '',
      'accountid': this.user.accountid,
      'saleid': '',
      'dname': '',
      'description': '',
      'image': '',
      'status': 'activo',
      'created_by': this.user.id,
      'created_at': '',
      'modified_by': this.user.id,
      'modified_at': '',
    }
  }

  ngOnInit(): void {
    this.reload();
  }
  reload() {
    this.heroe = this.refreshHeroe();
    this.heroe.saleid = this.saleid;
    this.repository.getAllData(this.module).subscribe((IDocument: IDocument[]) => this.allDocument = IDocument.filter(d => (d.status == 'activo' && d.saleid == this.saleid)));
  }

  saveItem() { this.repository.postItem(this.module, this.heroe).subscribe(resp => { this.reload(); }); }

  patchItem(id: string) {
    const patchPayload = { "id": id, 'status': 'inactivo', }

    this.repository.patchItem(this.module, patchPayload).subscribe(resp => {
      if (resp === 200) Swal.fire('Status', 'success');
      else Swal.fire('Status', 'error');
    });
  }

  onFileSelected(event: any) {

    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;
      const formData = new FormData();

      formData.append("id", this.heroe.id);
      formData.append("module", this.module);
      formData.append("file", file);

      this.repository.uploadFile(formData).subscribe(resp => {
        if (resp.status == 401) {
          this.clicked = true;
          this.error = resp.message;
        } else {
          this.clicked = false;
          this.error = 'Archivo preparado';
          this.heroe.image = '/' + resp;
        }
      });
    }
  }
}
