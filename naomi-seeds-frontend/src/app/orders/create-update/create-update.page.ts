import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

// import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController, IonDatetime, PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';

import { Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, PageLocation, Role, TypeOfSale } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';
// import { ProductsService } from '../../../service/products.service';
import { CartItemService } from '../service/cart-item.service';
import { ProfileManagementService } from 'src/app/profile-management/service/profile-management.service';
import { OrdersService } from '../service/orders.service';
import { environment } from 'src/environments/environment';
import { PermissionsDataBehaviourSubjectService } from 'src/app/service/permissions-data-behaviour-subject.service';
import { NgxPermissionsService } from 'ngx-permissions';
// import { CartItemInvoiceService } from '../../service/cart-item-invoice.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.page.html',
  styleUrls: ['./create-update.page.scss'],
})
export class CreateUpdatePage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild('selectComponentFrom') selectComponentFrom: IonicSelectableComponent;
  @ViewChild('selectComponentTo') selectComponentTo: IonicSelectableComponent;

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

  orderTypeSelection: any;

  dateValue: any;

  itemsAlreadySubmitted = false;

  modelForm: any = this.formBuilder.group({
    // orderFromProfileId: ['', [Validators.required]],
    // orderFromProfileName: ['', [Validators.required]],
    // orderToProfileId: ['', [Validators.required]],
    // orderToProfileName: ['', [Validators.required]],

    orderDate: ['', [Validators.required]],
    items: this.formBuilder.array([]),
    totalUnits: ['', [Validators.required]],
    totalQuantity: ['', [Validators.required]],
    orderType: ['', [Validators.required]],

    rrOrLrNum: ['', [Validators.required]],
    vehicleNo: ['', [Validators.required]],
    transport: ['', [Validators.required]],
    driverName: [''],
    driverContact: ['', Validators.pattern('^[0-9]{10}$')],
    freightTotal: ['', [Validators.required]],
    frightPaidAdvance: ['', [Validators.required]],
  });



  itemsCart: any;

  fromDistributors: any[] = [];
  fromDistributor: any;
  toDistributors: any[] = [];
  toDistributor: any;
  showFromDistributorSelection = false;
  showToDistributorSelection = false;
  // salesPersons: any[];
  // salesPerson: any;
  lineItem: any;
  model: any = {};

  mode: 'create' | 'update' = 'create';
  orderId: any;


  public itemsPresent = false;
  private cartSub: Subscription;
  private distributorsSub: Subscription;
  constructor(private router: Router,
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    private cartItemService: CartItemService,
    public alertController: AlertController,
    private ngxUiLoader: NgxUiLoaderService,
    private toastController: ToastController,
    private profileManagementService: ProfileManagementService,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,
    private ngxPermissionsService: NgxPermissionsService,

  ) {
    this.permissionsDataBehaviourSubjectService.permissionsDataObservable.subscribe((res) => {
      this.userRole = res.userRole;
      this.permissionsDataByPageLocation = Object.keys(res.permissionsDatapoints[this.pageLocation]).filter(e =>
        res.permissionsDatapoints[this.pageLocation][e] === true);
      this.combinedPermissionsDataArray = [].concat(this.permissionsDataByPageLocation, this.userRole);
      this.ngxPermissionsService.loadPermissions(this.combinedPermissionsDataArray);
    });
    console.log(this.userRole)



    this.mode = this.route.snapshot.data.mode || 'create';
    this.orderId = this.route.snapshot.paramMap.get('orderId');
  }

  ngOnInit() {

    this.modelForm.reset();


  }

  ionViewWillEnter() {
    if (!this.itemsAlreadySubmitted) {
      this.cartSub = this.cartItemService.places.subscribe(item => {
        this.itemsCart = item;
      });
      // this.addItem();
      this.calculate();
    }

    console.log(this.itemsCart)
  }


  async orderTypeSelect(event: any) {
    this.modelForm.patchValue({
      orderType: this.orderTypeSelection
    })
    await this.getAllAllotedDistributorsDropDown();
    if (this.orderTypeSelection === TypeOfSale.IPT) {
      await this.getAllDistributorsDropDown();
    }
  }

  async getAllAllotedDistributorsDropDown() {
    this.active = false;
    this.fromDistributors = [];
    this.toDistributors = [];
    this.ngxUiLoader.startLoader('loader-orders-list-page');
    this.profileManagementService.getAllDistributorBasedOnAllotmentOfUser().subscribe({
      next: (res) => {
        if (res.data) {
          // console.log('1.5')
          if (this.orderTypeSelection.includes(TypeOfSale.COMPANY_SALE)) {
            // console.log('1.6')
            this.toDistributors = res.data;
          } else if (this.orderTypeSelection.includes(TypeOfSale.IPT)) {
            this.fromDistributors = res.data;

          } else if (this.orderTypeSelection.includes(TypeOfSale.SALES_RETURN)) {
            this.fromDistributors = res.data;
          }
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
        this.distributorDropDowns();
      }
    });
  }


  async getAllDistributorsDropDown() {
    this.active = false;
    this.fromDistributors = [];
    this.ngxUiLoader.startLoader('loader-orders-list-page');
    this.profileManagementService.getAllDistributorProfiles().subscribe({
      next: (res) => {
        if (res.data) {
          // console.log('1.5')
          if (this.orderTypeSelection.includes(TypeOfSale.IPT)) {
            this.toDistributors = res.data;
          }
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







  orderFromProfileChange(toevent: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.modelForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      orderFromProfileId: toevent.value._id,
      orderFromProfileName: toevent.value.companyName,
    });
  }

  orderToProfileChange(toevent: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.modelForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      orderToProfileId: toevent.value._id,
      orderToProfileName: toevent.value.companyName,
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

  async formatDate(value: any) {
    const popover = await this.popoverController.getTop();
    if (popover) {
      popover.dismiss();
    }
    const date = format(parseISO(value), 'MMM d, yyyy');
    this.modelForm.patchValue({
      orderDate: date
    });
    return date;
  }


  async onCreate() {
    this.active = false;
    if (!this.modelForm.valid) {
      return this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    }
    // console.log(dataProfile)
    const dataProfile = this.modelForm.value;

    dataProfile["items"] = this.itemsCart
    console.log(dataProfile)
    this.ngxUiLoader.startLoader("loader-orders-list");
    this.ordersService.createSalesByPlantManager(dataProfile).subscribe({
      next: (res) => {
        if (res && res.status === true) {
          this.presentToast(MessageLib.SALES_ORDER_GENERATE_SUCCESS);
          this.router.navigate(['/app/orders']);
        } else {
          this.presentAlert(res.message);
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list');
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      },
      complete: () => {
        this.ngOnDestroy();
        this.itemsAlreadySubmitted = true;
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-orders-list');

      }
    });
  }



  // async addItem() {
  //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  //   const control = <UntypedFormArray>this.modelForm.get('items');
  //   control.reset();
  //   control.clear();
  //   // push the value from stepTextArea to array
  //   // control.push(new FormControl(this.itemsCart));
  //   for (let i of this.itemsCart) {
  //     control.push(new UntypedFormControl(i));
  //   }
  // }

  async calculate() {

    let product = this.itemsCart.filter(x => x.numberOfPacketsOrdered > 0);
    this.model.products = product;


    this.model.totalQuantity = 0;
    this.model.totalUnits = 0;

    // this.model.grandTotal = 0;
    product.forEach(element => {
      this.model.totalQuantity += element.itemQuantityInKgs;

      this.model.totalUnits += element.numberOfPacketsOrdered;





      console.log(element.itemAmountForSale)
      // this.model.totalPriceForSale += (parseFloat(element.price) * parseFloat(element.quantity));

      this.model.totalPriceForSale = parseFloat(this.model.totalPriceForSale).toFixed(2);
      this.modelForm.patchValue({
        totalQuantity: this.model.totalQuantity,
        totalUnits: this.model.totalUnits
      });


      if (this.orderTypeSelection.includes(TypeOfSale.COMPANY_SALE) || this.orderTypeSelection.includes(TypeOfSale.IPT)) {
        this.model.totalPriceForSale = 0;
        this.model.totalPriceForSale += element.itemAmountForSale;
        this.modelForm.patchValue({
          totalValueSale: this.model.totalPriceForSale,
        });
      }

      if (this.orderTypeSelection.includes(TypeOfSale.SALES_RETURN) || this.orderTypeSelection.includes(TypeOfSale.IPT)) {
        this.model.totalPriceForReturn = 0;
        this.model.totalPriceForReturn += element.itemAmountForReturn;

        console.log(this.model.totalPriceForReturn)
        this.modelForm.patchValue({
          totalValueReturn: this.model.totalPriceForReturn
        });

      }
    });






    console.log(this.model)
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
    console.log(this.distributorsSub)
    // this.distributorsSub.unsubscribe();
    console.log(this.distributorsSub)
    this.modelForm.reset();
    this.itemsCart = [];
    // this.cartItemService.clear();
    // this.cartSub.unsubscribe();
    // this.selectComponentFrom.clear();
    // this.selectComponentTo.clear();
  }




  ionViewDidLeave() {
    this.itemsCart = [];
    this.itemsAlreadySubmitted = false;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }




  async onSave() {
    if (this.mode === 'create') {
      this.onCreate();
      console.log('here')
    } else if (this.mode === 'update') {
      // this.onUpdate();
    }
  }



  async distributorDropDowns() {
    if (this.orderTypeSelection.includes(TypeOfSale.COMPANY_SALE)) {
      this.showToDistributorSelection = true;
      this.showFromDistributorSelection = false;
      this.modelForm.removeControl('orderFromProfileId');
      this.modelForm.removeControl('orderFromProfileName');
      this.modelForm.addControl('orderToProfileId', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('orderToProfileName', this.formBuilder.control('', [Validators.required]));
      this.modelForm.removeControl('totalValueReturn');
      this.modelForm.addControl('totalValueSale', this.formBuilder.control('', [Validators.required]));
    } else if (this.orderTypeSelection.includes(TypeOfSale.IPT)) {
      this.showFromDistributorSelection = true;
      this.showToDistributorSelection = true;
      this.modelForm.addControl('orderFromProfileId', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('orderFromProfileName', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('orderToProfileId', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('orderToProfileName', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('totalValueReturn', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('totalValueSale', this.formBuilder.control('', [Validators.required]));
    } else if (this.orderTypeSelection.includes(TypeOfSale.SALES_RETURN)) {
      this.showFromDistributorSelection = true;
      this.showToDistributorSelection = false;
      this.modelForm.addControl('orderFromProfileId', this.formBuilder.control('', [Validators.required]));
      this.modelForm.addControl('orderFromProfileName', this.formBuilder.control('', [Validators.required]));
      this.modelForm.removeControl('orderToProfileId');
      this.modelForm.removeControl('orderToProfileName');
      this.modelForm.addControl('totalValueReturn', this.formBuilder.control('', [Validators.required]));
      this.modelForm.removeControl('totalValueSale');
    }
  }





  navigateToAddItem(event: any) {
    console.log(this.modelForm.value)
    this.router.navigate(['./', 'add-item'], { state: { data: { typeOfSale: this.orderTypeSelection, toDistributor: this.toDistributor, fromDistributor: this.fromDistributor } }, relativeTo: this.route })
  }



}
