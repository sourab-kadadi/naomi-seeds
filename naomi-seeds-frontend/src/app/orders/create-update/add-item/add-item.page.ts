import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, PackingSizes, PageLocation, Role, TypeOfSale } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Storage } from '@capacitor/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ProductService } from 'src/app/product/service/product.service';
import { CartItemService } from './../../service/cart-item.service';
import { ProductsLotService } from '../../../products-lot-page/service/products-lot.service';
import { environment } from 'src/environments/environment';
import { OrdersService } from '../../service/orders.service';
// import { CartItemInvoiceService } from '../../../service/cart-item-invoice.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;
  @ViewChild('selectComponentLot') selectComponentLot: IonicSelectableComponent;

  //standard for every page//
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
  //--standard for every page--//


  productsList: any[] = [];
  product: any;
  productId: any;
  productDetailsForDisplay: any = {};

  productsLotList: any[] = [];
  selectedProductLot: any;
  LotDetails: any;
  productLotId: any;
  selectedDistributorIdForReturn: any;

  //for order calculation//
  numberOfPacketsOrdered: number;
  itemQuantityInKgs: number;
  itemAmountForSale: number;
  itemAmountForReturn: number;


  stateData: any = {};
  useReturnBlock = false;
  useSalesBlock = false;
  // tempInventoryDetails: any = this.formBuilder.array([]);
  // lotNumberOfPacketsData: any = this.formBuilder.group({
  //   lotNumberOfPackets: ['', [Validators.required, Validators.min(1)]],
  // });


  lineItemForm: any = this.formBuilder.group({
    productId: ['', [Validators.required]],
    productName: ['', [Validators.required, Validators.minLength(2)]],
    crop: ['', [Validators.required]],
    lotId: ['', [Validators.required]],
    lotNumber: ['', [Validators.required]],
    packingQty: ['', [Validators.required]],
    packingUnit: ['', [Validators.required]],
    packetMRPPrice: ['', [Validators.required]],
    numberOfPacketsOrdered: [, [Validators.required]],
    itemQuantityInKgs: [, [Validators.required]],

    // packetInvoicePrice: ['', [Validators.required]],


    // effectiveRatePerKg: ['', [Validators.required]],
  });





  loadedItems: any;
  private cartSub: Subscription;

  public inactive = true;
  public showPageDetails = false;
  private productsSub: Subscription;

  constructor(
    private productService: ProductService,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: UntypedFormBuilder,
    private productsLotService: ProductsLotService,
    private router: Router,
    public alertController: AlertController,
    private cartItemService: CartItemService,
    // private auth: AuthServiceService,
    private ordersService: OrdersService,
  ) {



  }

  ngOnInit() {

    this.getAllProducts();

    this.stateData = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.stateData)
    this.changeFormBasedOnTypeOfSale();









    // this.modelForm.get('profile').addControl('areasCovered',this.formBuilder.control('', [Validators.required]));
    // this.modelForm.get('profile').removeControl('profileReportsToId');


  }
  ionViewWillEnter() {
    // this.getAllProducts();

    this.lineItemForm.reset();
    // this.lotNumberOfPacketsData.reset();
    // this.tempInventoryDetails.reset();
    this.selectComponentLot.clear();
    this.selectComponentProduct.clear();

    this.cartSub = this.cartItemService.places.subscribe(item => {
      this.loadedItems = item;
    });

  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }



  async getAllProducts() {
    this.active = false;
    this.productsList = [];
    this.ngxUiLoader.startLoader('loader-order-add-line-items');
    this.productService.getProductAllDropDown().subscribe({
      next: (res) => {
        if (res.status === true && res.data.length > 0) {
          this.productsList = res.data;
        } else {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-order-add-line-items');
      }
    });
  }




  itemChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    console.log(event)
    this.productId = event.value._id
    this.lineItemForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      productId: event.value._id,
      productName: event.value.name,
      crop: event.value.crop
    });
    console.log(this.lineItemForm)
    this.getAllLotDataByProductIdDropDownWithValidity();
    // eslint-disable-next-line no-underscore-dangle
    // this.getActiveinventorybyProduct(event.value._id);
    // this.showPageDetails = false;
    // this.selectComponentLot.clear();
    // this.active = true;
  }


  async getAllLotDataByProductIdDropDownWithValidity() {
    this.active = false;
    this.productsLotList = [];
    this.ngxUiLoader.startLoader('loader-order-add-line-items');
    this.productsLotService.getAllLotDataByProductIdDropDownWithValidity(this.productId).subscribe({
      next: (res) => {
        if (res.status === true && res.data.length > 0) {
          this.productsLotList = res.data;
        } else {
          this.presentAlert('No Details Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        this.active = true;
        this.ngxUiLoader.stopLoader('loader-order-add-line-items');
      }
    });
  }



  itemChangeLotNumber(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.active = false;
    // this.lotNumberOfPacketsData.reset();
    // const selectedLotId = event.value._id;



    console.log(this.loadedItems)



    this.productLotId = event.value._id;





    if (this.stateData.typeOfSale.includes(TypeOfSale.COMPANY_SALE)) {
      this.getProductLotDataById();
    } else if (this.stateData.typeOfSale.includes(TypeOfSale.IPT) || this.stateData.typeOfSale.includes(TypeOfSale.SALES_RETURN)) {
      this.getProductLotDataById();
      this.getPreviousLotPurchasePrice();
    }






  }



  async getProductLotDataById() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-order-add-line-items');
    this.productsLotService.getProductLotDataByIdExpanded(this.productLotId).subscribe({
      next: (res) => {
        if (res && res.status === true) {
          this.productDetailsForDisplay.cropName = res.data.cropName;
          this.productDetailsForDisplay.hsnCode = res.data.hsnCode;
          this.lineItemForm.patchValue({
            lotId: res.data._id,
            lotNumber: res.data.lotNo,
            packingQty: res.data.productPackingSizeInfo.packingQty,
            packingUnit: res.data.productPackingSizeInfo.packingUnit,
            packetMRPPrice: res.data.productPackingSizeInfo.packetMRPPrice,
          });
          if (this.stateData.typeOfSale.includes(TypeOfSale.COMPANY_SALE) || this.stateData.typeOfSale.includes(TypeOfSale.IPT)) {
            this.lineItemForm.patchValue({
              effectiveRatePerKgForSale: res.data.productPackingSizeInfo.effectiveRatePerKg,
              packetInvoicePriceForSale: res.data.productPackingSizeInfo.packetInvoicePrice,
            });
          }
        } else {
          this.presentAlert("No Lot details found")
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.active = true;
        this.showPageDetails = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
      }
    });
  }











  ///important to check
  // async selectedLotPatch() {

  //   if (this.loadedItems && this.loadedItems.length > 0) {
  //     for (let item of this.loadedItems) {
  //       if (item.lotId === selectedLotId) {
  //         this.showPageDetails = false;
  //         this.presentAlert('Lot already added, Please add a different Lot or a product');
  //       } else {
  //         this.lineItemForm.patchValue({
  //           // eslint-disable-next-line no-underscore-dangle
  //           lotId: event.value._id,
  //           lotNumber: event.value.lotNo,
  //           rate: event.value.pricePerKg,
  //           packingSizeinKg: event.value.packingSizeinKg,
  //         });
  //         this.showPageDetails = true;
  //       }
  //     }
  //   } else {
  //     this.lineItemForm.patchValue({
  //       // eslint-disable-next-line no-underscore-dangle
  //       lotId: event.value._id,
  //       lotNumber: event.value.lotNo,
  //       rate: event.value.pricePerKg,
  //       packingSizeinKg: event.value.packingSizeinKg,
  //     });
  //     this.showPageDetails = true;
  //   }
  // }






  // getProduct() {
  //   this.ngxUiLoader.startLoader('loader-add-item1');
  //   this.productsService.getProductById(this.productId).subscribe(res => {
  //     this.ngxUiLoader.stopLoader('loader-add-item1');
  //     this.item = res.data;

  //   },
  //     error => {
  //       this.ngxUiLoader.stopLoader('loader-add-item1');
  //       this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  //     });
  // }

  // this.inventoryItems = res.data.inventoryDetails;
  // getActiveinventorybyProduct(productId) {
  //   this.ngxUiLoader.startLoader('loader-add-item1');
  //   this.productsLotService.findLotByActiveQuantityByProduct(productId).subscribe(res => {
  //     this.ngxUiLoader.stopLoader('loader-add-item1');
  //     this.inventoryItems = res.data;
  //     // this.lineItemForm.patchValue({
  //     //   productName: res.data.name,
  //     //   crop: res.data.crop,
  //     //   hnsNumber: res.data.hnsNumber,
  //     // });
  //   },
  //     error => {
  //       this.ngxUiLoader.stopLoader('loader-add-item1');
  //       this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  //     });
  // }



  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK']
    });
    await alert.present();
  }


  async onAddLineItem() {
    this.lineItemForm.patchValue({
      numberOfPacketsOrdered: this.numberOfPacketsOrdered,
      itemQuantityInKgs: this.itemQuantityInKgs,
      itemAmountForSale: this.itemAmountForSale,
      itemAmountForReturn: this.itemAmountForReturn
    });
    console.log(this.lineItemForm.value)
    this.ngxUiLoader.startLoader('loader-order-add-line-items');
    console.log(this.lineItemForm.value)
    this.cartItemService

      .addPlace(
        this.stateData.typeOfSale,

        this.lineItemForm.value
        // this.lineItemForm.value.productId,
        // this.lineItemForm.value.productName,
        // this.lineItemForm.value.crop,
        // this.lineItemForm.value.lotId,
        // this.lineItemForm.value.lotNumber,
        // this.lineItemForm.value.packingQty,
        // this.lineItemForm.value.packingUnit,
        // this.lineItemForm.value.packetMRPPrice,
        // this.lineItemForm.value.numberOfPacketsOrdered,
        // this.lineItemForm.value.itemQuantityInKgs,

        // this.lineItemForm.value.effectiveRatePerKgForSale,
        // this.lineItemForm.value.packetInvoicePriceForSale,
        // this.lineItemForm.value.itemAmountForSale
        
      )
      .subscribe({
        next: (res) => {
          console.log(res)
        }, error: (e) => {
          // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
          this.active = true;
          this.ngxUiLoader.stopLoader("loader-order-add-line-items");
          this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

        }, complete: () => {
          this.active = true;
          this.router.navigate(['/app/orders/manage']);
          this.ngxUiLoader.stopLoader('loader-order-add-line-items');
        }
      });
  }














  onNumberOfPacketsInputChange(event) {
    // this.inactive = false;

    console.log(event)


    if (this.lineItemForm?.value.packingUnit === PackingSizes.GMS) {
      this.itemQuantityInKgs = (event.detail.value * parseFloat(this.lineItemForm?.value.packingQty)) / 1000;
    } else if (this.lineItemForm?.value.packingUnit === PackingSizes.TONNE) {
      this.itemQuantityInKgs = (event.detail.value * parseFloat(this.lineItemForm?.value.packingQty)) * 1000;
    } else if (this.lineItemForm?.value.packingUnit === PackingSizes.QUINTAL) {
      this.itemQuantityInKgs = (event.detail.value * parseFloat(this.lineItemForm?.value.packingQty)) * 100;
    } else if (this.lineItemForm?.value.packingUnit === PackingSizes.KGS) {
      this.itemQuantityInKgs = (event.detail.value * parseFloat(this.lineItemForm?.value.packingQty));
    }


    if (this.stateData.typeOfSale.includes(TypeOfSale.COMPANY_SALE) || this.stateData.typeOfSale.includes(TypeOfSale.IPT) ) {
      this.itemAmountForSale = parseFloat(this.lineItemForm?.value.packetInvoicePriceForSale) * event.detail.value;
    }
    if (this.stateData.typeOfSale.includes(TypeOfSale.SALES_RETURN) || this.stateData.typeOfSale.includes(TypeOfSale.IPT)) {
      this.itemAmountForReturn = parseFloat(this.lineItemForm?.value.packetInvoicePriceForReturn) * event.detail.value;
    }



    // this.lineItemForm.patchValue({
    //   quantity: this.itemQuantity,
    //   amount: itemValue,
    //   numberOfPacketsOrdered: this.lotNumberOfPacketsData?.value.lotNumberOfPackets
    // });
  }


  // onNumberOfPacketsInputChange(event: any) {
  //   console.log(event.detail.value)
  //   this.numberOfPacketsOrdered = event.detail.value;
  // }


  changeStatus() {
    this.inactive = !(this.inactive);
  }


  async changeFormBasedOnTypeOfSale() {
    if (this.stateData.typeOfSale.includes(TypeOfSale.COMPANY_SALE)) {
      this.useReturnBlock = false;
      this.useSalesBlock = true;
      this.lineItemForm.removeControl('effectiveRatePerKgForReturn');
      this.lineItemForm.removeControl('packetInvoicePriceForReturn');
      this.lineItemForm.removeControl('itemAmountForReturn');
      this.lineItemForm.addControl('effectiveRatePerKgForSale', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('packetInvoicePriceForSale', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('itemAmountForSale', this.formBuilder.control('', [Validators.required]));

    } else if (this.stateData.typeOfSale.includes(TypeOfSale.IPT)) {
      this.selectedDistributorIdForReturn = this.stateData.fromDistributor._id;
      this.useReturnBlock = true;
      this.useSalesBlock = true;

      this.lineItemForm.addControl('effectiveRatePerKgForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('packetInvoicePriceForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('itemAmountForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('effectiveRatePerKgForSale', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('packetInvoicePriceForSale', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('itemAmountForSale', this.formBuilder.control('', [Validators.required]));
      this.getPreviousLotPurchasePrice();
    } else if (this.stateData.typeOfSale.includes(TypeOfSale.SALES_RETURN)) {
      this.useReturnBlock = true;
      this.useSalesBlock = false;
      this.selectedDistributorIdForReturn = this.stateData.fromDistributor._id;
      this.lineItemForm.addControl('effectiveRatePerKgForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('packetInvoicePriceForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.addControl('itemAmountForReturn', this.formBuilder.control('', [Validators.required]));
      this.lineItemForm.removeControl('effectiveRatePerKgForSale');
      this.lineItemForm.removeControl('packetInvoicePriceForSale');
      this.lineItemForm.removeControl('itemAmountForSale');
      this.getPreviousLotPurchasePrice();
    }



  }




  async getPreviousLotPurchasePrice() {
    this.active = false;
    this.ngxUiLoader.startLoader('loader-order-add-line-items');

    this.ordersService.getPreviousItemLotSalePrice(this.productLotId, this.selectedDistributorIdForReturn).subscribe({
      next: (res) => {
        if (res && res.status === true) {
          this.lineItemForm.patchValue({
            effectiveRatePerKgForReturn: res.data.effectiveRatePerKgForSale,
            packetInvoicePriceForReturn: res.data.packetInvoicePriceForSale
          });
          console.log(res)
          console.log(this.lineItemForm)
        } else {
          this.presentAlert(res.message || "No Lot details found")
        }
      },
      error: (e) => {
        this.active = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
        this.presentAlert(e.message || e.error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      },
      complete: () => {
        this.active = true;
        this.showPageDetails = true;
        this.ngxUiLoader.stopLoader("loader-order-add-line-items");
      }
    });
  }




}
