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
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../constants/system.const';
import { DashboardService } from 'src/app/service/dashboard.service';
import { LedgerService } from './service/ledger.service';
// import {DateTime } from 'ionic-angular';
// import { DistributorsService } from '../../service/distributors.service';
// import { LedgerService } from '../../service/ledger.service';

@Component({
  selector: 'app-account-statements',
  templateUrl: './account-statements.page.html',
  styleUrls: ['./account-statements.page.scss'],
})
export class AccountStatementsPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  @ViewChild('selectComponentFrom') selectComponentFrom: IonicSelectableComponent;


  dateFrom: string;
  dateTo: string;
  dateValue: any;
  dateValue1: any;
  // distributors: any[];
  distributor: any;

  toDateMax: string = new Date((new Date()).valueOf() + 1000 * 3600 * 24 * 9).toISOString();

    // loaders etc
    dateChangeTriggered = false;
    slideChangeTriggered = false;

    // showOverView = false;
    // showInvoices = false;
    // showCreditNotes = false;
    // showPaymentsDone = false;
    // showProductPurchases = false;


  filter = {
    search: '',
    statementProfileIdRequired: ''
    // status: false
  };

ledgerEntries: any[] =[];
info: any;

  private filterTimeOut: any = null;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public searchedItem: any;
    constructor(
      private route: Router,
      public navCtrl: NavController,
      private modalController: ModalController,
      public platform: Platform,
      // private distributorsService: DistributorsService,
      private ngxUiLoader: NgxUiLoaderService,
      public toastController: ToastController,
      public alertController: AlertController,
      private dashboardService: DashboardService,
      private ledgerService: LedgerService) { }

  ngOnInit() {
    // this.getAllDistributors();
  }


  ionViewWillEnter() {
    this.getAllLedgerEntries();
    // this.infiniteScroll.disabled = false;
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

  // async getAllDistributors() {
  //   // this.ngxUiLoader.startLoader('loader-create-salesOrder');
  //   this.distributorsService.getDistributors().subscribe(res => {
  //     this.distributors = res.data;
  //     // this.toDistributors = res.data;
  //     // this.ngxUiLoader.stopLoader('loader-create-salesOrder');
  //   }, error => {
  //     // this.ngxUiLoader.stopLoader('loader-create-salesOrder');
  //     this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  //   });
  // }

  distributorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
this.filter.statementProfileIdRequired=event.value._id

this.getAllLedgerEntries();

console.log('triggered in salesorder');
  }
//   formatDate(value: string) {
//     const dateValue = format(parseISO(value), 'MMM d, yyyy');
//     this.dateFrom = value.replace('+05:30', '.000Z').split('T')[0];

//     // this.filter.fromDate ="2022-07-02T00:00:00.000Z" ;
// this.dateChangeTriggered = true;
//     if (this.dateFrom && this.dateTo && this.segment ===0) {
//       this.getDistributorSummary();
//       console.log(this.filter, 'from');
//     }
//     // console.log(this.popoverDatetime1);
//     return dateValue;
//   }

//   formatDate1(value1: string) {
//     const dateValue1 = format(parseISO(value1), 'MMM d, yyyy');


//     this.dateTo = value1.replace('+05:30', '.000Z').split('T')[0];
//     this.dateChangeTriggered = true;
//     // this.filter.toDate = "2022-07-08T00:00:00.000Z";
//     if (this.dateFrom && this.dateTo && this.segment ===0) {
//       this.getDistributorSummary();
//       // console.log(this.popoverDatetime1);
//       // this.popoverDatetime1.confirm();
//       console.log(this.filter, 'to');
//     }


//     return dateValue1;
//   }

//   doRefresh(event) {
//     if (this.segment === 0) {
//       // this.invoiceData = [];
//       // this.filterInvoice.page = 0;
//       // this.infiniteScroll.disabled = false;
//       this.getDistributorSummary();
//     }


//     if (this.segment === 1) {
//     this.invoiceData =  [];
//     this.filterInvoice.page = 0;
//     this.infiniteScroll.disabled = false;
//     this.getDashboardDataInvoice();
//   }

//   if (this.segment === 2) {
//     this.creditNoteData = [];
//     this.filterCreditNote.page = 0;
//     this.infiniteScroll.disabled = false;
//     this.getDashboardDataCreditNote();
//   }


//     setTimeout(() => {
//       event.target.complete();
//     }, 1000);
//   }


async getAllLedgerEntries() {
  this.ledgerEntries = [];
  // this.isLoading = true;
  // this.inActive = true;
  // this.ngxUiLoader.startLoader('loader-requirementService');
  this.ledgerService.getLedgerEntries(this.filter).subscribe(res => {
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







}
