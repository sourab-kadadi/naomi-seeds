import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { SalesService } from '../../service/sales.service';
import { AuthService } from '../../login/auth.service';
import { RequirementService } from 'src/app/service/requirement.service';
import { PaymentsReceivedService } from 'src/app/service/payments-received.service';

@Component({
  selector: 'app-payments-received',
  templateUrl: './payments-received.page.html',
  styleUrls: ['./payments-received.page.scss'],
})
export class PaymentsReceivedPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  salesOrders: any[] = [];

  filter = {
    page: 0,
    count: 12,
    search: '',
    approvalStatus: 'PENDING', //PENDING, RECEIVED, REJECTED
  };

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
    this.ngxUiLoader.startLoader('loader-payments-service');
    this.paymentService.getPaymentsReceivedAll(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-payments-service');
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
      this.ngxUiLoader.stopLoader('loader-payments-service');
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
    // this.ngxUiLoader.startLoader('loader-payments-service');
    this.challansSub = await this.paymentService.getPaymentsReceivedAll(this.filter).subscribe(res => {
      // this.ngxUiLoader.stopLoader('loader-payments-service');
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
      this.ngxUiLoader.stopLoader('loader-payments-service');
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





}
