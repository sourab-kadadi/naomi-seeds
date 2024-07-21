import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { ProductsCategoryService } from '../service/products-category.service';
import { ProductService } from 'src/app/product/service/product.service';


@Component({
  selector: 'app-add-edit-products-category',
  templateUrl: './add-edit-products-category.page.html',
  styleUrls: ['./add-edit-products-category.page.scss'],
})
export class AddEditProductsCategoryPage implements OnInit {

  productCategoryId: any;

  productCategoryImage: any;
  productCategoryForm: any = this.formBuilder.group({
    cropName: ['', [Validators.required]],
    cropType: ['', [Validators.required]],
  });

  s3path: any = environment.s3Url;
  mode: 'create' | 'update' = 'create';

  constructor(
    private productService: ProductService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: UntypedFormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private productsCategoryService: ProductsCategoryService

  ) {
    this.mode = this.route.snapshot.data.mode || 'create';
    this.productCategoryId = this.route.snapshot.paramMap.get('productCategoryId');
  }

  ngOnInit() {

    if (this.mode === 'update') {
      this.ngxUiLoader.startLoader("loader-product-category-add-edit");
      this.productsCategoryService.getProductCategoryById(this.productCategoryId).subscribe({
        next: (res) => {
          this.productCategoryForm.patchValue({
            cropName: res.data.cropName,
            cropType: res.data.cropType,
          });
          this.productCategoryImage = res.data.image;
          console.log(this.productCategoryImage)
          this.ngxUiLoader.stopLoader("loader-product-category-add-edit");
          // this.isLoading = false;
          // this.serverError = false;      
          console.log(res);
        },
        error: (e) => {
          this.ngxUiLoader.stopLoader("loader-product-category-add-edit");
          // this.isLoading = false;
          // this.isInitial = false;
          this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
          if (e.statusCode && e.statusCode === 401) {
            // this.presentAlert('Unauthorized, please enter valid email and password');
          } else {
            // this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
          }
        },
        // complete: () => this.menuContentDisplay()
      })
    }

  }

  ionViewWillEnter() {

    // this.rolesAndPermissionsForm.reset();
    // this.permissionsData;
    // console.log(this.rolesAndPermissionsForm.value.products)
    // console.log(this.rolesAndPermissionsForm.value)

    // console.log('roles', this.permissionsData)

    // console.log(true, this.permissionsData.products.CAN_CREATE)


  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  // get errorControl() {
  //   return this.rolesAndPermissionsForm.controls;
  // }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async onCreateProductCategory() {
    // this.isActive = false;
    if (!this.productCategoryForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    } else {
      let dataProductCategory = this.productCategoryForm.value;
      if (this.productCategoryImage) {
        dataProductCategory["image"] = this.productCategoryImage
      }
      this.ngxUiLoader.startLoader("loader-product-category-add-edit");
      this.productsCategoryService.createProductCategory(dataProductCategory).subscribe({
        next: (res) => {
          this.ngxUiLoader.stopLoader('loader-product-category-add-edit');
          this.presentToast(MessageLib.DATA_ADD);
          if (res && res.status) {
            this.router.navigate(['/app/products-category']);
          }
        },
        error: (e) => {
          //   // this.isActive = true;
          // this.active = true;
          this.ngxUiLoader.stopLoader("loader-product-category-add-edit");
          this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        },
        complete: () => {
        }
      });
    }
  }



  async onProductsCategoryById() {
    if (!this.productCategoryForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    } else {
      let dataProductCategory = this.productCategoryForm.value;
      if (this.productCategoryImage) {
        dataProductCategory["image"] = this.productCategoryImage
      }
      this.ngxUiLoader.startLoader("loader-product-category-add-edit");
      // this.isActive = false;
      this.productsCategoryService.updateProductCategoryById(this.productCategoryId, dataProductCategory).subscribe({
        next: (res) => {
          this.ngxUiLoader.stopLoader('loader-product-category-add-edit');
          if (res && res.status) {
            this.router.navigate(['/app/products-category']);
          }
          this.presentToast(MessageLib.DATA_ADD);
        },
        error: (e) => {
          //   // this.isActive = true;
          // this.active = true;
          this.ngxUiLoader.stopLoader("loader-product-category-add-edit");
          this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        },
        complete: () => {
        }
      });
    }
  }



  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK']
    });
    await alert.present();
  }





  async save() {
    if (this.mode === 'create') {
      this.onCreateProductCategory();
    } else if (this.mode === 'update') {
      this.onProductsCategoryById();
    }
  }


  async productCategoryImageData(event) {
    this.productCategoryImage = { filePath: event.data.filePath, type: event.data.type }
  }

}


