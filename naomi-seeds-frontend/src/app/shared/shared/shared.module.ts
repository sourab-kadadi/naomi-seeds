import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from '../../constants/system.const';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from '../../module/image-upload/image-upload.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { YesNoPipe } from 'src/app/shared/pipes/yes-no.pipe';


@NgModule({
  declarations: [YesNoPipe],
  imports: [
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ReactiveFormsModule,
    ImageUploadModule,
    NgxPermissionsModule.forRoot()
  ],
  exports: [
    NgxUiLoaderModule,
    ReactiveFormsModule,
    ImageUploadModule,
    NgxPermissionsModule,
    YesNoPipe
  ]
})
export class SharedModule { }
