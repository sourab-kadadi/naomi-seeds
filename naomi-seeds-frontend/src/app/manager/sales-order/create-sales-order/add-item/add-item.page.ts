import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';

import { Subscription } from 'rxjs';
// import { environment } from '../../environments/environment';
import { NavController, Platform, ToastController } from '@ionic/angular';
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
import  { CartItemService } from '../../../../service/cart-item.service';
// import { CartItemInvoiceService } from '../../../service/cart-item-invoice.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  dateValue: any;

  items: any[];
  inventoryItems: any[];
  item: any;
  dateValue2 = '';
  selectedLotData: any;
  itemQuantity: any;

  price: any;

  filter = {
    page: 0,
    count: 250,
    search: '',
    location: ''
  };

  disc: any = 0;



  tempInventoryDetails: any = this.formBuilder.array([]);

  lotNumberOfPacketsData: any = this.formBuilder.group({
    lotNumberOfPackets: ['', [Validators.required]],
  });


  lineItemForm: any = this.formBuilder.group({
    productName: ['', [Validators.required, Validators.minLength(2)]],
    lotNumber: ['', [Validators.required]],
    crop: ['', [Validators.required]],
    hnsNumber: ['', [Validators.required]],
    quantity: ['', [Validators.required]],
    numberOfPacketsOrdered: ['', [Validators.required]],
    packingSizeinKg: ['', [Validators.required]],
    rate: [, [Validators.required]],
    unit: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    productDetails: this.formBuilder.group({
      cropType: [''],
      morphologicalCharacters: this.formBuilder.array([]),
      specialFeaturesUSPS: this.formBuilder.array([]),
    }),
    lotDetails: this.formBuilder.group({
      processingPlantNo: [''],
      totalQtyOfLotsInKgs: [''],
      numberOfPackets: [''],
      dateOfTest: [''],
      lableNoFrom: [''],
      labelNoTo: [''],
      missingNo: [''],
      germinationInPercentage: [''],
      pureSeedInPercentage: [''],
      inertMatterNotMoreThanPercent: [''],
      otherCropSeedsNotMoreThanPerKg: [''],
      geneticPurityInPercentage: [''],
      dateOfPacking: [''],
      validUpto: [''],
      seedGrowerNameAndAddress: [''],
      seedPurchasedFrom: [''],
      maleSeedUsed: [''],
      femaleSeedUsed: [''],
      sowingSeason: [''],
      seedProductionSupervisor: [''],
      seedProcessingSupervisor: ['']
    }),
  });







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

    private router: Router,

    private cartItemService: CartItemService
    // private auth: AuthServiceService
  ) { }

  ngOnInit() {

    this.getAllProducts();

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
    //   this.ngxUiLoader.startLoader('loader-03');
    this.productsSub = this.productsService.getProducts(this.filter).subscribe(res => {
      this.items = res.data;
      // this.ngxUiLoader.startLoader('loader-03');
      console.log(this.items);



    }, error => {
      this.ngxUiLoader.stopLoader('loader-03');
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });


    //   let cart: any = await this.getCart();
    //   console.log('cart: ', cart);
    //   if(cart?.value) {
    //     this.storedData = JSON.parse(cart.value);
    //     console.log('storedData: ', this.storedData);
    //     // if(this.id == this.storedData.restaurant.uid && this.products.length > 0) {
    //       this.products.forEach((element: any) => {
    //         this.storedData.products.forEach(ele => {
    //           // if(element.id !== ele.id) {
    //           //   return;};
    //           element.quantity = ele.quantity;
    //         });
    //       });
    //     // }
    //     this.cartData.totalItem = this.storedData.totalItem;
    //     this.cartData.totalPrice = this.storedData.totalPrice;
    // }
  }









  itemChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {

    // eslint-disable-next-line no-underscore-dangle
    this.getProduct(event.value._id);
  }



  itemChangeInventory(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {

    console.log('event.value', event.value);
    this.lineItemForm.patchValue({

      lotNumber: event.value.lotNo,
      rate: event.value.pricePerKg,
      packingSizeinKg: event.value.packingSizeinKg,
      lotDetails: {
        processingPlantNo: event.value.processingPlantNo,
        totalQtyOfLotsInKgs: event.value.totalQtyOfLotsInKgs,
        numberOfPackets: event.value.numberOfPackets,
        dateOfTest: event.value.dateOfTest,
        lableNoFrom: event.value.lableNoFrom,
        labelNoTo: event.value.labelNoTo,
        missingNo: event.value.missingNo,
        germinationInPercentage: event.value.germinationInPercentage,
        pureSeedInPercentage: event.value.pureSeedInPercentage,
        inertMatterNotMoreThanPercent: event.value.inertMatterNotMoreThanPercent,
        otherCropSeedsNotMoreThanPerKg: event.value.otherCropSeedsNotMoreThanPerKg,
        geneticPurityInPercentage: event.value.geneticPurityInPercentage,
        dateOfPacking: event.value.dateOfPacking,
        validUpto: event.value.validUpto,
        seedGrowerNameAndAddress: event.value.seedGrowerNameAndAddress,
        seedPurchasedFrom: event.value.seedPurchasedFrom,
        maleSeedUsed: event.value.maleSeedUsed,
        femaleSeedUsed: event.value.femaleSeedUsed,
        sowingSeason: event.value.sowingSeason,
        seedProductionSupervisor: event.value.seedProductionSupervisor,
        seedProcessingSupervisor: event.value.seedProcessingSupervisor
      },

    });
    console.log(this.lineItemForm.value);
    this.showPageDetails = !(this.showPageDetails);

  }





  getProduct(productId) {
    console.log('getproduct', productId);
    this.productsService.getProductById(productId).subscribe(res => {
      // this.ngxUiLoader.stopLoader("manage-loader");
      this.item = res.data;
      this.inventoryItems = res.data.inventoryDetails;
      console.log('productData', res.data);
      // if (res.data && res.data.myProduct) {
      // this.mode = "update";
      // this.productForm.patchValue({
      //   status: res.data.myProduct.status,
      //   unitValue: res.data.myProduct.unitValue,
      //   sellingPrice: res.data.myProduct.sellingPrice
      // })
      // } else {
      console.log('this.lineItemForm', this.lineItemForm);

      for (let i of res.data.specialFeaturesUSPS) {
        this.lineItemForm?.value.productDetails?.specialFeaturesUSPS?.push(i);
      }
      for (let i of res.data.morphologicalCharacters) {
        this.lineItemForm?.value.productDetails?.morphologicalCharacters?.push(i);
      }
      for (let i of res.data.inventoryDetails) {
        this.tempInventoryDetails?.value.push(i);
      }
      console.log('res.data.specialFeaturesUSPS', ...res.data.specialFeaturesUSPS);

      console.log('this.tempInventoryDetails', this.tempInventoryDetails);

      this.lineItemForm.patchValue({

        hnsNumber: res.data.hnsNumber,
        productName: res.data.name,
        crop: res.data.crop,
        unit: res.data.unit,
        productDetails: {
          cropType: res.data.cropType,
        },
      });

      console.log('productForm patched', this.lineItemForm.value);
      // }
    },
      error => {
        // this.ngxUiLoader.stopLoader("manage-loader");
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    console.log('formdata2', this.lineItemForm.value.prductDetails);

    //   this.route.paramMap.subscribe(paramMap => {
    //     // if (!paramMap.has('productId')) {
    //     //   // redirect
    //     //   return;
    //     // }
    //     // const productId = paramMap.get('productId');
    //     this.productSub = this.productsService.getProductById(paramMap.get('productId')).subscribe(product => {
    //       this.product = product.data;

    //     });
    //     // console.log(this.productSub);
    //     console.log(this.product);
    //   });
  }




  ionChange() {
    console.log('datevalue', this.dateValue);

    // console.log('pop', this.popoverDatetime.value);
  }





  onAddLineItem() {
    console.log('formvalue', this.lineItemForm.value);
    console.log('formvalue subdict', this.lineItemForm.name);
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
        this.lineItemForm.value.unit,
        // this.lineItemForm.value.amount,
        // this.lineItemForm.value.productDetails,
        // this.lineItemForm.value.lotDetails,
      )
      .subscribe(() => {
        // loadingEl.dismiss();
        // this.form.reset();
        this.router.navigate(['sales-order/create-sales-order']);
      });
    // });






    // this.router.navigate(['/delivery-challan/create-delivery-challan'],{
    //   queryParams: {
    //      value : JSON.stringify(this.lineItemForm.value)
    //     },
    //   });


  }






  onAddQuantity() {
    this.inactive = !(this.inactive);
    this.lineItemForm.value.numberOfPacketsOrdered = this.lotNumberOfPacketsData?.value.lotNumberOfPackets;
    this.itemQuantity = parseFloat(this.lineItemForm?.value.packingSizeinKg) * parseFloat(this.lineItemForm?.value.numberOfPacketsOrdered);
    let itemValue = parseFloat(this.lineItemForm?.value.rate) * parseFloat(this.itemQuantity);
    this.lineItemForm.patchValue({
      quantity: this.itemQuantity,
      amount: itemValue,
      numberOfPacketsOrdered: this.lotNumberOfPacketsData?.value.lotNumberOfPackets
    });


    console.log('finalLineItemForm', this.lineItemForm.value);

  }



  changeStatus() {
    this.inactive = !(this.inactive);
  }




  // confirm() {
  //   this.datetime.nativeEl.confirm();
  // }

  // reset() {
  //   this.datetime.nativeEl.reset();
  // }

  // formatDate(value: string) {
  //   return format(parseISO(value), 'MMM dd yyyy');
  // }



}
