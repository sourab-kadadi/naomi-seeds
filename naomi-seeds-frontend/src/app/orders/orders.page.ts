import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, IonDatetime } from '@ionic/angular';
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
import { OrdersService } from './service/orders.service';
import { ProfileManagementService } from '../profile-management/service/profile-management.service';
import { format, parseISO } from 'date-fns';
// import { ProductsLotService } from './service/products-lot.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('selectComponentDistributor') selectComponentDistributor: IonicSelectableComponent;
  @ViewChild('popoverDatetime') popoverDatetime: IonDatetime;
  @ViewChild('popoverDatetime1') popoverDatetime1: IonDatetime;

  userRole: any;
  permissionsDataByPageLocation: any;
  userTypeInternalOrExternal: any;
  pageLocation = PageLocation.salesOrders;
  combinedPermissionsDataArray: any[] = [];

  isLoading = false;
  active = false;
  imagePresent = true;
  serverError = false;
  s3path: any = environment.s3Url;
  totalCount = 0;

  ordersList: any[] = [];
  orderId: any;

  dateFrom: any;
  dateTo: any;


  allotedDistributors: any[] = [];
  selectedDistributor: any;

  // selectedOrderData = {};

  filter = {
    page: 0,
    count: 10,
    selectedDistributorProfileId: '',
    pendingApprovalMyEnd: null,
    managerFinalApproval: '',
    typeOfSale: '',
    dateFrom: null,
    dateTo: null,
    orderStatusSelection: null,
  };

  orderStatusSelection: any;
  orderTypeSelection: any;

  showFilter = false;


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
    private ordersService: OrdersService,
    private profileManagementService: ProfileManagementService,
  ) {
    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e => res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    });
  }

  ngOnInit() {
    // this.getOrdersList = [];
    // this.onGetOrdersAll(true);
  }

  ionViewDidEnter() {
    this.onGetOrdersAll(true);
    this.getAllAllotedDistributorsDropDown();
  }





  async onGetOrdersAll(init?: boolean) {
    if (init === true) {
      this.ngxUiLoader.startLoader('loader-orders-list-page');
      this.isLoading = true;
      this.active = false;
      this.ordersList = [];
      this.totalCount = 0;
      this.filter.page = 0;
    }
    this.ngxUiLoader.startLoader('loader-orders-list-page');
    console.log(this.orderId, this.ordersList);
    this.ordersService.getOrdersList(this.filter).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.ordersList = init ? res.data : [...this.ordersList, ...res.data];
          this.totalCount = res.totalCount;
          if (this.ordersList.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }
        } else {
          this.totalCount = res.totalCount;
          this.infiniteScroll.disabled = true;
          this.presentToast(res.message || 'No Details Found!!!');
        }
      },
      error: (e) => {
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
        this.isLoading = false;
        this.active = true;
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.isLoading = false;
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
      }
    });
  }


  async getAllAllotedDistributorsDropDown() {
    this.active = false;
    this.allotedDistributors = [];
    this.ngxUiLoader.startLoader('loader-orders-list-page');
    this.profileManagementService.getAllDistributorBasedOnAllotmentOfUser().subscribe({
      next: (res) => {
        if (res.data) {
          this.allotedDistributors = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Alloted Distributors Found!!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list-page');
      }
    });
  }


  async onDistributorSelection(event: any) {

    console.log(event);
    this.filter.selectedDistributorProfileId = event.value._id;
    this.onGetOrdersAll(true);
  }

  async orderTypeSelect(event: any) {
    if (event.detail.value === 'ALL') {
      this.filter.typeOfSale = '';
    } else {
      this.filter.typeOfSale = event.detail.value;
    }


    this.onGetOrdersAll(true);
  }


  async orderStatusSelect(event: any) {
    if (event.detail.value === 'PENDING_AT_MY_END') {
      this.filter.pendingApprovalMyEnd = true;
    } else if (event.detail.value === 'ORDER_IN_PROCESS') {
      this.filter.managerFinalApproval = 'PENDING';
      this.filter.pendingApprovalMyEnd = null;
    } else if (event.detail.value === 'COMPLETED') {
      this.filter.pendingApprovalMyEnd = null;
      this.filter.managerFinalApproval = 'APPROVED';
    } else if (event.detail.value === 'ALL') {
     this.filter.pendingApprovalMyEnd = null;
      this.filter.managerFinalApproval = '';
    }
    this.onGetOrdersAll(true);
    this.filter;
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
    this.onGetOrdersAll(true);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadMore(event: any) {
    setTimeout(() => {
      if (this.ordersList.length === this.totalCount) {
        event.target.disabled = true;
        event.target.complete();
      } else {
        this.filter.page++;
        this.onGetOrdersAll();
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
    // this.filter.page = 0
    // this.infiniteScroll.disabled = false;
  }

  formatDateFrom(value: any) {
    const date = format(parseISO(value), 'MMM d, yyyy');
    this.filter.dateFrom = date;
    if (this.filter.dateFrom && this.filter.dateTo) {
      this.onGetOrdersAll(true);
    }
    return date;
  }

  formatDateTo(value: any) {
    const dateTo = format(parseISO(value), 'MMM d, yyyy');
    this.filter.dateTo = dateTo;
    if (this.filter.dateFrom && this.filter.dateTo) {
      this.onGetOrdersAll(true);
    }
    return dateTo;
  }



  removeDate() {
    this.filter.dateFrom = null;
    this.filter.dateTo = null;
    this.onGetOrdersAll(true);
  }


  filterToggle() {
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
      this.filter.typeOfSale = '';
      this.filter.pendingApprovalMyEnd = null;
      this.filter.managerFinalApproval = '';
      this.filter.selectedDistributorProfileId = '';
      this.filter.dateFrom = null;
      this.filter.dateTo = null;
      this.selectedDistributor = null;
      this.orderTypeSelection = null;
      this.onGetOrdersAll(true);
    }
 }


}

