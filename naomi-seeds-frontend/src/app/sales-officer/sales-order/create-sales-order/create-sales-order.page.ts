import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

// import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController, IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';

import { Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { DistributorsService } from '../../../service/distributors.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SalesPersonService } from '../../../service/sales-person.service';
import { ProductsService } from '../../../service/products.service';
import { SalesService } from '../../../service/sales.service';
import { AuthService } from '../../../login/auth.service';
import { CartItemService } from '../../../service/cart-item.service';
// import { CartItemInvoiceService } from '../../service/cart-item-invoice.service';

@Component({
  selector: 'app-create-sales-order',
  templateUrl: './create-sales-order.page.html',
  styleUrls: ['./create-sales-order.page.scss'],
})
export class CreateSalesOrderPage implements OnInit, OnDestroy {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild('selectComponentFrom') selectComponentFrom: IonicSelectableComponent;
  @ViewChild('selectComponentTo') selectComponentTo: IonicSelectableComponent;

  dateValue: any;
  user: any;
  userSalesPersonId: any;
  userSalesPersonName: any;

itemsAlreadySubmitted = false;

  modelForm: any = this.formBuilder.group({
    fromDistributorId: ['', [Validators.required]],
    fromDistributorName: ['', [Validators.required]],
    toDistributorId: ['', [Validators.required]],
    toDistributorName: ['', [Validators.required]],
    salesOrderDate: ['', [Validators.required]],
    items: this.formBuilder.array([]),
    totalUnits: ['', [Validators.required]],
    totalQuantity: ['', [Validators.required]],
    totalValue: ['', [Validators.required]],
    rrOrLrNum: ['', [Validators.required]],
    vehicleNo: ['', [Validators.required]],
    transport: ['', [Validators.required]],
    freightTotal: ['', [Validators.required]],
    frightPaidAdvance: ['', [Validators.required]],
  });



  itemsCart: any;

  distributors: any[];
  distributor: any;
  toDistributors: any[];
  toDistributor: any;
  salesPersons: any[];
  salesPerson: any;
  lineItem: any;
  model: any = {};


  public itemsPresent = false;
  loadedItems: any;
  private cartSub: Subscription;
  private distributorsSub: Subscription;
  private salesPersonSub: Subscription;
  constructor(private router: Router,
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    private cartItemService: CartItemService,
    private distributorsService: DistributorsService,
    private salesPersonService: SalesPersonService,
    private challanService: SalesService,
    private auth: AuthService,
    public alertController: AlertController,
    private ngxUiLoader: NgxUiLoaderService,
    private toastController: ToastController

  ) {

  }

  ngOnInit() {

    this.modelForm.reset();
    this.getAllDistributors();

    // this.getAllSalesPersons();
    //     this.user = this.auth.jwtDecoder();
    //     this.userSalesPersonId = this.user.userId;
    //     this.userSalesPersonName = this.user.firstName + ' ' + this.user.lastName;
    // console.log('user', this.user);
    // console.log('username', this.userSalesPersonName);


    // this.modelForm.patchValue({

    //   salesPersonId: this.userSalesPersonId,
    //   // salesPersonId: this.profileId,
    //   salesPersonName: this.userSalesPersonName

    // });
  }

  ionViewWillEnter() {
if (!this.itemsAlreadySubmitted) {
  this.cartSub = this.cartItemService.places.subscribe(item => {
    this.loadedItems = item;
  });
  this.itemsCart = this.loadedItems;
  this.addItem();
  this.calculate();
}
  }

ionViewDidLeave() {
  this.itemsCart = [];
  this.loadedItems = [];
  this.itemsAlreadySubmitted = false;
}

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async getAllDistributors() {
    this.ngxUiLoader.startLoader('loader-create-salesOrder');
    this.distributorsSub = this.distributorsService.getDistributors().subscribe(res => {
      this.distributors = res.data;
      this.toDistributors = res.data;
      this.ngxUiLoader.stopLoader('loader-create-salesOrder');
    }, error => {
      this.ngxUiLoader.stopLoader('loader-create-salesOrder');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }

  //   getAllSalesPersons() {
  //     this.salesPersonSub = this.salesPersonService.getSalesPersons().subscribe(res => {
  //       this.salesPersons = res.data;
  //     }, error => {
  //       // this.ngxUiLoader.stopLoader('loader-03');
  //       // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
  //     });
  //   }

  fromDistributorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.modelForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      fromDistributorId: event.value._id,
      fromDistributorName: event.value.companyName,
    });
  }

  toDistributorChange(toevent: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.modelForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      toDistributorId: toevent.value._id,
      toDistributorName: toevent.value.companyName,
    });
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
  formatDate(value: string) {
    const date = format(parseISO(value), 'MMM d, yyyy');
    this.modelForm.patchValue({
      salesOrderDate: date
    });
    return date;
  }


  async onCreateChallan() {
    this.ngxUiLoader.startLoader('loader-create-salesOrder');
    this.challanService.createIpt(this.modelForm.value).subscribe((res) => {
      // loadingEl.dismiss();
      this.ngxUiLoader.stopLoader('loader-create-salesOrder');
      this.itemsAlreadySubmitted = true;
      if (res.status === false) {
        this.presentAlert(res.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        return;
      } else {
        this.modelForm.reset();
        this.itemsCart = [];
        this.loadedItems = [];
        // this.cartItemService.clear();
        // this.cartSub.unsubscribe();
        this.selectComponentFrom.clear();
        this.selectComponentTo.clear();
        this.ngOnDestroy();

         // this.presentAlert(MessageLib.SALES_ORDER_GENERATE_SUCCESS);
        this.router.navigate(['/sales-officer/sales-order']);
        this.presentToast(res.message || MessageLib.SALES_ORDER_GENERATE_SUCCESS);
      }
    }, error => {
      this.itemsAlreadySubmitted = true;
      this.ngxUiLoader.stopLoader('loader-create-salesOrder');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }


  async addItem() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <UntypedFormArray>this.modelForm.get('items');
    control.reset();
    control.clear();
    // push the value from stepTextArea to array
    // control.push(new FormControl(this.itemsCart));
    for (let i of this.itemsCart) {
      control.push(new UntypedFormControl(i));
    }
  }

  async calculate() {
    let product = this.itemsCart.filter(x => x.quantity > 0);
    this.model.products = product;
    this.model.totalPrice = 0;
    this.model.totalQuantity = 0;
    this.model.totalUnits = 0;
    // this.model.grandTotal = 0;
    product.forEach(element => {
      this.model.totalQuantity += element.quantity;
      this.model.totalPrice += element.amount;
      this.model.totalUnits += element.numberOfPacketsOrdered;
      // this.model.totalPrice += (parseFloat(element.price) * parseFloat(element.quantity));
    });

    this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    this.modelForm.patchValue({
      totalValue: this.model.totalPrice,
      totalQuantity: this.model.totalQuantity,
      totalUnits: this.model.totalUnits
    });
  }

  onDeleteItem(index) {
    if (index > -1) {
      this.itemsCart.splice(index, 1);
    }
    this.calculate();
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.modelForm.reset();
    this.cartItemService.removeRoomArr();

  }














}
