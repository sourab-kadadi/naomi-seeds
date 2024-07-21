import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, PermissionsCategory, Role } from '../constants/system.const';
import { AuthService } from '../login/auth.service';
import { environment } from '../../environments/environment';
import { StorageService } from '../service/service/storage.service';
import { ZoneAwarePromise } from 'zone.js/dist/zone-evergreen';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserServiceService } from '../service/user-service.service';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';
import { ProductsCategoryService } from '../products-category/service/products-category.service';
import { ProductPackingSizeService } from '../product-packing-size/service/product-packing-size.service';
import { ProductService } from '../product/service/product.service';
import { ProductsLotService } from './service/products-lot.service';

@Component({
  selector: 'app-products-lot-page',
  templateUrl: './products-lot-page.page.html',
  styleUrls: ['./products-lot-page.page.scss'],
})
export class ProductsLotPagePage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
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

  productsLotList: any[] = [];
  productId: any;

  productPackingSizeId: any;

  products: any;
  product: any;

  filter = {
    page: 0,
    count: 8,
    productId: '',
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
    public ionStorage: StorageService,
    private ngxPermissionsService: NgxPermissionsService,
    private userService: UserServiceService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
    private productPackingSizeService: ProductPackingSizeService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private productsLotService: ProductsLotService
  ) {
    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    })
  }

  ngOnInit() {
    this.productId='';
    this.productPackingSizeId = '';
    this.getAllProductsAllDropDown();
    this.productsLotList = [];
  }

  ionViewWillEnter() {

if (this.productId) {
  // this.onGetPackingSizesByProductId();
}
this.infiniteScroll.disabled = false;

  }

  ionViewDidEnter() {

  }

  async getAllProductsAllDropDown() {
    this.active = false;
    this.products=[];
    this.ngxUiLoader.startLoader('loader-product-lot-data');
    this.productService.getProductAllDropDown().subscribe({
      next: (res) => {
        if (res.data) {
          this.products = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-product-lot-data");
        this.presentAlert(e.message || e.error.message ||  MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-lot-data');
      }
    });
  }

  async onProductSelection(event: any) {
    this.productId = event.value._id;    
    this.filter.productId = event.value._id;

    this.onGetLotDataAll(true);
  }






























  
  async onGetLotDataAll(init?: boolean) {
    if (init === true) {
      this.ngxUiLoader.startLoader("loader-product-page-list");
      this.isLoading = true;
      this.active = false;
      this.productsLotList = [];
      this.totalCount = 0
      this.filter.page = 0;
    }
    console.log('1')
    this.ngxUiLoader.startLoader("loader-product-lot-data");
    console.log(this.productId, this.productsLotList)
    this.productsLotService.getAllLotData(this.filter).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.productsLotList = init ? res.data : [...this.productsLotList, ...res.data];
          console.log(this.productsLotList)
          this.totalCount = res.totalCount;
          console.log('2')
          if (this.productsLotList.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }
        } else {
          console.log('3')
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = true;
          this.presentToast(res.message || 'No Details Found!!!');
        }
      },
      error: (e) => {
        this.ngxUiLoader.stopLoader("loader-product-lot-data");
        this.isLoading = false;
        this.active = true
        this.presentAlert(e.message || e.error.message ||  MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.isLoading = false;
        this.active = true
        this.ngxUiLoader.stopLoader("loader-product-lot-data");
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

  ngOnDestroy() {
  }


  doRefresh(event: any) {
    this.infiniteScroll.disabled = false;
    this.onGetLotDataAll(true);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadMore(event: any) {
    setTimeout(() => {
      if (this.productsLotList.length === this.totalCount) {
        event.target.disabled = true;
        event.target.complete();
      } else {
        this.filter.page++;
        this.onGetLotDataAll();
        event.target.complete();
      }
    }, 500);

  }

  onScroll(event: any) {
    const threshold = 100;
    const y = event.detail.scrollTop;
    const contentHeight = event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    if (scrollHeight - y - threshold <= contentHeight) {
      this.loadMore(event);
    }
  }

  ionViewDidLeave() {
    this.filter.page = 0
    this.infiniteScroll.disabled = false;
  }
}
