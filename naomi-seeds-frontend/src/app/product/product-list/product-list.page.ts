import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, PermissionsCategory, Role } from '../../constants/system.const';
import { AuthService } from '../../login/auth.service';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../service/service/storage.service';
import { ZoneAwarePromise } from 'zone.js/dist/zone-evergreen';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserServiceService } from '../../service/user-service.service';
import { PermissionsDataBehaviourSubjectService } from '../../service/permissions-data-behaviour-subject.service';
import { ProductsCategoryService } from '../../products-category/service/products-category.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.products;
  combinedPermissionsDataArray: any[] = []

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;

  productsList: any[] = [];
  productCategoryId: any;

  filter = {
    page: 0,
    count: 10,
    search: '',
    productCategoryId: ''
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
    private productsCategoryService: ProductsCategoryService,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {

    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    })

    this.filter.productCategoryId = this.route.snapshot.paramMap.get('productCategoryId');
  }

  ngOnInit() {
    this.getAllProducts(true);
  }

  ionViewWillEnter() {
    this.infiniteScroll.disabled = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }

  async getAllProducts(init?: boolean) {
    if (init === true) {
      this.ngxUiLoader.startLoader("loader-product-page-list");
      this.isLoading = true;
      this.active = false;
    }
    this.productService.getProducts(this.filter).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.productsList = init ? res.data : [...this.productsList, ...res.data];
          this.totalCount = res.totalCount;
          if (this.productsList.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }
        } else {
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = true;
          this.presentToast(res.message || 'No Details Found!!!');
        }
      },
      error: (e) => {
        this.ngxUiLoader.stopLoader("loader-product-page-list");
        this.isLoading = false;
        this.active = true
        this.presentAlert(e.message || e.error.message ||  MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.isLoading = false;
        this.active = true
        this.ngxUiLoader.stopLoader("loader-product-page-list");
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
      this.productsList = [];
      this.infiniteScroll.disabled = false;
      this.getAllProducts(true);
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.productsList = [];
      this.filter.page = 0;
      this.infiniteScroll.disabled = false;
      this.getAllProducts(true);
    }, 500);
  }

  ngOnDestroy() {
  }

  doRefresh(event: any) {
    this.productsList = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.getAllProducts(true);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadMore(event: any) {
    setTimeout(() => {
      if (this.productsList.length === this.totalCount) {
        event.target.disabled = true;
        event.target.complete();
      } else {
        this.filter.page++;
        this.getAllProducts();
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
