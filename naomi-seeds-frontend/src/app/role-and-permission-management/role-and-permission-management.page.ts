import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ProductsService } from '../service/products.service';
import { AuthService } from '../login/auth.service';
import { environment } from '../../environments/environment';
import { StorageService } from '../service/service/storage.service';
import { UntypedFormBuilder } from '@angular/forms';
import { UploadService } from '../service/service/upload.service';
import { RoleAndPermissionService } from './service/role-and-permission.service';

@Component({
  selector: 'app-role-and-permission-management',
  templateUrl: './role-and-permission-management.page.html',
  styleUrls: ['./role-and-permission-management.page.scss'],
})
export class RoleAndPermissionManagementPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
 userRoleGroups: any[] = []

  filter = {
    page: 0,
    count: 120000,
    search: '',
    location: '',
    // status: false
  };

  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  private filterTimeOut: any = null;
  private searchedItem: any;
  private challansSub: Subscription;
  // loadedProduct: Product[];
  private productsSub: Subscription;

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

}


  ngOnInit() {





  }

  ionViewWillEnter() {
    this.getAllRolesGroups();

// this.auth.isUserLoggedIn();

  }

  // ionViewDidEnter() {
  //   setTimeout(() => {
  //     this.search.setFocus();
  //   });
  // }


  async getAllRolesGroups() {
    // this.isLoading = true;
    // this.inActive = true;
    // this.ngxUiLoader.startLoader('loader-product-1');
    this.challansSub = await this.roleAndPermissionService.getAllActiveRoleGroupsDropDown().subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-product-1');
      console.log(res)
      if(res.data) {
        this.userRoleGroups = [...this.userRoleGroups, ...res.data];
      }
      console.log(this.userRoleGroups, 'userrole');
      if(res.status === false) {
        this.presentAlert('No Details Found !!!');

      }
      // if (!res.data.image || !res.data.image.filePath || res.data.image.filePath === 'string' || res.data.image.filePath === null ) {
      //   console.log('no image');
      //   this.imagePresent = false;
      // }
      // this.isLoading = false;
      // this.inActive = false;
    }, error => {
      // this.isLoading = false;
      // this.inActive = true;
      this.ngxUiLoader.stopLoader('loader-product-1');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
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





  ngOnDestroy() {

  }


  ionViewWillLeave() {
    this.userRoleGroups = [];
    this.filter.page = 0;
    if (this.challansSub) {
      this.challansSub.unsubscribe();
    }
  }

  doRefresh(event) {
    this.userRoleGroups = [];
    this.filter.page = 0;
    this.getAllRolesGroups();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


}

