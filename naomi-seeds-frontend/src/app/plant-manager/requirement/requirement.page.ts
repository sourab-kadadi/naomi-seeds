import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { SalesService } from '../../service/sales.service';
import { AuthService } from '../../login/auth.service';
import { RequirementService } from 'src/app/service/requirement.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.page.html',
  styleUrls: ['./requirement.page.scss'],
})
export class RequirementPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  salesOrders: any[] = [];
  salesOrdersSummary: any[] = [];
  requirementDataSummary: any[] = [];
  segment = 0;

  filter = {
    page: 0,
    count: 12,
    search: '',
    dispatchedStatus: 'PENDING', //PENDING, DISPATCHED, REJECTED
  };

  filterOverview = {
    page: 0,
    count: 12,
    search: ''
  };

  dateFrom: string;
  dateTo: string;
  dateValue: any;
  dateValue1: any;

  salesPersonId: any;
  user: any;
  totalCount = 0;
  totalPages = 0;
  tempDate: any;
  isLoading = false;
  inActive = false;

  dateChangeTriggered = false;
  slideChangeTriggered = false;

  showOverView = false;
  showDistWise = true;

  dashboardSummary: any;

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
    private requirementService: RequirementService
  ) {
    this.searchedItem = this.salesOrders;
    // this.getAllSalesOrders();

  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.getAllSalesOrders();
    // this.infiniteScroll.disabled = false;
  }


  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
    console.log('side', this.segment);
if (this.segment === 0 ) {
  this.showDistWise = true;
  this.filter.page = 0;
  this.salesOrders = [];
  await this.getAllSalesOrders();
} else if (this.segment === 1) {
  this.showOverView = true;
    this.requirementDataSummary = [];
  this.filterOverview.page = 0;
  await this.getOverView();
// } else if (this.segment === 2) {
//   this.creditNoteData = [];
//   this.filterCreditNote.page = 0;
// await this. getDashboardDataCreditNote();
// } else if (this.segment === 3) {

// } else if (this.segment === 4) {

// }

  }}


  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }









  ionViewDidEnter() {
    // setTimeout(() => {
    //   this.search.setFocus();
    // });
  }

  async getAllSalesOrders() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-requirementService');
    this.requirementService.findAll(this.filter, this.dateFrom, this.dateTo).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-requirementService');
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
      this.ngxUiLoader.stopLoader('loader-requirementService');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }

  async getAllSalesOrdersOnScroll(loadMore = false, event?) {
    // this.isLoading = true;
    // this.inActive = true;
    if (loadMore) {
      this.filter.page++;
    }
    // this.ngxUiLoader.startLoader('loader-requirementService');
    this.challansSub = await this.requirementService.findAll(this.filter, this.dateFrom, this.dateTo).subscribe(res => {
      // this.ngxUiLoader.stopLoader('loader-requirementService');
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
      this.ngxUiLoader.stopLoader('loader-requirementService');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }

// overview start

async getOverView() {
  // this.isLoading = true;
  // this.inActive = true;
  // this.ngxUiLoader.startLoader('loader-requirementService');
  this.requirementService.findAllOverView(this.filterOverview, this.dateFrom, this.dateTo).subscribe(res => {
    // this.ngxUiLoader.stopLoader('loader-requirementService');
    if(res.data) {
      this.requirementDataSummary = [...this.requirementDataSummary, ...res.data];
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
    }
    // if (this.salesOrders.length === res.totalCount) {
    //   this.infiniteScroll.disabled = true;
    // }
    console.log(res);
    // this.isLoading = false;
    // this.inActive = false;
  }, error => {
    // this.isLoading = false;
    // this.inActive = true;
    // this.ngxUiLoader.stopLoader('loader-requirementService');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}

async getOverViewOnScroll(loadMore = false, event?) {
  // this.isLoading = true;
  // this.inActive = true;
  if (loadMore) {
    this.filter.page++;
  }
  // this.ngxUiLoader.startLoader('loader-requirementService');
  this.challansSub = await this.requirementService.findAllOverView(this.filterOverview, this.dateFrom, this.dateTo).subscribe(res => {
    // this.ngxUiLoader.stopLoader('loader-requirementService');
    if(res.data) {
      this.requirementDataSummary = [...this.requirementDataSummary, ...res.data];
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
    this.ngxUiLoader.stopLoader('loader-requirementService');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}


// overview wnd
































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

  onSearchChangeOverView(event) {
    this.filterOverview.search = event.detail.value;
    if (this.filterOverview.search === '') {
      this.filterOverview.page = 0;
      this.requirementDataSummary = [];
      this.infiniteScroll.disabled = false;
      this.getOverView();
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.requirementDataSummary = [];
      this.filterOverview.page = 0;
      this.infiniteScroll.disabled = false;
      this.getOverView();

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
      this.filter.dispatchedStatus = '';
      this.filter.page = 0;
      this.salesOrders = [];
      this.infiniteScroll.disabled = false;
      this.getAllSalesOrders();
    } else {
      this.filter.page = 0;
    this.salesOrders = [];
    this.infiniteScroll.disabled = false;
    this.filter.dispatchedStatus = event1.detail.value;
    this.getAllSalesOrders();
    }
  }


  formatDate(value: string) {
    const dateValue = format(parseISO(value), 'MMM d, yyyy');
    this.dateFrom = value.replace('+05:30', '.000Z').split('T')[0];

    // this.filter.fromDate ="2022-07-02T00:00:00.000Z" ;
this.dateChangeTriggered = true;
    if (this.dateFrom && this.dateTo && this.segment ===0) {
      this.getAllSalesOrders();
      console.log(this.filter, 'from');
    }
    // console.log(this.popoverDatetime1);
    return dateValue;
  }

  formatDate1(value1: string) {
    const dateValue1 = format(parseISO(value1), 'MMM d, yyyy');


    this.dateTo = value1.replace('+05:30', '.000Z').split('T')[0];
    this.dateChangeTriggered = true;
    // this.filter.toDate = "2022-07-08T00:00:00.000Z";
    if (this.dateFrom && this.dateTo && this.segment ===0) {
      this.getAllSalesOrders();
      // console.log(this.popoverDatetime1);
      // this.popoverDatetime1.confirm();
      console.log(this.filter, 'to');
    }


    return dateValue1;
  }


}
