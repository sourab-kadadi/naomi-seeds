import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';
// import { environment } from '../../environments/environment';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { compileNgModuleDeclarationExpression } from '@angular/compiler/src/render3/r3_module_compiler';
// import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Storage } from '@capacitor/storage';
import { IonicSelectableComponent } from 'ionic-selectable';

import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ProductsService } from '../../../../service/products.service';
import { CartItemService } from '../../../../service/cart-item.service';
import { LotDataService } from 'src/app/service/lot-data.service';
// import { CartItemInvoiceService } from '../../../service/cart-item-invoice.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  dateValue: any;

  items: any[];
  inventoryItems: any[];
  item: any;
  productId: any;
  dateValue2 = '';
  selectedLotData: any;
  itemQuantity: any;

  price: any;

  filter = {
    page: 0,
    count: 1025000,
    search: '',
    location: ''
  };

  disc: any = 0;



  tempInventoryDetails: any = this.formBuilder.array([]);
  lotNumberOfPacketsData: any = this.formBuilder.group({
    lotNumberOfPackets: ['', [Validators.required, Validators.min(1)]],
  });


  lineItemForm: any = this.formBuilder.group({
    productId: ['', [Validators.required]],
    productName: ['', [Validators.required, Validators.minLength(2)]],
    lotId: ['', [Validators.required]],
    lotNumber: ['', [Validators.required]],
    crop: ['', [Validators.required]],
    hnsNumber: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    numberOfPacketsOrdered: ['', [Validators.required]],
    packingSizeinKg: ['', [Validators.required]],
    rate: [, [Validators.required]],
    amount: ['', [Validators.required]],
    // productDetails: this.formBuilder.group({
    //   cropType: [''],
    //   morphologicalCharacters: this.formBuilder.array([]),
    //   specialFeaturesUSPS: this.formBuilder.array([]),
    // }),
  });





  loadedItems: any;
  private cartSub: Subscription;

  public inactive = true;
  public showPageDetails = false;
  private productsSub: Subscription;
  constructor(
    private productsService: ProductsService,
    public navCtrl: NavController,

    private route: ActivatedRoute,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: UntypedFormBuilder,
    public lotDataService: LotDataService,
    private router: Router,
    public alertController: AlertController,
    private cartItemService: CartItemService
    // private auth: AuthServiceService
  ) { }

  ngOnInit() {

    this.getAllProducts();

  }
  ionViewWillEnter() {
    // this.getAllProducts();
    this.lineItemForm.reset();
    this.lotNumberOfPacketsData.reset();
    this.tempInventoryDetails.reset();
    this.selectComponent.clear();
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


    //   this.data = {};
    //   this.cartData = {};
    //   this.storedData = {};
    this.ngxUiLoader.startLoader('loader-add-item1');
    this.productsSub = this.productsService.getProducts(this.filter).subscribe(res => {
      this.items = res.data;
      this.ngxUiLoader.stopLoader('loader-add-item1');
    }, error => {
      this.ngxUiLoader.stopLoader('loader-add-item1');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }


  itemChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.lineItemForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      productId: event.value._id,
      productName: event.value.name,
      crop: event.value.crop,
      hnsNumber: event.value.hnsNumber,
    });
    // eslint-disable-next-line no-underscore-dangle
    this.getActiveinventorybyProduct(event.value._id);
    this.showPageDetails = false;
    this.selectComponent.clear();
    this.inactive = true;
  }


  itemChangeInventory(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.inactive = true;
    this.lotNumberOfPacketsData.reset();
    const selectedLotId = event.value._id;
    if (this.loadedItems && this.loadedItems.length > 0) {
      for (let item of this.loadedItems) {
        if (item.lotId === selectedLotId) {
          this.showPageDetails = false;
          this.presentAlert('Lot already added, Please add a different Lot or a product');
        } else {
          this.lineItemForm.patchValue({
            // eslint-disable-next-line no-underscore-dangle
            lotId: event.value._id,
            lotNumber: event.value.lotNo,
            rate: event.value.pricePerKg,
            packingSizeinKg: event.value.packingSizeinKg,
          });
          this.showPageDetails = true;
        }
      }
    } else {
      this.lineItemForm.patchValue({
        // eslint-disable-next-line no-underscore-dangle
        lotId: event.value._id,
        lotNumber: event.value.lotNo,
        rate: event.value.pricePerKg,
        packingSizeinKg: event.value.packingSizeinKg,
      });
      this.showPageDetails = true;
    }
  }

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
  getActiveinventorybyProduct(productId) {
    this.ngxUiLoader.startLoader('loader-add-item1');
    this.lotDataService.findLotByActiveQuantityByProduct(productId).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-add-item1');
      this.inventoryItems = res.data;
      // this.lineItemForm.patchValue({
      //   productName: res.data.name,
      //   crop: res.data.crop,
      //   hnsNumber: res.data.hnsNumber,
      // });
    },
      error => {
        this.ngxUiLoader.stopLoader('loader-add-item1');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
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


  onAddLineItem() {




    this.ngxUiLoader.startLoader('loader-add-item1');
    this.cartItemService
      .addPlace(
        this.lineItemForm.value.productId,
        this.lineItemForm.value.productName,
        this.lineItemForm.value.lotId,
        this.lineItemForm.value.lotNumber,
        this.lineItemForm.value.crop,
        this.lineItemForm.value.hnsNumber,
        this.lineItemForm.value.quantity,
        this.lineItemForm.value.packingSizeinKg,
        this.lineItemForm.value.numberOfPacketsOrdered,
        this.lineItemForm.value.rate,
        this.lineItemForm.value.amount,
      )
      .subscribe(() => {
        // loadingEl.dismiss();
        // this.form.reset();
        this.ngxUiLoader.stopLoader('loader-add-item1');
        this.router.navigate(['/sales-officer/sales-order/create-sales-order']);
      }, error => {
        this.ngxUiLoader.stopLoader('loader-add-item1');
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      }
      );
  }


  onAddQuantity() {
    this.inactive = false;
    this.lineItemForm.value.numberOfPacketsOrdered = this.lotNumberOfPacketsData?.value.lotNumberOfPackets;
    this.itemQuantity = parseFloat(this.lineItemForm?.value.packingSizeinKg) * parseFloat(this.lineItemForm?.value.numberOfPacketsOrdered);
    let itemValue = parseFloat(this.lineItemForm?.value.rate) * parseFloat(this.itemQuantity);
    this.lineItemForm.patchValue({
      quantity: this.itemQuantity,
      amount: itemValue,
      numberOfPacketsOrdered: this.lotNumberOfPacketsData?.value.lotNumberOfPackets
    });
  }

  changeStatus() {
    this.inactive = !(this.inactive);
  }


}
