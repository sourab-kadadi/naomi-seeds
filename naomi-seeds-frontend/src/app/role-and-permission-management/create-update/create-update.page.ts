import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
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
import { RoleAndPermissionService } from '../service/role-and-permission.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  userTypeSelection: any;

  rolesAndPermissionsForm: any = this.formBuilder.group({
    roleName: ['', [Validators.required]],
    userTypeInternalOrExternal: ['', [Validators.required]],
    roleSeniorityLevel: ['', [Validators.required]],

    // // products: this.formBuilder.group({"CAN_CREATE": "true", "CAN_EDIT": false, "CAN_READ": false, "CAN_DELETE": false}),
    // products: {CAN_CREATE: true, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false},
    //       // lotData: this.formBuilder.array(["CAN_CREATE": false, "CAN_EDIT": false, "CAN_READ": false, "CAN_DELETE": false])
    //       salesOrders: this.formBuilder.group({"CAN_CREATE": false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false}),
    //       requirementData: this.formBuilder.array([{CAN_CREATE: false}, {CAN_EDIT: false}, {CAN_READ: false}, {CAN_DELETE: false}]),
    //       paymentsReceived: this.formBuilder.array([{CAN_CREATE: false}, {CAN_EDIT: false}, {CAN_READ: false}, {CAN_DELETE: false}]),
    //       users: this.formBuilder.array([{CAN_CREATE: false}, {CAN_EDIT: false}, {CAN_READ: false}, {CAN_DELETE: false}]),
    //       rolesAndPermissionsPageAccess: this.formBuilder.array([{CAN_CREATE: false}, {CAN_EDIT: false}, {CAN_READ: false}, {CAN_DELETE: false}])
  });
  permissionsData = {
    products: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    productsCategory: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    lotData: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    salesOrders: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    requirementData: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    paymentsReceived: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    users: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    profilePage: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false },
    rolesAndPermissionsPageAccess: { CAN_CREATE: false, CAN_EDIT: false, CAN_READ: false, CAN_DELETE: false }
  }
  roleId: any;
  mode: 'create' | 'update' = 'create';

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: UntypedFormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    public alertController: AlertController,
    private roleAndPermissionService: RoleAndPermissionService,
    private route: ActivatedRoute,
  ) {
    this.mode = this.route.snapshot.data.mode;
    this.roleId = this.route.snapshot.paramMap.get('roleId');
  }

  ngOnInit() {
    if (this.mode === 'update') {
      // this.ngxUiLoader.startLoader('loader-catalog-add');
      this.roleAndPermissionService.getRolePermissionsDetailsById(this.roleId).subscribe(res => {
        // this.ngxUiLoader.stopLoader('loader-catalog-add');
        console.log(res);
        this.rolesAndPermissionsForm.patchValue({
          roleName: res.data.roleName.replaceAll('_', ' '),
          userTypeInternalOrExternal: res.data.userTypeInternalOrExternal,
          roleSeniorityLevel: res.data.roleSeniorityLevel
        });
this.userTypeSelection = res.data.userTypeInternalOrExternal;
        this.permissionsData = res.data.permissionsData;
        // this.verifiedDate = res.data?.verifiedDate;
        // this.permissionsData = res.data.permissionsData;
        // this.getAll();
        // this.product = res.data;
        // if (!res.data.image || !res.data.image[0]?.filePath || res.data.image[0]?.filePath === 'string' || res.data.image[0]?.filePath === null ) {
        //   this.imagePresent = false;
        // }
        // this.isLoading = false;
        // this.inActive = false;
      }, error => {
        // this.isLoading = false;
        // this.inActive = true;
        this.ngxUiLoader.stopLoader('loader-catalog-add');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
    };





  }

  ionViewWillEnter() {
    this.rolesAndPermissionsForm.reset();
    this.permissionsData;
    console.log(this.rolesAndPermissionsForm.value.products)
    console.log(this.rolesAndPermissionsForm.value)

    console.log('roles', this.permissionsData)

    console.log(true, this.permissionsData.products.CAN_CREATE)


  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get errorControl() {
    return this.rolesAndPermissionsForm.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async onCreateRoleAndPermissions() {
    const rolesAndPermissionsData = {
      roleName: this.rolesAndPermissionsForm.value.roleName.trim().toUpperCase().replaceAll(' ', '_'), 
      userTypeInternalOrExternal: this.rolesAndPermissionsForm.value.userTypeInternalOrExternal,
      roleSeniorityLevel: this.rolesAndPermissionsForm.value.roleSeniorityLevel,
      permissionsData: this.permissionsData
    }

    console.log(rolesAndPermissionsData);
    // this.ngxUiLoader.startLoader('loader-add-product');
    // this.isActive = false;

    this.roleAndPermissionService.createRoleAndPermissions(rolesAndPermissionsData).subscribe((res) => {
      this.ngxUiLoader.stopLoader('loader-add-product');
      // this.isActive = true;
      this.rolesAndPermissionsForm.reset();
      console.log(res);
      this.router.navigate(['/app/role-and-permission-management']);
      this.presentToast(MessageLib.DATA_ADD);
    }, error => {
      // this.isActive = true;
      // this.ngxUiLoader.stopLoader('loader-add-product');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });


  }

  async onUpdateRoleAndPermissions() {
    const rolesAndPermissionsData = {
      roleName: this.rolesAndPermissionsForm.value.roleName.trim().toUpperCase().replaceAll(' ', '_'), 
      userTypeInternalOrExternal: this.rolesAndPermissionsForm.value.userTypeInternalOrExternal,
      roleSeniorityLevel: this.rolesAndPermissionsForm.value.roleSeniorityLevel,
      permissionsData: this.permissionsData
    }
    console.log(rolesAndPermissionsData);
    // this.ngxUiLoader.startLoader('loader-add-product');
    // this.isActive = false;

    this.roleAndPermissionService.updateRoleAndPermissionsById(this.roleId, rolesAndPermissionsData).subscribe((res) => {
      this.ngxUiLoader.stopLoader('loader-add-product');
      // this.isActive = true;
      this.rolesAndPermissionsForm.reset();
      console.log(res);
      this.router.navigate(['/app/role-and-permission-management']);
      this.presentToast(MessageLib.DATA_ADD);
    }, error => {
      // this.isActive = true;
      // this.ngxUiLoader.stopLoader('loader-add-product');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
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





  async save() {
    if (this.mode === 'create') {
      this.onCreateRoleAndPermissions();
    } else if (this.mode === 'update') {
      this.onUpdateRoleAndPermissions();
    }
  }

  userTypeInternalOrExternal(event) {
    console.log(event.detail.value);
    this.rolesAndPermissionsForm.patchValue({
      userTypeInternalOrExternal: event.detail.value
    });
 }



}


