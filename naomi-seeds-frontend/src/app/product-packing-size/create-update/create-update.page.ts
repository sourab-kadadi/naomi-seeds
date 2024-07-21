import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, ProfileRole, Role } from '../../constants/system.const';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { GeneralDropdownsService } from 'src/app/service/general-dropdowns.service';
import { UsersManagementService } from 'src/app/users-management/service/users-management.service';
import { ProductPackingSizeService } from '../service/product-packing-size.service';
import { PermissionsDataBehaviourSubjectService } from '../../service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ProductService } from 'src/app/product/service/product.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.productPackingSize;
  combinedPermissionsDataArray: any[] = []

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;


  products: any[] = [];
  product: any;
  productId: any;


  productPackingSizeId: any;

  mode: 'create' | 'update' = 'create';

  productPackingSizeForm: any = this.formBuilder.group({
    productId: ['', [Validators.required]],
    packingQty: ['', [Validators.required]],
    packingUnit: ['', [Validators.required]],
    effectiveRatePerKg: ['', [Validators.required]],
    packetInvoicePrice: ['', [Validators.required]],
    packetMRPPrice: [''],
    lockedForEditingExceptAdmin: [true],
    status: [true],
  })

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: UntypedFormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    private generalDropdownsService: GeneralDropdownsService,
    public alertController: AlertController,
    private ngxPermissionsService: NgxPermissionsService,
    private route: ActivatedRoute,
    private productPackingSizeService: ProductPackingSizeService,
    private userManagementService: UsersManagementService,
    private productService: ProductService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
  ) {
    this.mode = this.route.snapshot.data.mode || 'create';
    this.productPackingSizeId = this.route.snapshot.paramMap.get('productPackingSizeId');

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    })
  }
  
  ngOnInit() {
    console.log(this.mode)
    this.getAllProductsAllDropDown();
    if (this.mode === 'update') {
      this.active = false;
      this.ngxUiLoader.startLoader("loader-product-packing-size-create-update");
      this.productPackingSizeService.getProductPackingSizeById(this.productPackingSizeId).subscribe({
        next: (res) => {
          console.log(res)
          this.productPackingSizeForm.patchValue({
            productId: res.data.productId,
            packingQty: res.data.packingQty,
            packingUnit: res.data.packingUnit,
            effectiveRatePerKg: res.data.effectiveRatePerKg,
            packetInvoicePrice: res.data.packetInvoicePrice,
            packetMRPPrice: res.data.packetMRPPrice,
            lockedForEditingExceptAdmin: res.data.lockedForEditingExceptAdmin,
            status: res.data.status
          });

          // const productMatched = this.products.find(obj => obj.id === this.productId);
          const productMatched = this.products.find(obj => obj.id === this.productId);
          console.log(productMatched)
          this.product = {
            _id: res.data.productId,
            name: productMatched.name
          }
        },
        error: (e) => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-product-packing-size-create-update");
          // if (e.statusCode && e.statusCode === 401) {
          // this.presentAlert('Unauthorized, please enter valid email and password');
          // } else {
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
          // }
        },
        complete: () => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-product-packing-size-create-update");
        }
      })
    }
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }



  async getAllProductsAllDropDown() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-product-page-list');
    this.productService.getProductAllDropDown().subscribe({
      next: (res) => {
        if (res.data) {
          this.products = res.data;
          console.log(res.data)
        }
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-page-list");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-page-list');
      }
    });
  }

  async onProductSelection(event) {
    console.log(event)
    this.productId = event.value._id;
    this.productPackingSizeForm.patchValue({
      productId: event.value._id
    })
  }


  // async onGetPackingSizeById() {
  //   this.isLoading = true;
  //   this.active = false;
  //   this.ngxUiLoader.startLoader("loader-product-page-list");
  //   this.productPackingSizeService.getProductPackingSizeById(this.filter.productId).subscribe({
  //     next: (res) => {
  //       if (res.status === true) {
  //         this.productPackingSizeList = res.data;
  //       } else {
  //         this.presentToast(res.message || 'No Details Found!!!');
  //       }
  //     },
  //     error: (e) => {
  //       this.ngxUiLoader.stopLoader("loader-product-page-list");
  //       this.isLoading = false;
  //       this.active = true
  //       this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //       this.active = true
  //       this.ngxUiLoader.stopLoader("loader-product-page-list");
  //     }
  //   })
  // }

  async onCreate() {
    this.active = false;

    if (!this.productPackingSizeForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    let dataProfile = this.productPackingSizeForm.value;
    console.log(dataProfile)
    this.ngxUiLoader.startLoader("loader-product-packing-size-create-update");
    this.productPackingSizeService.createProductPackingSize(dataProfile).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.router.navigate(['/app/product-packing-size']);
          this.presentToast(MessageLib.DATA_ADD);
        } else {
          this.presentAlert(res.message);
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-packing-size-create-update');
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-packing-size-create-update');
      }
    });
  }

  async onUpdate() {
    this.active = false;
    if (!this.productPackingSizeForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    let dataProfile = this.productPackingSizeForm.value;
    this.ngxUiLoader.startLoader("loader-product-packing-size-create-update");
    this.productPackingSizeService.updateProductPackingSizeById(this.productPackingSizeId, dataProfile).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.router.navigate(['/app/product-packing-size']);
          this.presentToast(MessageLib.DATA_ADD);
        } else {
          this.presentAlert(res.message);
        }
      },
      error: (e: any) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-packing-size-create-update');
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-packing-size-create-update');
      }
    });
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


  // onProfileRoleSelection(event: any) {
  //   console.log(event.detail.value);
  //   this.modifyFormOnProfileRole(event.detail.value)
  // }


  async onSave() {
    if (this.mode === 'create') {
      this.onCreate();
      console.log('here')
    } else if (this.mode === 'update') {
      this.onUpdate();
    }
  }











}


