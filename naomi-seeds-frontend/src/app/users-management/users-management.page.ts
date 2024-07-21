import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { IonDatetime } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, ProfileRole, Role, RoleUserCategory } from '../constants/system.const';
import { FormBuilder, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { RoleAndPermissionService } from '../role-and-permission-management/service/role-and-permission.service';
import { UsersManagementService } from './service/users-management.service';
import { ProfileManagementService } from 'src/app/profile-management/service/profile-management.service';
import { environment } from '../../environments/environment';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.page.html',
  styleUrls: ['./users-management.page.scss'],
})
export class UsersManagementPage implements OnInit {

  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: string;
  pageLocation = PageLocation.products;

  @ViewChild('search', { static: false }) search: IonSearchbar;


  //for infinite scroll
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  totalCount = 0;
  isInitial = true;
  isLoading = false;
  //////

  active = false;

  userRoleGroups: any[] = []
  usersList: any[] = []

  filter = {
    page: 0,
    count: 12,
    search: '',
    role: '',
    // status: false
  };

  s3path: any = environment.s3Url;
  private filterTimeOut: any = null;
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
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService
  ) {

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userTypeInternalOrExternal = res.userTypeInternalOrExternal;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.ngxPermissionsService.loadPermissions(this.permissionsDataByPageLocation);
    })
  }


  ngOnInit() {


  }

  ionViewWillEnter() {
    this.onGetAllRolesGroups();
    this.onGetAllUsers();
  }

  async onGetAllRolesGroups() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-user-management-page');
    this.roleAndPermissionService.getAllActiveRoleGroupsDropDown().subscribe({
      next: (res) => {
        if (res.data) {
          this.userRoleGroups = res.data;
        }
        console.log(this.userRoleGroups)
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-user-management-page');
      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-user-management-page');
      }
    });
  }


  async onGetAllUsers(init?: boolean, infinitScrollEvent?: any) {
    if (this.isInitial === true) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }
    this.active = false;
    this.ngxUiLoader.startLoader('loader-user-management-page');
    this.userManagementService.getAllUsers(this.filter).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.usersList = init ? res.data : [...this.usersList, ...res.data];
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = false;
          if (this.usersList.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }
        } else {
          this.presentAlert(res.message || 'User Not Found');
        }
      },
      error: (e) => {
        console.log(e);
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        this.active = true;
        this.isLoading = false;
        this.ngxUiLoader.stopLoader("loader-user-management-page");
      },
      complete: () => {
        this.active = true;
        this.isLoading = false;
        this.ngxUiLoader.stopLoader("loader-user-management-page");

      }
    })
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

  onSearchChange(event) {
    this.filter.search = event.detail.value;
    if (this.filter.search === '') {
      this.filter.page = 0;
      this.usersList = [];
      this.infiniteScroll.disabled = false;
      this.onGetAllUsers();
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.usersList = [];
      this.filter.page = 0;
      this.infiniteScroll.disabled = false;
      this.onGetAllUsers();

    }, 500);
  }

  onDropdownSelection(event1: any) {
    this.filter.page = 0;
    this.usersList = [];
    this.infiniteScroll.disabled = false;
    this.filter.role = event1.detail.value;
    this.onGetAllUsers();
  }

  doRefresh(event: any) {
    this.usersList = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.onGetAllUsers();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  ionViewWillLeave() {
    this.usersList = [];
    this.userRoleGroups = [];
    this.filter.page = 0;
    this.filter.role = '';
  }


}
