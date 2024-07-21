import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from './service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(public server: HttpServerService) { }


  generatePdf(): Observable<any> {
    let url = `${EndPointConst.GEN_TEST_PDF}`;
    return this.server.get(url, {});
  }



}
