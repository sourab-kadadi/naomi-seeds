import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonSlides, IonDatetime } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { format, parseISO } from 'date-fns';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { DashboardService } from 'src/app/service/dashboard.service';
import { LedgerService } from 'src/app/service/ledger.service';
import { GeneralDropdownsService } from 'src/app/service/general-dropdowns.service';
// import {DateTime } from 'ionic-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  // @ViewChild('popoverDatetime') popoverDatetime;
  // @ViewChild('popoverDatetime1', { static: true }) popoverDatetime1: IonDatetime;
  // @ViewChild('popoverDatetime') popoverDatetime: IonDatetime;

  invoiceData: any[] = [];
creditNoteData: any[] = [];
productsPurchasedData: any[] = [];
ledgerEntries: any[] = [];

ledgerDropDowns: any[];
ledgerDropDown: any;

  segment = 0;

  info: any;

  dateFrom: string;
  dateTo: string;
  filter = {
    page: 0,
    count: 12,
    search: '',
    type: '',
  };

  filterInvoice = {
    page: 0,
    count: 9,
    search: '',
    type: 'INVOICE',
  };

  filterCreditNote = {
    page: 0,
    count: 12,
    search: '',
    type: 'CREDIT_NOTE',
  };

  filterNetProductsPurchased = {
    page: 0,
    count: 10,
    search: '',
    type: '',
  };

