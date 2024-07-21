import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { IonDatetime } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType, ProfileRole, Role, RoleUserCategory } from '../../constants/system.const';
import { FormBuilder, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RoleAndPermissionService } from '../../role-and-permission-management/service/role-and-permission.service';
import { UsersManagementService } from '../service/users-management.service';
import { ProfileManagementService } from 'src/app/profile-management/service/profile-management.service';


@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  @ViewChild('selectComponentProfileCompanyName') selectComponentProfileCompanyName: IonicSelectableComponent;
  @ViewChild('selectComponentRole') selectComponentRole: IonicSelectableComponent;
  @ViewChild('selectComponentUserLinkToProfileId') selectComponentUserLinkToProfileId: IonicSelectableComponent;

  active = false;
  // roles: any[] = [];
  userRoleGroups: any[] = []
  userRoleGroup: any;
  userTypeInternalOrExternal: any;

  profile: any;
  profilesList: any[] = [];

  permissionsData: any;
  showEditPermissionsDataButton: boolean;
  selectCompCompanyName: boolean;

  isSubmitted = false;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;

  userForm: any = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    // psw: ['', [Validators.required, Validators.minLength(6)]],
    phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    // birthDay: [''],
    // userJoiningDate: [''],
    roles: ['', [Validators.required]],    //select using dropdown
    roleGroupRefId: ['', [Validators.required]],
    userTypeInternalOrExternal: ['', [Validators.required]],   //select using dropdown from local
    userLinkToProfileId: ['', [Validators.required]],    //select from dropdown
    userLinkToProfileCompanyName: ['', [Validators.required]],   //select from dropdown
  });

  userId: any;
  mode: 'create' | 'update' = 'create';
  constructor(
    public platform: Platform,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    public alertController: AlertController,
    private userManagementService: UsersManagementService,
    private profileManagementService: ProfileManagementService,
    private roleAndPermissionService: RoleAndPermissionService,
    private route: ActivatedRoute,
  ) {
    this.mode = this.route.snapshot.data.mode;
    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  ngOnInit() {
    if (this.mode === 'update') {
      this.active = false;
      this.ngxUiLoader.startLoader("loader-user-management-create-update");
      this.userManagementService.getUserDetailsById(this.userId).subscribe({
        next: (res) => {
          this.userForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            phoneNo: res.data.phoneNo,
            // birthDay: res.data.birthDay,
            // userJoiningDate: res.data.userJoiningDate,
            roles: res.data.roles,
            roleGroupRefId: res.data.roleGroupRefId,
            userTypeInternalOrExternal: res.data.userTypeInternalOrExternal,
            userLinkToProfileId: res.data.userLinkToProfileId,
            userLinkToProfileCompanyName: res.data.userLinkToProfileCompanyName,
          });
          this.permissionsData = res.data.permissionsData;
          this.showEditPermissionsDataButton = true;
          this.profile = {
            _id: res.data.userLinkToProfileId,
            companyName: res.data.userLinkToProfileCompanyName
          }
          this.userRoleGroup = {
            _id: res.data.roleGroupRefId,
            roleName: res.data.roles[0]
          }
          this.userTypeInternalOrExternal = res.data.userTypeInternalOrExternal
        },
        error: (e) => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-user-management-create-update");
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        },
        complete: () => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-user-management-create-update");
        }
      })
    }

  }

  ionViewWillEnter() {

  }

  onDropdownSelectionUserTypeInternalExternal(event) {
    this.getAllRolesGroupsBasedOnUserTypeWithPermissions(event.detail.value)
    this.userForm.patchValue({
      userTypeInternalOrExternal: event.detail.value
    })
    if (event.detail.value === RoleUserCategory.INTERNAL_USER) {
      this.profile = null;
      this.onGetAllProfilesBasedOnProfileRole(ProfileRole.COMPANY)
      this.selectCompCompanyName = false;
      this.userRoleGroup = null;
    } else if (event.detail.value === RoleUserCategory.EXTERNAL_USER) {
      this.selectCompCompanyName = true;
      this.profile = null;
      this.userRoleGroup = null;
      this.onGetAllProfilesBasedOnProfileRole(ProfileRole.DISTRIBUTOR)
    } else if (event.detail.value === RoleUserCategory.ADMIN) {
      this.profile = null;
      this.userRoleGroup = null;
      this.selectCompCompanyName = false;
    }
  }



  async getAllRolesGroupsBasedOnUserTypeWithPermissions(userType: any) {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-user-management-create-update');
    this.roleAndPermissionService.getRoleGroupsDropDownByUserTypeWithPermissions(userType).subscribe({
      next: (res) => {
        if (res.data) {
          this.userRoleGroups = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-user-management-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-user-management-create-update');
      }
    });
  }

  async onGetAllProfilesBasedOnProfileRole(profileRole?: any) {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-user-management-create-update');
    this.profileManagementService.getAllProfilesBasedOnProfileRole(profileRole).subscribe({
      next: (res) => {
        if (res.data) {
          this.profilesList = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-user-management-create-update");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-user-management-create-update');
        if (profileRole.includes(ProfileRole.COMPANY)) {
          this.userForm.patchValue({
            userLinkToProfileId: this.profilesList[0]._id,
            userLinkToProfileCompanyName: this.profilesList[0].companyName
          })
        }
      }
    });
  }




  profileCompanyNameSelection(event) {
    this.userForm.patchValue({
      userLinkToProfileId: event.value._id,
      userLinkToProfileCompanyName: event.value.companyName
    })
  }

  itemRoleChange(event) {
    this.permissionsData = event.value.permissionsData;
    this.userForm.patchValue({
      roleGroupRefId: event.value._id,
      userTypeInternalOrExternal: event.value.userTypeInternalOrExternal,
      roles: [event.value.roleName]
    })
    this.editPermissionsButton(true);
  }

  editPermissionsButton(editRoleChange?: boolean) {
    if (editRoleChange) {
      this.showEditPermissionsDataButton = true;
    } else {
      this.showEditPermissionsDataButton = false;
    }
  }

  async onCreateUser() {
    this.active = false;
    if (!this.userForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    } else {
      let dataUser = this.userForm.value;
      dataUser['permissionsData'] = this.permissionsData;
      this.ngxUiLoader.startLoader("loader-user-management-create-update");
      this.userManagementService.createUser(dataUser).subscribe({
        next: (res) => {
          this.presentToast(MessageLib.DATA_ADD);
        },
        error: (e) => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-user-management-create-update");
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

        },
        complete: () => {
          this.active = true;
          this.ngxUiLoader.stopLoader('loader-user-management-create-update');
          this.router.navigate(['/app/users-management']);
        }
      });
    }
  }

  onUpdateUser() {
    this.active = false;
    if (!this.userForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    } else {
      let dataUser = this.userForm.value;
      dataUser['permissionsData'] = this.permissionsData;
      this.ngxUiLoader.startLoader("loader-user-management-create-update");
      this.userManagementService.updateUser(this.userId, dataUser).subscribe({
        next: (res) => {
          this.presentToast(MessageLib.DATA_ADD);
        },
        error: (e) => {
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-user-management-create-update");
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        },
        complete: () => {
          this.active = true;
          this.ngxUiLoader.stopLoader('loader-user-management-create-update');
          this.router.navigate(['/app/users-management']);
        }
      });
    }
  }
  async onSave() {
    if (this.mode === 'create') {
      this.onCreateUser();
    } else if (this.mode === 'update') {
      this.onUpdateUser();
    }
  }








  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get errorControl() {
    return this.userForm.controls;
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



}
