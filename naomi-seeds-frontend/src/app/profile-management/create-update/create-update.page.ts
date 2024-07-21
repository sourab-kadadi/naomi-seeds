import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, UntypedFormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductsService } from '../../service/products.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType, ProfileRole, Role } from '../../constants/system.const';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { ProfileManagementService } from '../service/profile-management.service';
import { GeneralDropdownsService } from 'src/app/service/general-dropdowns.service';
import { UsersManagementService } from 'src/app/users-management/service/users-management.service';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild('selectComponentZone') selectComponentZone: IonicSelectableComponent;
  @ViewChild('selectComponentState') selectComponentState: IonicSelectableComponent;
  @ViewChild('selectComponentDistrict') selectComponentDistrict: IonicSelectableComponent;
  @ViewChild('selectComponentSalesOfficer') selectComponentSalesOfficer: IonicSelectableComponent;
  @ViewChild('selectComponentManager') selectComponentManager: IonicSelectableComponent;
  @ViewChild('closingAccountStatementTypeSelectionCrDr') closingAccountStatementTypeSelectionCrDr: IonicSelectableComponent;

  profileForm: any = this.formBuilder.group({
    companyName: ['', [Validators.required]],
    profileRole: ['', [Validators.required]],
    // joinDate: ['', [Validators.required]],
    zone: [''],
    gstin: [''],
    completeAddress: ['', [Validators.required]],
    addressDetails: this.formBuilder.group({
      address1: [''],
      city: [''],
      taluka: [''],
      district: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pincode: ['']
    })
  })



  active = false;

  states: any[] = [];
  state: any;
  districts: any[] = [];
  district: any;
  zones: any[] = [];
  zone: any;

  salesOfficers: any[] = [];
  salesOfficer: any;

  managers: any[] = [];
  manager: any;


  profileRoleSelected: any;


  accountingClosingDateSelected = '2023-03-31T07:07:00+05:30';
  profileId: any;
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
    private generalDropdownsService: GeneralDropdownsService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private profileManagementService: ProfileManagementService,
    private userManagementService: UsersManagementService,
    private popoverController: PopoverController
  ) {
    this.mode = this.route.snapshot.data.mode;
    this.profileId = this.route.snapshot.paramMap.get('profileId');
    console.log(this.profileId, this.route.snapshot)
  }
  ngOnInit() {


    this.getAllStates();
    this.getAllZones();

    

    if (this.mode === 'update') {
      this.active = false;
      this.ngxUiLoader.startLoader("loader-profile-create-update");
      this.profileManagementService.getProfileDetailsById(this.profileId).subscribe({
        next: (res) => {
          console.log(res)
          this.getAllDistricts(res.data.addressDetails.state);
          if ([ProfileRole.DISTRIBUTOR].includes(res.data.profileRole)) {
            this.profileRoleSelected = res.data.profileRole;           
            this.modifyFormOnProfileRole(res.data.profileRole)
            this.profileForm.patchValue({
              firstLevelReportingUserID: res.data.firstLevelReportingUserID,
              firstLevelReportingUserName: res.data.firstLevelReportingUserName,
              secondLevelReportingUserID: res.data.secondLevelReportingUserID,
              secondLevelReportingUserName: res.data.secondLevelReportingUserName,
              accountingInfo: {
                openingAccountStatementAmount: res.data.accountingInfo.openingAccountStatementAmount,
                openingAccountStatementAmountCrDr: res.data.accountingInfo.openingAccountStatementAmountCrDr,
                openingAccountStatementDate: res.data.accountingInfo.openingAccountStatementDate
              }


            });
          }
          // this.manager = {
          //   itemTextField: res.data.secondLevelReportingUserName
          // };
          this.salesOfficer = {
            _id: res.data.firstLevelReportingUserID,
            name: res.data.firstLevelReportingUserName
          }
          this.manager = {
            _id: res.data.secondLevelReportingUserID,
            name: res.data.secondLevelReportingUserName
          }

          this.district = {
            name: res.data.addressDetails.district,
            displayName: res.data.addressDetails.district
          }
          this.state = {
            name: res.data.addressDetails.state,
            displayName: res.data.addressDetails.state
          }
          this.zone = {
            name: res.data.zone,
            displayName: res.data.zone
          }

          // this.openingAccountStatementAmountCrDr = {
          //   name: res.data.zone,
          //   displayName: res.data.zone
          // }


          this.profileForm.patchValue({
            companyName: res.data.companyName,
            profileRole: res.data.profileRole,
            zone: res.data.zone,
            gstin: res.data.gstin,
            completeAddress: res.data.completeAddress,
            addressDetails: this.profileForm.get('addressDetails').patchValue({
              address1: res.data.addressDetails.address1,
              city: res.data.addressDetails.city,
              taluka: res.data.addressDetails.taluka,
              district: res.data.addressDetails.district,
              state: res.data.addressDetails.state,
              pincode: res.data.addressDetails.pincode,
            }),
          });

          console.log(this.profileForm)

        },
        error: (e) => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-profile-create-update");
          // if (e.statusCode && e.statusCode === 401) {
          // this.presentAlert('Unauthorized, please enter valid email and password');
          // } else {
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
          // }
        },
        complete: () => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-profile-create-update");
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

  async onCreateProfile() {
    this.active = false;
    if (!this.profileForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    let dataProfile = this.profileForm.value;
    this.ngxUiLoader.startLoader("loader-profile-create-update");
    this.profileManagementService.createProfile(dataProfile).subscribe({
      next: (res) => {
        this.router.navigate(['/app/profile-management']);
        this.presentToast(MessageLib.DATA_ADD);
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }

  async onUpdateProfile() {
    this.active = false;
    if (!this.profileForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    let dataProfile = this.profileForm.value;
    this.ngxUiLoader.startLoader("loader-profile-create-update");
    this.profileManagementService.updateProfileById(this.profileId, dataProfile).subscribe({
      next: (res) => {
        this.router.navigate(['/app/profile-management']);
        this.presentToast(MessageLib.DATA_ADD);
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
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


  onProfileRoleSelection(event: any) {
    console.log(event.detail.value);
    this.profileRoleSelected = event.detail.value;
    this.modifyFormOnProfileRole(event.detail.value)
  }


  modifyFormOnProfileRole(profileRoleSelection: any) {
    console.log(profileRoleSelection);
    if ([ProfileRole.DISTRIBUTOR].includes(profileRoleSelection)) {
      this.getAllActiveSalesOfficer();
      this.getAllActiveManagers();

      this.profileForm.addControl('firstLevelReportingUserID', this.formBuilder.control('', [Validators.required]));
      this.profileForm.addControl('firstLevelReportingUserName', this.formBuilder.control('', [Validators.required]));
      this.profileForm.addControl('secondLevelReportingUserID', this.formBuilder.control('', [Validators.required]));
      this.profileForm.addControl('secondLevelReportingUserName', this.formBuilder.control('', [Validators.required]));
      // this.profileForm.addControl('thirdLevelReportingUserID');
      // this.profileForm.addControl('thirdLevelReportingUserName');

      this.profileForm.addControl('accountingInfo', this.formBuilder.group({
        openingAccountStatementAmount: [null, [Validators.required]],
        openingAccountStatementAmountCrDr: ['', [Validators.required]],
        openingAccountStatementDate: ['', [Validators.required]]
      }));
      


    } else {
      // this.profileForm.removeControl('joinDate');
      this.profileForm.removeControl('firstLevelReportingUserID');
      this.profileForm.removeControl('firstLevelReportingUserName');
      this.profileForm.removeControl('secondLevelReportingUserID');
      this.profileForm.removeControl('secondLevelReportingUserName');
      // this.profileForm.removeControl('thirdLevelReportingUserID');
      // this.profileForm.removeControl('thirdLevelReportingUserName');
      this.profileForm.removeControl('accountingInfo')
    }
    console.log(this.profileForm)
  }


  async onSave() {
    if (this.mode === 'create') {
      this.onCreateProfile();
    } else if (this.mode === 'update') {
      this.onUpdateProfile();
    }
  }




  async getAllStates() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-profile-create-update');
    this.generalDropdownsService.getAllStates().subscribe({
      next: (res) => {
        console.log(res)
        if (res.data) {
          this.states = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-profile-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }

  onStateChange(event: any) {
    this.districts = null;
    this.district = null;
    this.profileForm.get('addressDetails').patchValue({
      state: event.value.name
    })
    this.getAllDistricts(event.value.name)
  }

  async getAllDistricts(state?: any) {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-profile-create-update');
    this.generalDropdownsService.getAllDistricts(state).subscribe({
      next: (res) => {
        if (res.data) {
          this.districts = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Active Districts Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-profile-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }

  onDistrictChange(event: any) {
    this.profileForm.get('addressDetails').patchValue({
      district: event.value.name
    })
  }

  async getAllZones() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-profile-create-update');
    this.generalDropdownsService.getAllZones().subscribe({
      next: (res) => {
        if (res.data) {
          this.zones = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Zone Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-profile-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }

  onZoneChange(event: any) {
    this.profileForm.patchValue({
      zone: event.value.name
    })
  }


  async getAllActiveSalesOfficer() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-profile-create-update');
    this.userManagementService.getAllActiveUsersDropDownByRole(Role.SALES_OFFICER).subscribe({
      next: (res) => {
        console.log(res)
        if (res.data) {
          this.salesOfficers = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Sales Officers Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-profile-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }

  onSalesOfficerChange(event: any) {
    this.profileForm.patchValue({
      firstLevelReportingUserID: event.value._id,
      firstLevelReportingUserName: event.value.name,
    })
  }



  async getAllActiveManagers() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-profile-create-update');
    this.userManagementService.getAllActiveUsersDropDownByRole(Role.MANAGER).subscribe({
      next: (res) => {
        console.log(res)
        if (res.data) {
          this.managers = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Managers Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-profile-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-profile-create-update');
      }
    });
  }


  onManagerChange(event: any) {
    this.profileForm.patchValue({
      secondLevelReportingUserID: event.value._id,
      secondLevelReportingUserName: event.value.name,
    })
  }


onAccountingTypeSelection(event: any) {
  console.log(event.detail.value)
  this.profileForm.patchValue({
    accountingInfo: {
      openingAccountStatementAmountCrDr: event.detail.value,
      openingAccountStatementDate: this.accountingClosingDateSelected
      
    }
  });
  
}

// // update this to allow for date selection
// async formatDate1(value: any) {
//   // const date1 = format(parseISO(value1), 'MMM d, yyyy');
//   const date1 = this.accountingClosingDateSelected;

//   this.profileForm.patchValue({
//     accountingInfo: {
//       openingAccountStatementDate: date1
//     }
//   })
//   const popover = await this.popoverController.getTop();
//   if (popover) {
//     popover.dismiss();
//   }
//   return date1;
// }

}


