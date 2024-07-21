import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment';
import { HttpEventType } from '@angular/common/http';
// import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  @Input() text: any = 'Upload Product Picture';
  @Input() icon: any = 'account_circle';
  @Input() imageData: any;
  @Input() width: any = "150px";
  @Input() height: any = "150px";

  // mode: ProgressBarMode = 'buffer';

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  value = 0;
  bufferValue = 100;
  progressBarVisible = false;


  s3path: any = environment.s3Url;

  constructor(public uploadFile: UploadService) { }

  ngOnInit(): void {
  }

  deleteFile() {
    this.imageData = null;
    this.onSave.emit({data: this.imageData});
  }


  async uploadFileToS3(event: any) {
    this.value = 0;
    this.progressBarVisible = true;
   let file = event.target.files[0];
   let presignedUrl: any = await this.uploadFile.getS3Url().toPromise();
   console.log(presignedUrl);
   this.uploadFile.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
        if (data.type === HttpEventType.Response) {
            console.log('Upload complete', data);
            this.progressBarVisible = false;
            this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
            this.onSave.emit({data: this.imageData});
            console.log(this.imageData);
        }
        if (data.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * data.loaded / data.total);
            this.value = percentDone;
            console.log('Progress ' + percentDone + '%');
        }
   });
  }


}
