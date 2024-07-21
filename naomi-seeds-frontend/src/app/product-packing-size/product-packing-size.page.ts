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

@Component({
  selector: 'app-product-packing-size',
  templateUrl: './product-packing-size.page.html',
  styleUrls: ['./product-packing-size.page.scss'],
})
export class ProductPackingSizePage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.productPackingSize;
  combinedPermissionsDataArray: any[] = []

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;

  productPackingSizeList: any[] = [];
  productId: any;

  products: any;
  product: any;

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
    this.getAllProductsAllDropDown();
    this.productPackingSizeList = [];
  }

  ionViewWillEnter() {

if (this.productId) {
  this.onGetPackingSizesByProductId();
}


  }

  ionViewDidEnter() {

  }

  async getAllProductsAllDropDown() {
    this.active = false;
    this.products=[];
    this.ngxUiLoader.startLoader('loader-product-packing-size-list');
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
        this.ngxUiLoader.stopLoader("loader-product-packing-size-list");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-product-packing-size-list');
      }
    });
  }

  async onProductSelection(event) {
    this.productId = event.value._id;    
    this.onGetPackingSizesByProductId();
  }

  async onGetPackingSizesByProductId() {
    this.isLoading = true;
    this.active = false;
    this.productPackingSizeList = [];
    this.totalCount = 0
    this.ngxUiLoader.startLoader("loader-product-packing-size-list");
    console.log(this.productId, this.productPackingSizeList)
    this.productPackingSizeService.getPackingSizesByProductId(this.productId).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.productPackingSizeList = res.data;
          this.totalCount = res.totalCount;
        } else {
          this.presentToast(res.message || 'No Details Found!!!');
        }
      },
      error: (e) => {
        this.ngxUiLoader.stopLoader("loader-product-packing-size-list");
        this.isLoading = false;
        this.active = true
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.isLoading = false;
        this.active = true
        this.ngxUiLoader.stopLoader("loader-product-packing-size-list");
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
    this.onGetPackingSizesByProductId();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  ionViewDidLeave() {
  }
}
