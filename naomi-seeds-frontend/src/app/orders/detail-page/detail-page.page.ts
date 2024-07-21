/* eslint-disable no-underscore-dangle */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
import { format, parseISO } from 'date-fns';
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
import { ProductPackingSizeService } from '../../product-packing-size/service/product-packing-size.service';
import { PermissionsDataBehaviourSubjectService } from '../../service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ProductService } from 'src/app/product/service/product.service';
import { ProductsLotService } from '../../products-lot-page/service/products-lot.service';
import { OrdersService } from '../service/orders.service';
import { NodeWithI18n } from '@angular/compiler';


@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.page.html',
  styleUrls: ['./detail-page.page.scss'],
})
export class DetailPagePage implements OnInit {

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.salesOrders;
  combinedPermissionsDataArray: any[] = [];
  userLinkToProfileId: any;

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;

  orderId: any;
  orderDetail: any;
  orderTypeSelection: any;
  productLotId: any;
  items: any[] = []
  readonly = true;

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
    private ordersService: OrdersService,
  ) {
    this.orderId = this.route.snapshot.paramMap.get('orderId');

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.userLinkToProfileId= res.userLinkToProfileId;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e =>
        res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    });

    console.log(this.userRole)
  }

  ngOnInit() {
    this.onGetOrderDetailsById();
  }


  async onGetOrderDetailsById() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-product-packing-size-create-update');
    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (res) => {
             
        if(res.data) {
          this.orderDetail = res.data;
          this.items = res.data.items;
          this.orderTypeSelection= res.data.orderType;
        } else {
        // this.presentAlert("No Details Found");          
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-packing-size-create-update");
        // this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-packing-size-create-update");
      }
    });
  }


  doRefresh(event: any) {
    this.onGetOrderDetailsById();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500
    });
    toast.present();
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












// 1st approval from Profile
onApproveByFromProfile() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.approveByFromProfile(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}

onRejectByFromProfile() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.rejectByFromProfile(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}


// 2nd approval for Manager to generate DC
onApproveGenerateDC() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.approveByManagerDC(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}

onRejectForDC() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.rejectByManagerDC(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}

// 3rd stage is by default approved for NodeWithI18n

// 4th approval by To Profile confirming receipt
onApproveByToProfile() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.approveByToProfile(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}

onRejectByToProfile() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.rejectByToProfile(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}


// 5th approval by manager completing transaction and generate invoice and credit note as applicable
onApproveFinalTxn() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  console.log(this.orderDetail.orderType)
  this.ordersService.approveByManagerForCompletingTxn(this.orderId, this.orderDetail?.orderType).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}

onRejectFinalTxn() {
  this.isLoading = true;
  this.active = false;
  this.ngxUiLoader.startLoader('loader-detail-order-page-new');
  this.ordersService.rejectByManagerForCompletingTxn(this.orderId).subscribe({
    next: (res) => {
      if (res.status === true ) {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
      } else {
        this.presentAlert(MessageLib.WORKFLOW_UPDATE_FAILED);
      }
    },
    error: (e) => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    },
    complete: () => {
      this.active = true;
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-detail-order-page-new");
      this.onGetOrderDetailsById();
    }
  });
}




















}
