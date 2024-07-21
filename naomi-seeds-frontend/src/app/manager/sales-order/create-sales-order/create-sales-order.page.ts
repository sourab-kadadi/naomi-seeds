import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

// import { IonicSelectableComponent } from 'ionic-selectable';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';

import { Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';


import { DistributorsService } from '../../../service/distributors.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { SalesPersonService } from '../../../service/sales-person.service';
import { ProductsService } from '../../../service/products.service';
import { SalesService} from '../../../service/sales.service';
import { AuthService } from '../../../login/auth.service';
import  { CartItemService } from '../../../service/cart-item.service';
// import { CartItemInvoiceService } from '../../service/cart-item-invoice.service';

@Component({
  selector: 'app-create-sales-order',
  templateUrl: './create-sales-order.page.html',
  styleUrls: ['./create-sales-order.page.scss'],
})
export class CreateSalesOrderPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  dateValue: any;
  user: any;
  userSalesPersonId: any;
userSalesPersonName: any;



  modelForm: any = this.formBuilder.group({


    fromDistributorId: ['', [Validators.required]],
    fromDistributorName: ['', [Validators.required]],
    toDistributorId: ['', [Validators.required]],
    toDistributorName: ['', [Validators.required]],
    salesOrderDate: ['', [Validators.required]],
    items: this.formBuilder.array ([]),
    totalUnits: ['1', [Validators.required]],
    totalQuantity: ['', [Validators.required]],
    totalValue: ['', [Validators.required]],
    rrOrLrNum: ['', [Validators.required]],
    vehicleNo: ['', [Validators.required]],
    transport: ['', [Validators.required]],
    freightTotal: ['', [Validators.required]],
    frightPaidAdvance: ['', [Validators.required]],
    frightToPay: ['', [Validators.required]],

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


 loadedItems: any;
 private cartSub: Subscription;
 private distributorsSub: Subscription;
 private salesPersonSub: Subscription;


  constructor(    private router: Router,
    public formBuilder: UntypedFormBuilder,
    public activatedRoute: ActivatedRoute,
    private cartItemService: CartItemService,
    private distributorsService: DistributorsService,
    private salesPersonService: SalesPersonService,
    private challanService: SalesService,
    private auth: AuthService

    ) {

      // this.activatedRoute.queryParams.subscribe((res)=>{
//         console.log('create page form value', JSON.parse(res.value));
// this.lineItem = JSON.parse(res.value);
// console.log('newdatapoint', this.lineItem);
//
    // });
    }

    // get items(): FormArray {
    //   return this.modelForm.get('items') as FormArray;
    // }

  ngOnInit() {
    // this.getModel();

    // this.getAllProducts();



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
    // this.getModel();


    this.cartSub = this.cartItemService.places.subscribe(item => {
      this.loadedItems = item;
    });
    console.log('asdasd', this.loadedItems);


    console.log('asdasd enter', this.loadedItems);

    this.itemsCart = this.loadedItems;

    console.log('itemscart', this.itemsCart);
    this.calculate();

// this.addItem();
  }



  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message,
  //     duration: 2000
  //   });
  //   toast.present();
  // }


  async getAllDistributors() {


  //   this.data = {};
  //   this.cartData = {};
  //   this.storedData = {};
  //   this.ngxUiLoader.startLoader('loader-03');
    this.distributorsSub = this.distributorsService.getDistributors().subscribe(res => {
      this.distributors = res.data;
      this.toDistributors = res.data;




console.log('modelformdistributorsubscribe', this.modelForm);
  // this.ngxUiLoader.startLoader('loader-03');
    console.log('distributosubscribe', this.distributors);
    console.log('TOdistributosubscribe', this.toDistributors);

    }, error => {
      // this.ngxUiLoader.stopLoader('loader-03');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });

  }



//   getAllSalesPersons() {
//     this.salesPersonSub = this.salesPersonService.getSalesPersons().subscribe(res => {
//       this.salesPersons = res.data;




// // console.log('modelformdistributorsubscribe', this.modelForm);
//   // this.ngxUiLoader.startLoader('loader-03');
//     console.log('salesperson subscribe', this.salesPersons);

//     }, error => {
//       // this.ngxUiLoader.stopLoader('loader-03');
//       // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
//     });


//   }


  fromDistributorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    // eslint-disable-next-line no-underscore-dangle
    console.log('selected fromdistributorid', event.value._id);

    console.log('selected fromdistributorname', event.value.companyName);
  // eslint-disable-next-line no-underscore-dangle
  // this.getProduct(event.value._id);

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
  // eslint-disable-next-line no-underscore-dangle
  console.log('selected todistributorid', toevent.value._id);

  console.log('selected todistributorname', toevent.value.companyName);
// eslint-disable-next-line no-underscore-dangle
// this.getProduct(event.value._id);

this.modelForm.patchValue({

  // eslint-disable-next-line no-underscore-dangle
  toDistributorId: toevent.value._id,

  toDistributorName: toevent.value.companyName,

});

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





// formatDate(value: string) {
//   return format(parseISO(value), 'MMM dd yyyy');
// }




formatDate(value: string) {
  console.log(value);
  const date = format(parseISO(value), 'MMM d, yyyy');
  console.log(date);
  this.modelForm.patchValue({
    salesOrderDate: date
  });
  return date;
}



onCreateChallan() {
// console.log('formvalue',this.modelForm.value);
// console.log('price', this.model.totalPrice);
// this.modelForm.name = this.model.totalPrice;
// this.modelForm.items = this.model.products;


// this.modelForm.items=


// for (product in this.model.products
// for (const item of this.model.products) {
// this.modelForm.items = this.model.products;
// }

// console.log('productstotal', this.model.products);
this.addItem();
console.log('combined', this.modelForm.value);
//     // if (!this.modelForm.valid) {
//     //   this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
//     //   return false;
//     // } else {
//     //   let product = this.productForm.value;
//     //   if (this.productImage) {
//     //     product["productImage"] = this.productImage;
//     //   }

//     console.log(this.modelForm.value);
    this.challanService.createIpt(this.modelForm.value).subscribe((res) => {
      // loadingEl.dismiss();
      // this.productForm.reset();

      this.router.navigate(['/sales-order']);
      // this.presentToast(MessageLib.PRODUCT_ADD_SUCCESS);
          }, error => {
        // this.ngxUiLoader.stopLoader("loader-03");
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);

    });
  // }
  }



  // addItem(itemsCart) {
  //   this.items.push(itemsCart

  //     // this.formBuilder.group({
  //   //  }
  //   //  )
  //    );
  // }

  addItem() {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <UntypedFormArray> this.modelForm.get('items');



    console.log(control);

    console.log('itemscartadditem', this.itemsCart);

    // push the value from stepTextArea to array

    // control.push(new FormControl(this.itemsCart));


    for (var i of this.itemsCart) {
      control.push(new UntypedFormControl(i));
  }




    // Array.prototype.push.apply(control, this.itemsCart);



    // forEach(element => {
    //   this.model.totalQuantity += element.quantity;
    //   this.model.totalPrice += element.value;
    //   // this.model.totalPrice += (parseFloat(element.price) * parseFloat(element.quantity));
    // });





    // control.push(this.itemsCart);
    // reset
    // this.item.get('stepTextArea').reset()
    // console.log('formvalue', this.modelForm)
  }



  // removeCriteria(index) {
  //     this.criterias.removeAt(index)
  // }


  async calculate() {
    let product = this.itemsCart.filter(x => x.quantity > 0);
    this.model.products = product;
    this.model.totalPrice = 0;
    this.model.totalQuantity = 0;

    // this.model.grandTotal = 0;
    product.forEach(element => {
      this.model.totalQuantity += element.quantity;
      this.model.totalPrice += element.amount;
      // this.model.totalPrice += (parseFloat(element.price) * parseFloat(element.quantity));
    });

    this.model.totalPrice = parseFloat(this.model.totalPrice).toFixed(2);
    // this.model.grandTotal = (parseFloat(this.model.totalPrice) + parseFloat(this.model.deliveryCharge)).toFixed(2);
    // if(this.model.totalItem == 0) {
    //   this.model.totalItem = 0;
    //   this.model.totalPrice = 0;
    //   this.model.grandTotal = 0;
    //   // await this.clearCart();
    //   this.model = null;
    // }
    console.log('cartfinaldata: ', this.model);


    this.modelForm.patchValue({
      // status: res.data.status,
      totalValue: this.model.totalPrice,
      totalQuantity: this.model.totalQuantity
    });
    console.log('finallllllcart', this.modelForm.value);

  }







  // deleteItem()

  onDeleteItem(index) {

    // this.itemsCart.deleteFromCart(i);
        // this.itemsCart.pop(i);
console.log(index);


// const items = this.itemsCart.filter(item => item.id === i.id);
// console.log(items);
// console.log(items[0]);
// const index = this.itemsCart.indexOf(items[0]);
if (index > -1) {
     this.itemsCart.splice(index, 1);
}
this.calculate();


}



ngOnDestroy( ) {
  // this.clearCart();
}
















}
