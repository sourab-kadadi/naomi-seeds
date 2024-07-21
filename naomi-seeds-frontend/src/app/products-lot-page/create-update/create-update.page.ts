/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
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
import { ProductPackingSizeService } from '../../product-packing-size/service/product-packing-size.service';
import { PermissionsDataBehaviourSubjectService } from '../../service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ProductService } from 'src/app/product/service/product.service';
import { ProductsLotService } from '../service/products-lot.service';



@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;
  @ViewChild('selectComponentProductPackingSize') selectComponentProductPackingSize: IonicSelectableComponent;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.lotData;
  combinedPermissionsDataArray: any[] = [];

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;


  products: any[] = [];
  product: any;
  productId: any;
  productDetail: any;
  productName: any

  productPackingSizeId: any;
  productPackingSize: any = {};
  productPackingSizeList: any[] = [];
  productTruthfulLabel: any;
  productPackingInfo: any;

  productLotId: any;
  lotDataEditable: true;
  lotData: any;

  mode: 'create' | 'update' = 'create';

  readonly = true;

  productLotDataForm: any = this.formBuilder.group({
    lotNo: ['', [Validators.required]],
    productId: ['', [Validators.required]],
    productPackingSizeId: ['', [Validators.required]],
    lotProductionDetails: this.formBuilder.group({
      processingPlantNo: ['Sy. No. 59', [Validators.required]],
      totalQtyOfLotsInKgs: ['', [Validators.required]],
      numberOfPackets: ['', [Validators.required]],
      dateOfTest: ['', [Validators.required]],
      lableNoFrom: ['', [Validators.required]],
      labelNoTo: ['', [Validators.required]],
      missingNo: [''],
      dateOfPacking: ['', [Validators.required]],
      validUpto: ['', [Validators.required]],
      seedGrowerNameAndAddress: ['', [Validators.required]],
      seedPurchasedFrom: ['', [Validators.required]],
      sowingSeason: ['', [Validators.required]],
      seedProductionSupervisor: ['', [Validators.required]],
      seedProcessingSupervisor: ['', [Validators.required]],
    }),
    lotValidityAvailable: [true, [Validators.required]],
    status: [true, [Validators.required]],
  });

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
    private productsLotService: ProductsLotService,
    private userManagementService: UsersManagementService,
    private productService: ProductService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
    private popoverController: PopoverController
  ) {
    this.mode = this.route.snapshot.data.mode || 'create';
    this.productLotId = this.route.snapshot.paramMap.get('productLotId');

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e =>
        res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    });
  }

  ngOnInit() {

    if (this.mode === 'create') {
      this.getAllProductsAllDropDown();
    } else if (this.mode === 'update') {
      this.getProductLotDataById();
    }




  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async getProductLotDataById() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-product-lot-create-update');
    this.productsLotService.getProductLotDataByIdExpanded(this.productLotId).subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.data)
        console.log(res.data.truthfulLabel)        
        this.lotData = res.data;
        console.log(res.data.productName)
        this.productName = res.data.productName;
        console.log(this.productDetail)
        console.log(res.data.truthfulLabel)
        this.productTruthfulLabel = res.data.truthfulLabel;
        this.productPackingSize.packingQty = res.data.productPackingSizeInfo.packingQty;
        this.productPackingSize.packingUnit = res.data.productPackingSizeInfo.packingUnit;
        this.productPackingSize.packetInvoicePrice = res.data.productPackingSizeInfo.packetInvoicePrice;
        this.productPackingSize.effectiveRatePerKg = res.data.productPackingSizeInfo.effectiveRatePerKg;
        this.productPackingSize.packetMRPPrice = res.data.productPackingSizeInfo.packetMRPPrice;
        this.productLotDataForm.patchValue({
          lotNo: res.data.lotNo,
          productId: res.data.productId,
          productPackingSizeId: res.data.productPackingSizeId,
          // productPackingInfo: res.data.
          lotProductionDetails: this.productLotDataForm.get('lotProductionDetails').patchValue({
            processingPlantNo: res.data.lotProductionDetails.processingPlantNo,
            totalQtyOfLotsInKgs: res.data.lotProductionDetails.totalQtyOfLotsInKgs,
            numberOfPackets: res.data.lotProductionDetails.numberOfPackets,
            dateOfTest: res.data.lotProductionDetails.dateOfTest,
            lableNoFrom: res.data.lotProductionDetails.lableNoFrom,
            labelNoTo: res.data.lotProductionDetails.labelNoTo,
            missingNo: res.data.lotProductionDetails.missingNo,
            dateOfPacking: res.data.lotProductionDetails.dateOfPacking,
            validUpto: res.data.lotProductionDetails.validUpto,
            seedGrowerNameAndAddress: res.data.lotProductionDetails.seedGrowerNameAndAddress,
            seedPurchasedFrom: res.data.lotProductionDetails.seedPurchasedFrom,
            sowingSeason: res.data.lotProductionDetails.sowingSeason,
            seedProductionSupervisor: res.data.lotProductionDetails.seedProductionSupervisor,
            seedProcessingSupervisor: res.data.lotProductionDetails.seedProcessingSupervisor,
          }),
          lotValidityAvailable: res.data.lotValidityAvailable,
        });
      
      console.log(this.productLotDataForm)
      
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-lot-create-update");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-lot-create-update");
      }
    });
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
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-page-list');
      }
    });
  }

  async onProductSelection(event) {
    console.log(event)
    this.productId = event.value._id;
    this.productLotDataForm.patchValue({
      productId: event.value._id
    })
    this.getAllProductPackingSizesByProductIdDropDown();
    this.getProductDetailsById();
  }


  async getProductDetailsById() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-product-lot-create-update');
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        if (res.data) {
          this.productDetail = res.data;
          this.productName = res.data.name;
          this.productTruthfulLabel = res.data.truthfulLabel;
        }
        if (res.status === false) {
          this.presentAlert('Product Details Not Found!!!');
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-lot-create-update");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-lot-create-update");
      }
    });
  }



  async getAllProductPackingSizesByProductIdDropDown() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-product-page-list');
    this.productPackingSizeService.getPackingSizesByProductIdDropDown(this.productId).subscribe({
      next: (res) => {
        if (res.data) {
          this.productPackingSizeList = res.data;
          console.log(res.data)
        }
        if (res.status === false) {
          this.presentAlert('No Packing Size Details Found for the product!!!');
        }
      }, error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-page-list");
        this.presentAlert(e.message.error || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-page-list');
      }
    });
  }


  async onProductPackingSizeSelection(event: any) {
    this.productPackingSizeId = event.value._id;
    this.productLotDataForm.patchValue({
      productPackingSizeId: event.value._id
    })
    this.productPackingSize.packingQty = event.value.packingQty;
    this.productPackingSize.packingUnit = event.value.packingUnit;
    this.productPackingSize.packetInvoicePrice = event.value.packetInvoicePrice;
    this.productPackingSize.effectiveRatePerKg = event.value.effectiveRatePerKg;
    this.productPackingSize.packetMRPPrice = event.value.packetMRPPrice;

    // this.getAllProductPackingSizesByProductIdDropDown()
  }


  async onCreate() {
    this.active = false;
    if (!this.productLotDataForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    const dataProfile = this.productLotDataForm.value;
    console.log(dataProfile)
    this.ngxUiLoader.startLoader("loader-product-lot-create-update");
    this.productsLotService.createProductLotData(dataProfile).subscribe({
      next: (res) => {
        if (res && res.status === true) {
          this.router.navigate(['/app/products-lot-page']);
          this.presentToast(MessageLib.DATA_ADD);
        } else {
          this.presentAlert(res.message);
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-lot-create-update');
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-lot-create-update');
      }
    });
  }

  async onUpdate() {
    this.active = false;
    if (!this.productLotDataForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    const dataProfile = this.productLotDataForm.value;
    this.ngxUiLoader.startLoader("loader-product-lot-create-update");
    this.productsLotService.updateProductLotById(this.productLotId, dataProfile).subscribe({
      next: (res) => {
        if (res.status === true) {
          // this.router.navigate(['/app/product-packing-size']);
          this.presentToast(MessageLib.DATA_ADD);
        } else {
          this.presentAlert(res.message);
        }
      },
      error: (e: any) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-lot-create-update');
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-lot-create-update');
      }
    });
  }



  async formatDate(value: any) {

    const date = format(parseISO(value), 'MMM d, yyyy');
    this.productLotDataForm.patchValue({
      lotProductionDetails: this.productLotDataForm.get('lotProductionDetails').patchValue({
        dateOfTest: date
      })
    })
    const popover = await this.popoverController.getTop();
    if (popover) {
      popover.dismiss();
    }
    return date;
  }

  async formatDate1(value: any) {
    const date1 = format(parseISO(value), 'MMM d, yyyy');
    this.productLotDataForm.patchValue({
      lotProductionDetails: this.productLotDataForm.get('lotProductionDetails').patchValue({
        dateOfPacking: date1
      })
    })
    const popover = await this.popoverController.getTop();
    if (popover) {
      popover.dismiss();
    }
    return date1;
  }

  async formatDate2(value: any) {
    const date2 = format(parseISO(value), 'MMM d, yyyy');
    this.productLotDataForm.patchValue({
      lotProductionDetails: this.productLotDataForm.get('lotProductionDetails').patchValue({
        validUpto: date2
      })
    })
    const popover = await this.popoverController.getTop();
    if (popover) {
      popover.dismiss();
    }
    return date2;
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

  async onSave() {
    if (this.mode === 'create') {
      this.onCreate();
      console.log('here')
    } else if (this.mode === 'update') {
      this.onUpdate();
    }
  }











}