filterLedger = {
  search: '',
  particularType: ''
};


  dateValue: any;
  dateValue1: any;


  toDateMax: string = new Date((new Date()).valueOf() + 1000 * 3600 * 24 * 9).toISOString();


  // loaders etc
  dateChangeTriggered = false;
  slideChangeTriggered = false;

  showOverView = false;
  showProductPurchases = false;
  showInvoices = false;
  showCreditNotes = false;
  showPaymentsDone = false;



  /////// for Distributor////////
  dashboardSummary: any;

  private filterTimeOut: any = null;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public searchedItem: any;
  constructor(
    private route: Router,
    public navCtrl: NavController,
    private modalController: ModalController,
    public platform: Platform,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public alertController: AlertController,
    private ledgerService: LedgerService,
    private dashboardService: DashboardService,
    private generalDropdownsService: GeneralDropdownsService,

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getDistributorSummary();

  }

  ionViewDidEnter() {

  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
    console.log('side', this.segment);

if (this.segment === 0 && this.dateChangeTriggered === true) {
  await this.getDistributorSummary();
} else if (this.segment === 1) {
  //   this.invoiceData = [];
  // this.filterInvoice.page = 0;
  await this.getDistributorDashboardProductsPurchased();

  // await this.getDashboardDataInvoice();
} else if (this.segment === 2) {
  this.ledgerEntries = [];
  this.filterCreditNote.page = 0;
  await this.getAllActiveLedgerDistributorDropDown();
await this.getAllLedgerEntries();


} else if (this.segment === 3) {


  this.creditNoteData = [];
  this.filterCreditNote.page = 0;
await this. getDashboardDataCreditNote();
} else if (this.segment === 4) {

}

  }


  async segmentChanged() {
    await this.slider.slideTo(this.segment);
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

  // doRefresh(event) {
  //   this.invoiceData = [];
  //   this.filter.page = 0;
  //   this.infiniteScroll.disabled = false;
  //   this.getAllSalesOrders();
  //   setTimeout(() => {
  //     event.target.complete();
  //   }, 1000);
  // }

  formatDate(value: string) {
    const dateValue = format(parseISO(value), 'MMM d, yyyy');
    this.dateFrom = value.replace('+05:30', '.000Z').split('T')[0];

    // this.filter.fromDate ="2022-07-02T00:00:00.000Z" ;
this.dateChangeTriggered = true;
this.slideChanged();
    if (this.dateFrom && this.dateTo && this.segment ===0) {
      this.getDistributorSummary();
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
      this.slideChanged();
    if (this.dateFrom && this.dateTo && this.segment ===0) {
      this.getDistributorSummary();
      // console.log(this.popoverDatetime1);
      // this.popoverDatetime1.confirm();
      console.log(this.filter, 'to');
    }


    return dateValue1;
  }

  doRefresh(event) {
    if (this.segment === 0) {
      // this.invoiceData = [];
      // this.filterInvoice.page = 0;
      // this.infiniteScroll.disabled = false;
      this.getDistributorSummary();
    }


    if (this.segment === 1) {
    this.invoiceData =  [];
    this.filterInvoice.page = 0;
    this.infiniteScroll.disabled = false;
    this.getDashboardDataInvoice();
  }

  if (this.segment === 2) {
    this.creditNoteData = [];
    this.filterCreditNote.page = 0;
    this.infiniteScroll.disabled = false;
    this.getDashboardDataCreditNote();
  }


    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }





//////segment 1//////

  async getDistributorSummary() {
    this.showOverView = false;
    // this.inActive = true;
    this.ngxUiLoader.startLoader('loader-distributor-dashboard');
    this.ledgerService.getDistributorSummary(this.dateFrom, this.dateTo).subscribe(res => {
      this.dashboardSummary = res.data;
      this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
      if (res && res.status === true) {
        this.showOverView = true;
        this.presentToast(res.message || MessageLib.DASHBOARD_SUMMARY_SUCCESS);
        return;
      }
      if (res && res.status === false) {
        this.showOverView = false;
        this.presentAlert(res.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        return;
      }
    }, error => {
      this.showOverView = false;
      this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }



// ionViewWillLeave() {
//   this.invoiceData = [];
//   this.filter.page = 0;
// }





  // onResetDateRange() {
  // console.log(popoverDatetime1);
  // console.log(this.popoverDatetime);
  // this.popoverDatetime1.reset();
  // }



// ///////segment 1 net products purchased/////
async getDistributorDashboardProductsPurchased() {

 // eslint-disable-next-line max-len
 this.dashboardService.getDistributorDashboardProductsPurchased(this.filterNetProductsPurchased, this.dateFrom, this.dateTo).subscribe(res => {
  this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
console.log(res.data)
this.productsPurchasedData = res.data;

  // if (res && res.status === true) {
  //   this.showInvoices = true;
  //   this.presentToast(res.message || MessageLib.DASHBOARD_INVOICE_SUCCESS);
  // }
  // if(res.data && res.data.length>0) {
  //   this.invoiceData = [...this.invoiceData, ...res.data];
  // console.log(this.invoiceData);
  // }
  // if(res.status === false) {
  //   this.presentAlert(res.message || 'No Details Found !!!');
  //   return;
  // }
  // if (this.invoiceData.length === res.totalCount) {
  //   this.infiniteScroll.disabled = true;
  // }
}, error => {
  this.showInvoices = false;
  this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
  // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
  this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
});
}


///////segment 2 account statments///////
async getAllLedgerEntries() {
  this.ledgerEntries = [];
  // this.isLoading = true;
  // this.inActive = true;
  // this.ngxUiLoader.startLoader('loader-requirementService');
  this.ledgerService.getLedgerSummaryDistributor(this.filterLedger, this.dateFrom, this.dateTo).subscribe(res => {
    // this.ngxUiLoader.stopLoader('loader-requirementService');
    // console.log(res);
    if(res.data) {
      this.ledgerEntries = [...this.ledgerEntries, ...res.data];
    }
    if(res.info) {
      this.info = res.info;
      console.log(this.info, 'info');
      console.log(this.info.openingAccountStatementAmount, 'this.info.openingAccountStatementAmount');
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
    }
    // if (this.ledgerEntries.length === res.totalCount) {
      // this.infiniteScroll.disabled = true;
    // }
    console.log(this.ledgerEntries);

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


////////invoice slide//////

async getDashboardDataInvoice() {
  console.log('invoice triggered');
  this.showInvoices = false;
  this.ngxUiLoader.startLoader('loader-distributor-dashboard');
  this.dashboardService.getDistributorDashboardData(this.filterInvoice, this.dateFrom, this.dateTo).subscribe(res => {
    this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
    if (res && res.status === true) {
      this.showInvoices = true;
      this.presentToast(res.message || MessageLib.DASHBOARD_INVOICE_SUCCESS);
    }
    if(res.data && res.data.length>0) {
      this.invoiceData = [...this.invoiceData, ...res.data];
    console.log(this.invoiceData);
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
      return;
    }
    if (this.invoiceData.length === res.totalCount) {
      this.infiniteScroll.disabled = true;
    }
  }, error => {
    this.showInvoices = false;
    this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}

async getDashboardDataInvoiceOnScroll(loadMore = false, event?) {
  // this.showInvoices = true
  // this.inActive = true;
  if (loadMore) {
    this.filterInvoice.page++;
  }
  // this.ngxUiLoader.startLoader('loader');
  this.dashboardService.getDistributorDashboardData(this.filterInvoice, this.dateFrom, this.dateTo).subscribe(res => {
    // this.ngxUiLoader.stopLoader('loader');
    if(res.data && res.data.length>0) {
      this.invoiceData = [...this.invoiceData, ...res.data];
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No more Details Found !!!');
      return;
    }
    if (event) {
      event.target.complete();
    }
    if (this.invoiceData.length === res.totalCount) {
      this.infiniteScroll.disabled = true;
    }
    // this.isLoading = false;
    // this.inActive = false;
  }, error => {
    this.showInvoices = false;
    this.ngxUiLoader.stopLoader('loader');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}


onSearchChangeInvoice(event) {
  this.filterInvoice.search = event.detail.value;
  if (this.filterInvoice.search === '') {
    this.filterInvoice.page = 0;
    this.invoiceData = [];
    this.infiniteScroll.disabled = false;
    this.getDashboardDataInvoice();
    return;
  }
  if (this.filterTimeOut) {
    this.filterTimeOut = clearTimeout(this.filterTimeOut);
  }
  this.filterTimeOut = setTimeout(() => {
    this.invoiceData = [];
    this.filterInvoice.page = 0;
    this.infiniteScroll.disabled = false;
    this.getDashboardDataInvoice();

  }, 500);
}



// ////////// Credit Note
async getDashboardDataCreditNote() {
  console.log('invoice triggered');
  this.showCreditNotes = false;
  this.ngxUiLoader.startLoader('loader-distributor-dashboard');
  this.dashboardService.getDistributorDashboardData(this.filterCreditNote, this.dateFrom, this.dateTo).subscribe(res => {
    this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
    if (res && res.status === true) {
      this.showCreditNotes = true;
      this.presentToast(res.message || MessageLib.DASHBOARD_CREDIT_NOTE_SUCCESS);
    }
    if(res.data && res.data.length>0) {
      this.creditNoteData = [...this.creditNoteData, ...res.data];
    console.log(this.creditNoteData);
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
      return;
    }
    if (this.creditNoteData.length === res.totalCount) {
      this.infiniteScroll.disabled = true;
    }
  }, error => {
    this.showCreditNotes = false;
    this.ngxUiLoader.stopLoader('loader-distributor-dashboard');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}

async getDashboardDataCreditNoteOnScroll(loadMore = false, event?) {
  // this.showCreditNotes = true
  // this.inActive = true;
  if (loadMore) {
    this.filterCreditNote.page++;
  }
  // this.ngxUiLoader.startLoader('loader');
  this.dashboardService.getDistributorDashboardData(this.filterCreditNote, this.dateFrom, this.dateTo).subscribe(res => {
    // this.ngxUiLoader.stopLoader('loader');
    if(res.data && res.data.length>0) {
      this.creditNoteData = [...this.creditNoteData, ...res.data];
    }
    if(res.status === false) {
      this.presentAlert(res.message || 'No more Details Found !!!');
      return;
    }
    if (event) {
      event.target.complete();
    }
    if (this.creditNoteData.length === res.totalCount) {
      this.infiniteScroll.disabled = true;
    }
    // this.isLoading = false;
    // this.inActive = false;
  }, error => {
    this.showCreditNotes = false;
    this.ngxUiLoader.stopLoader('loader');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}


onSearchChangeCreditNote(event) {
  this.filterCreditNote.search = event.detail.value;
  if (this.filterCreditNote.search === '') {
    this.filterCreditNote.page = 0;
    this.creditNoteData = [];
    this.infiniteScroll.disabled = false;
    this.getDashboardDataCreditNote();
    return;
  }
  if (this.filterTimeOut) {
    this.filterTimeOut = clearTimeout(this.filterTimeOut);
  }
  this.filterTimeOut = setTimeout(() => {
    this.creditNoteData = [];
    this.filterCreditNote.page = 0;
    this.infiniteScroll.disabled = false;
    this.getDashboardDataCreditNote();

  }, 500);
}







async onChangeDropDowns(event){
  this.filterLedger.particularType = event.value.name;
this.getAllLedgerEntries();

}




async getAllActiveLedgerDistributorDropDown() {
  this.ngxUiLoader.startLoader('loader-create-requirement');
  this.generalDropdownsService.findActiveLedgerDistributorCategoryDropDown().subscribe(res => {
    this.ledgerDropDowns = res.data;
    console.log(res.data);
    this.ngxUiLoader.stopLoader('loader-create-requirement');
  }, error => {
    this.ngxUiLoader.stopLoader('loader-create-requirement');
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}


onResetDateRange() {
  this.dateFrom = '';
  this.dateTo = '';
  this.dateValue = '';
  this.dateValue1 = '';

  this.slideChanged();

}

}










