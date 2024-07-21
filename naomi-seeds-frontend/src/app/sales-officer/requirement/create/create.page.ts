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
import { RequirementService } from 'src/app/service/requirement.service';
// import { CartItemInvoiceService } from '../../service/cart-item-invoice.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  @ViewChild('selectComponentTo') selectComponentTo: IonicSelectableComponent;
  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;


  itemsDetail: any = this.formBuilder.group({
    productId: ['', [Validators.required]],
    productName: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    quantityUnit: ['', [Validators.required]],
    packingSize: [''],
    // packingSizeunit: [''],

  });

  modelForm: any = this.formBuilder.group({
    toDistributorId: ['', [Validators.required]],
    toDistributorName: ['', [Validators.required]],
    items: this.formBuilder.array([]),
  });

  packingSizeunit: any;
  quantityUnits = 'kgs';
  itemsCart= [];
  products: any[];
  product: any;
  distributors: any[];
  distributor: any;
  toDistributors: any[];
  toDistributor: any;
  salesPersons: any[];
  salesPerson: any;
  lineItem: any;
  model: any = {};

  filter = {
    page: 0,
    count: 10250,
    search: '',
    location: ''
  };
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
    private toastController: ToastController,
    private productsService: ProductsService,
    private requirementService: RequirementService

  ) {

  }

  ngOnInit() {

    this.getAllDistributors();
this.getAllProducts();

  }

  ionViewWillEnter() {
this.itemsCart = [];
this.modelForm.reset();


// this.cartSub = this.cartItemService.places.subscribe(item => {
    //   this.loadedItems = item;
    // });
    // this.itemsCart = this.loadedItems;
    // this.calculate();

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async getAllDistributors() {
    this.ngxUiLoader.startLoader('loader-create-requirement');
    this.distributorsSub = this.distributorsService.getDistributors().subscribe(res => {
      this.toDistributors = res.data;
      this.ngxUiLoader.stopLoader('loader-create-requirement');
    }, error => {
      this.ngxUiLoader.stopLoader('loader-create-requirement');
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
  // salesPersonChange(event: {
  //   component: IonicSelectableComponent;
  //   value: any;
  // }) {
  //   // eslint-disable-next-line no-underscore-dangle
  //   console.log('selected salespersonID', event.value._id);

  //   // console.log('selected salespersonrname', event.value.name);
  // // eslint-disable-next-line no-underscore-dangle
  // // this.getProduct(event.value._id);

  // this.modelForm.patchValue({

  //   // eslint-disable-next-line no-underscore-dangle
  //   salesPersonId: event.value._id,

  //   // salesPersonName: event.value.name,

  // });

  // }

  async onCreateChallan() {
    console.log(this.modelForm);
    // this.addItem();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <UntypedFormArray>this.modelForm.get('items');
    // push the value from stepTextArea to array
    // control.push(new FormControl(this.itemsCart));
    for (let i of this.itemsCart) {
      if (i !== null) {
//         console.log(this.itemsCart.length);
        console.log(i);
// console.log(this.itemsCart[i]);
if (i.quantityUnit === 'g') {
  // console.log(this.itemsDetail);
  const quantityConverted = Number(i.quantity)/1000;
  console.log(quantityConverted);
  i.quantityUnit = 'kgs';
  i.quantity = quantityConverted;
  }
       control.push(new UntypedFormControl(i));
      }

    }

    // this.modelForm.get('items').set(this.itemsCart);
console.log(this.modelForm);

    this.ngxUiLoader.startLoader('loader-create-requirement');
    this.requirementService.addRequirement(this.modelForm.value).subscribe((res) => {
      // loadingEl.dismiss();
      this.ngxUiLoader.stopLoader('loader-create-requirement');
      if (res.status === false) {
        this.presentAlert(res.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        return;
      } else {
        this.modelForm.reset();
        // this.cartItemService.clear();
        // this.cartSub.unsubscribe();
        this.selectComponentTo.clear();
        // this.presentAlert(MessageLib.SALES_ORDER_GENERATE_SUCCESS);
        this.router.navigate(['/sales-officer/requirement']);
        this.presentToast(res.message || MessageLib.SALES_ORDER_GENERATE_SUCCESS);
      }
    }, error => {
      this.ngxUiLoader.stopLoader('loader-create-requirement');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }


 async addItem() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    // const control = <FormArray>this.modelForm.get('items');
    // push the value from stepTextArea to array
    // control.push(new FormControl(this.itemsCart));
    // for (let i of this.itemsDetail) {
    //   control.push(new FormControl(i));
    // }
    console.log(this.itemsDetail.value.packingSize);
    console.log(this.itemsDetail.value.packingSizeunit);
      const packingSizeUpdated = this.itemsDetail.value.packingSize +' '+ this.packingSizeunit;
      this.itemsDetail.patchValue({
        // packingSize: event.detail.value
        packingSize: packingSizeUpdated
      });
      console.log(packingSizeUpdated);

    console.log('triggered');
  this.itemsCart.push(this.itemsDetail.value);
  this.itemsDetail.reset();
  this.product = null;
  // console.log(this.itemsCart);




  }


  // onDeleteItem(index) {
  //   if (index > -1) {
  //     this.itemsCart.splice(index, 1);
  //   }
  // }


  // async calculate() {
  //   let product = this.itemsCart.filter(x => x.quantity > 0);
  //   this.model.products = product;
  //   this.model.totalPrice = 0;
  //   this.model.totalQuantity = 0;
  //   this.model.totalUnits = 0;
  //   // this.model.grandTotal = 0;
  //   product.forEach(element => {
  //     this.model.totalQuantity += element.quantity;
  //     this.model.totalPrice += element.amount;
  //     this.model.totalUnits += element.numberOfPacketsOrdered;
  //     // this.model.totalPrice += (parseFloat(element.price) * parseFloat(element.quantity));
  //   });

  //   this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
  //   this.modelForm.patchValue({
  //     totalValue: this.model.totalPrice,
  //     totalQuantity: this.model.totalQuantity,
  //     totalUnits: this.model.totalUnits
  //   });
  // }

  onDeleteItem(index) {
    if (index > -1) {
      this.itemsCart.splice(index, 1);
    }
    // this.calculate();
  }

  // ngOnDestroy() {
  //   this.cartSub.unsubscribe();
  //   this.modelForm.reset();
  // }


  async getAllProducts() {


    //   this.data = {};
    //   this.cartData = {};
    //   this.storedData = {};
    this.ngxUiLoader.startLoader('loader-add-item1');
    this.productsService.getProducts(this.filter).subscribe(res => {
      this.products = res.data;
      this.ngxUiLoader.stopLoader('loader-add-item1');
    }, error => {
      this.ngxUiLoader.stopLoader('loader-add-item1');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }


  itemChangeProduct(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    console.log(event.value);
 this.itemsDetail.patchValue({
    // eslint-disable-next-line no-underscore-dangle
    productId : event.value._id,
    productName: event.value.name,
    quantityUnit: 'kgs'
  });
  console.log(this.itemsDetail);


    // eslint-disable-next-line no-underscore-dangle
    // this.getActiveinventorybyProduct(event.value._id);
    // this.showPageDetails = false;
    // this.selectComponent.clear();
    // this.inactive=true;
  }




  onDropdownQuantityUnit(event){
  console.log(event.detail.value);




// if (event.detail.value === 'g') {
//   // console.log(this.itemsDetail);
//   const quantityConverted = Number(this.itemsDetail.value.quantity)/1000;
//   console.log(quantityConverted);
//   this.itemsDetail.patchValue({
//     quantityUnit: 'kgs',
//     quantity: quantityConverted
//   });


// } else if (event.detail.value === 'kgs') {
  this.itemsDetail.patchValue({
    quantityUnit: event.detail.value
  });

}

onDropdownPackingUnit(event){

  this.packingSizeunit =event.detail.value;

// this.itemsDetail.patchValue({
//   // packingSize: event.detail.value
//   packingSizeunit: event.detail.value
// });
}





}
