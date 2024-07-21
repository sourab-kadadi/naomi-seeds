import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpWithoutInterceptorService } from './http-without-interceptor.service';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from './../service/http-server.service';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(public server: HttpServerService, public noInterceptServer: HttpWithoutInterceptorService) {}

  getS3Url(): Observable<any> {
    return this.server.get(EndPointConst.GET_PRESIGNED_S3_URL, {});
  }


  // getSalesOrderById(): Observable<any> {
  //   return  this.server.get(`${EndPointConst.GET_IPT_BY_ID}/${_id}`, {});
  // }


  uploadS3(file: File, url: any, fields: any): Observable<any> {
    let s3uploadObj = {
      ...fields,
      "Content-Type": file.type,
      file: file,
      "ACL": "public-read"
    };
    const formData = new FormData();
    for (const uploadData in s3uploadObj) {
      formData.append(uploadData, s3uploadObj[uploadData]);
    }
    return this.noInterceptServer.post(url, formData, { reportProgress: true, observe: "events" });
  }
}
