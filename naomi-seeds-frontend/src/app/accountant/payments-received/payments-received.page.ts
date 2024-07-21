import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { SalesService } from '../../service/sales.service';
import { RequirementService } from 'src/app/service/requirement.service';
// import { SalesService } from '../../service/sales.service';
import { AuthService } from '../../login/auth.service';
import { PaymentsReceivedService } from 'src/app/service/payments-received.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-payments-received',
  templateUrl: './payments-received.page.html',
  styleUrls: ['./payments-received.page.scss'],
})
export class PaymentsReceivedPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  toDateMax: string = new Date((new Date()).valueOf() + 1000 * 3600 * 24 * 9).toISOString();
  salesOrders: any[] = [];

  filter = {
    page: 0,
    count: 12,
    search: '',
    approvalStatus: 'PENDING', //PENDING, RECEIVED, REJECTED
    dateFrom: '',
    dateTo: ''
  };

  dateValue: any;
  dateValue1: any;

  dateFrom: any;
  dateTo: any;
  dateChangeTriggered = false;


  fromDateEntered: boolean;
  toDateEntered: boolean;

  salesPersonId: any;
  user: any;
  totalCount = 0;
  totalPages = 0;
  tempDate: any;
  isLoading = false;
  inActive = false;

  private filterTimeOut: any = null;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public searchedItem: any;
  private challansSub: Subscription;

  constructor(private salesService: SalesService,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private auth: AuthService,
    public platform: Platform,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public alertController: AlertController,
    private paymentService: PaymentsReceivedService,

  ) {
    this.searchedItem = this.salesOrders;
    // this.getAllSalesOrders();

  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.getAllSalesOrders();
    this.infiniteScroll.disabled = false;
  }


  ionViewDidEnter() {
    setTimeout(() => {
      this.search.setFocus();
    });
  }

  async getAllSalesOrders() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-payments-service-accountant');
    this.paymentService.getPaymentsReceivedAll(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-payments-service-accountant');
      if(res.data) {
        this.salesOrders = [...this.salesOrders, ...res.data];
      }
      if(res.status === false) {
        this.presentAlert(res.message || 'No Details Found !!!');
      }
      if (this.salesOrders.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
      console.log(res);
      this.isLoading = false;
      this.inActive = false;
    }, error => {
      this.isLoading = false;
      this.inActive = true;
      this.ngxUiLoader.stopLoader('loader-payments-service-accountant');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      console.log(error);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }

  async getAllSalesOrdersOnScroll(loadMore = false, event?) {
    // this.isLoading = true;
    // this.inActive = true;
    if (loadMore) {
      this.filter.page++;
    }
    // this.ngxUiLoader.startLoader('loader-payments-service-accountant');
    this.challansSub = await this.paymentService.getPaymentsReceivedAll(this.filter).subscribe(res => {
      // this.ngxUiLoader.stopLoader('loader-payments-service-accountant');
      if(res.data) {
        this.salesOrders = [...this.salesOrders, ...res.data];
      }
      if(res.status === false) {
        this.presentAlert(res.message || 'No more Details Found !!!');
      }
      if (event) {
        event.target.complete();
      }
      if (this.salesOrders.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
      // this.isLoading = false;
      // this.inActive = false;
    }, error => {
      this.isLoading = false;
      this.inActive = true;
      this.ngxUiLoader.stopLoader('loader-payments-service-accountant');
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

  onSearchChange(event) {
    this.filter.search = event.detail.value;
    if (this.filter.search === '') {
      this.filter.page = 0;
      this.salesOrders = [];
      this.infiniteScroll.disabled = false;
      this.getAllSalesOrders();
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.salesOrders = [];
      this.filter.page = 0;
      this.infiniteScroll.disabled = false;
      this.getAllSalesOrders();

    }, 500);
  }




  ionViewWillLeave() {
    this.salesOrders = [];
    this.filter.page = 0;
    if (this.challansSub) {
      this.challansSub.unsubscribe();
    }
  }

  doRefresh(event) {
    this.salesOrders = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.getAllSalesOrders();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onDropdownSelectionStatus(event1) {
    if (event1.detail.value === 'ALL') {
      this.filter.approvalStatus = '';
      this.filter.page = 0;
      this.salesOrders = [];
      this.infiniteScroll.disabled = false;
      this.getAllSalesOrders();
    } else {
      this.filter.page = 0;
    this.salesOrders = [];
    this.infiniteScroll.disabled = false;
    this.filter.approvalStatus = event1.detail.value;
    this.getAllSalesOrders();
    }
  }


//   formatDateFrom(value: string) {
//     this.fromDateEntered = true;
//     const date = format(parseISO(value), 'MMM d, yyyy');
//     this.filter.dateFrom = date;
//     return date;
//   }

//   formatDateTo(value: string) {
//     this.toDateEntered = true;
//     const date = format(parseISO(value), 'MMM d, yyyy');
// this.filter.dateTo = date;
//     return date;
//   }




  formatDate(value: string) {
    const dateValue = format(parseISO(value), 'MMM d, yyyy');
    this.filter.dateFrom = value.replace('+05:30', '.000Z').split('T')[0];
    // this.filter.fromDate ="2022-07-02T00:00:00.000Z" ;
this.dateChangeTriggered = true;
    if (this.filter.dateFrom && this.filter.dateTo) {
      this.filter.page = 0;
      this.salesOrders = [];
      this.infiniteScroll.disabled = false;
      this.getAllSalesOrders();
      console.log(this.filter, 'from');
    }
    // console.log(this.popoverDatetime1);
    return dateValue;
  }



  formatDate1(value1: string) {
    const dateValue1 = format(parseISO(value1), 'MMM d, yyyy');
this.filter.dateTo = value1.replace('+05:30', '.000Z').split('T')[0];

    this.dateChangeTriggered = true;
    if (this.filter.dateFrom && this.filter.dateTo) {
       this.filter.page = 0;
      this.salesOrders = [];
      this.infiniteScroll.disabled = false;

      this.getAllSalesOrders();
      // console.log(this.popoverDatetime1);
      // this.popoverDatetime1.confirm();
      console.log(this.filter, 'to');
    }


    return dateValue1;
  }

}
