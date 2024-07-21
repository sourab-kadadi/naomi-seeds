import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { ProductsService } from '../../service/products.service';
import { AuthService } from '../../login/auth.service';
import { environment } from '../../../environments/environment';
import {UserServiceService } from '../../service/user-service.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  users: any[] = [];
  roles: any[] = [];
  filter = {
    page: 0,
    count: 12,
    search: '',
    role: '',
    // status: false
  };

  isLoading = false;
  inActive = false;
  imagePresent = true;

  s3path: any = environment.s3Url;
  totalCount = 0;
  totalPages = 0;

  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  private filterTimeOut: any = null;
  private searchedItem: any;
  private challansSub: Subscription;
  // loadedProduct: Product[];
  private productsSub: Subscription;


  constructor(
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public platform: Platform,
    public alertController: AlertController,
    private productsService: ProductsService,
    private userServiceService: UserServiceService,
    ) {}

  ngOnInit() {
    // this.getAllProducts();
  }

  ionViewWillEnter() {
    this.getAllProducts();
    this.infiniteScroll.disabled = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }


  async getAllProducts() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-user-1');
    this.challansSub = await this.userServiceService.getAllUser(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-user-1');
      if(res.data) {
        this.users = [...this.users, ...res.data];
      }
      if(res.status === false) {
        this.presentAlert('No Details Found !!!');
      }
      if (this.users.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
      // if (!res.data.image || !res.data.image.filePath || res.data.image.filePath === 'string' || res.data.image.filePath === null ) {
      //   console.log('no image');
      //   this.imagePresent = false;
      // }
      this.isLoading = false;
      this.inActive = false;
    }, error => {
      this.isLoading = false;
      this.inActive = true;
      this.ngxUiLoader.stopLoader('loader-user-1');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }


  async getAllProductsOnScroll(loadMore = false, event?) {
    // this.isLoading = true;
    // this.inActive = true;
    if (loadMore) {
      this.filter.page++;
    }
    // this.ngxUiLoader.startLoader('loader');
    this.challansSub = await this.userServiceService.getAllUser(this.filter).subscribe(res => {
      // this.ngxUiLoader.stopLoader('loader');
      if(res.data) {
        this.users = [...this.users, ...res.data];
      }
      if(res.status === false) {
        this.presentAlert('No Details Found !!!');
      }
      if (event) {
        event.target.complete();
      }
      if (this.users.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
      console.log(res);
      // this.isLoading = false;
      // this.inActive = false;
    }, error => {
      this.isLoading = false;
      this.inActive = true;
      this.ngxUiLoader.stopLoader('loader');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }

//   getRoleHandler( ) {
//     // this.ngxUiLoader.startLoader('loader-user-1');
//     this.userServiceService.getRoles().subscribe(res => {
//       this.roles = res.data;
//       // this.ngxUiLoader.stopLoader('loader-user-1');
//     }, error => {
//       // this.ngxUiLoader.stopLoader('loader-user-1');
//       this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
//     });
// }

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
      this.users = [];
      this.infiniteScroll.disabled = false;
      this.getAllProducts();
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.users = [];
      this.filter.page = 0;
      this.infiniteScroll.disabled = false;
      this.getAllProducts();

    }, 500);
  }

  onDropdownSelection(event1) {
    if (event1.detail.value === 'ALL USERS') {
      this.filter.role = '';
      this.filter.page = 0;
      this.users = [];
      this.infiniteScroll.disabled = false;
      this.getAllProducts();
    } else {
    this.filter.page = 0;
    this.users = [];
    this.infiniteScroll.disabled = false;
    this.filter.role = event1.detail.value;
    this.getAllProducts();
    }
  }



  ionViewWillLeave() {
    this.users = [];
    this.filter.page = 0;
    if (this.challansSub) {
      this.challansSub.unsubscribe();
    }
  }

  doRefresh(event) {
    this.users = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.getAllProducts();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }



}
