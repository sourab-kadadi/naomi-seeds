import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, PermissionsCategory, Role } from '../constants/system.const';
import { ProductsService } from '../service/products.service';
import { AuthService } from '../login/auth.service';
import { environment } from '../../environments/environment';
import { StorageService } from '../service/service/storage.service';
import { ZoneAwarePromise } from 'zone.js/dist/zone-evergreen';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserServiceService } from '../service/user-service.service';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';
import { ProductsCategoryService } from '../products-category/service/products-category.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.productsCategory;
  combinedPermissionsDataArray: any[] = []


  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;


  productsCategoryList: any[] = [];


  filter = {
    page: 0,
    count: 10,
    search: '',
  };


  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  private filterTimeOut: any = null;
  constructor(
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public platform: Platform,
    public alertController: AlertController,
    private productsService: ProductsService,
    public ionStorage: StorageService,
    private ngxPermissionsService: NgxPermissionsService,
    private userService: UserServiceService,
    private productsCategoryService: ProductsCategoryService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService
  ) {

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    })

  }

  ngOnInit() {
    this.getAllProductCategories(true);
  }


  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }

  async getAllProductCategories(init?: boolean, infinitScrollEvent?: any) {
    if (init === true) {
      this.ngxUiLoader.startLoader("loader-product-page-category-list");
      this.isLoading = true;
      this.active = false;
    } 
    this.productsCategoryService.getProductsCategory(this.filter).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.productsCategoryList = init ? res.data : [...this.productsCategoryList, ...res.data];
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = false;
          if (this.productsCategoryList.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }
        } else { 
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = true;
          this.presentToast(res.message || 'No Details Found!!!');
        }
      },
      error: (e) => {
        this.ngxUiLoader.stopLoader("loader-product-page-category-list");
        this.isLoading = false;
        this.active = true
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.isLoading = false;
        this.active = true
        this.ngxUiLoader.stopLoader("loader-product-page-category-list");
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
      this.productsCategoryList = [];
      this.infiniteScroll.disabled = false;
      this.getAllProductCategories(true);
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.productsCategoryList = [];
      this.filter.page = 0;
      this.infiniteScroll.disabled = false;
      this.getAllProductCategories(true);
    }, 500);
  }

  ngOnDestroy() {
  }

  doRefresh(event: any) {
    this.productsCategoryList = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.getAllProductCategories(true);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }




  loadData(event: any) {
    this.filter.page = ++this.filter.page;
    this.getAllProductCategories(false, event);
  }

  ionViewDidLeave () {
this.filter.page = 0
  }
}
