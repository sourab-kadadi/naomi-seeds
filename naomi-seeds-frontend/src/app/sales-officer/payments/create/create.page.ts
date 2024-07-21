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
import { PaymentsReceivedService } from 'src/app/service/payments-received.service';
// import { CartItemInvoiceService } from '../../service/cart-item-invoice.service';
import { UploadService } from '../../../service/service/upload.service';
import { environment } from '../../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { GeneralDropdownsService } from '../../../service/general-dropdowns.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  @ViewChild('selectComponentTo') selectComponentTo: IonicSelectableComponent;
  @ViewChild('selectComponentProduct') selectComponentProduct: IonicSelectableComponent;
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  value = 0;
  bufferValue = 100;
  progressBarVisible = false;
  imageData: any;
  s3path: any = environment.s3Url;
  dateValue: any;
  // images: LocalFile[] = []; //for camera
  signedUrl: any;
  image: any;
  imagesPaths = [];
  imageItem: any = this.formBuilder.group({
    filePath: ['', [Validators.required]],
  });

  modelForm: any = this.formBuilder.group({
    distributorId: ['', [Validators.required]],
    distributorName: ['', [Validators.required]],
    amount: ['', [Validators.required]],
    categoryTypeId: ['', [Validators.required]],
    categoryType: ['', [Validators.required]],
    paymentReceivedDate:  ['', [Validators.required]],
    salesOfficerNote: [''],
    image: this.formBuilder.array([]),
  });

  businessCategories: any[];
  businessCategory: any;
  packingSizeunit: any;
  itemsCart = [];
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
    count: 10250000,
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
    private generalDropdownsService: GeneralDropdownsService,
    private salesPersonService: SalesPersonService,
    private challanService: SalesService,
    private auth: AuthService,
    public alertController: AlertController,
    private ngxUiLoader: NgxUiLoaderService,
    private toastController: ToastController,
    private productsService: ProductsService,
    private paymentService: PaymentsReceivedService,
    private uploadService: UploadService,
  ) {

  }

  ngOnInit() {

    this.getAllDistributors();
    this.getAllActivePaymentBusinessCategory();
    // this.getAllProducts();

  }

  ionViewWillEnter() {
    this.itemsCart = [];
    this.modelForm.reset();
    this.imagesPaths = [];

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

  async getAllActivePaymentBusinessCategory() {
    this.ngxUiLoader.startLoader('loader-create-requirement');
    this.generalDropdownsService.findActivePaymentsBusinessCategories().subscribe(res => {
      this.businessCategories = res.data;
      console.log(res.data);
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
      distributorId: toevent.value._id,
      distributorName: toevent.value.companyName,
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


  async onCreateChallan() {
    for (let img of this.imagesPaths) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const control = <UntypedFormArray>this.modelForm.get('image');
      control.push(new UntypedFormControl(img));
    }

    this.ngxUiLoader.startLoader('loader-create-requirement');
    this.paymentService.createPaymentReceipt(this.modelForm.value).subscribe((res) => {
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
        this.router.navigate(['/sales-officer/payments']);
        this.presentToast(res.message || MessageLib.SALES_ORDER_GENERATE_SUCCESS);
      }
    }, error => {
      this.ngxUiLoader.stopLoader('loader-create-requirement');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
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




  //   onChangeCategory(event: {
  //     component: IonicSelectableComponent;
  //     value: any;
  //   }) {
  //  this.modelForm.patchValue({
  //     // eslint-disable-next-line no-underscore-dangle
  //     // categoryType : event.value._id,
  //     categoryType: event.value.name,
  //   });

  //   }


  onChangeCategory(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    console.log(event);
    this.modelForm.patchValue({
      categoryTypeId: event.value._id,
      categoryType: event.value.name,
    });
  }

  saveImage(event) {
    this.image = event;

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.imagesPaths.push(this.image);
  }

  deleteImage(i) {
    this.imagesPaths.splice(i, 1);
    // this.imageData.reset();
    // this.saveImage(this.imageData);
    // this.onSave.emit({data: this.imageData});
  }


  formatDate(value: string) {
    const date = format(parseISO(value), 'MMM d, yyyy');
    this.modelForm.patchValue({
      paymentReceivedDate: date
    });
    return date;
  }











  async uploadFileToS3(event: any) {
    this.value = 0;
    this.progressBarVisible = true;
    let file = event.target.files[0];
    this.ngxUiLoader.startLoader('loader-add-product');
    // this.isActive = false;
    let presignedUrl: any = await this.uploadService.getS3Url().toPromise();
    this.uploadService.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
      this.ngxUiLoader.stopLoader('loader-add-product');
      // this.isActive = true;
      if (data.type === HttpEventType.Response) {
        this.progressBarVisible = false;
        // this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
        this.imageData = { filePath: presignedUrl.data.fields.key };
        // this.onSave.emit({data: this.imageData});
        this.saveImage(this.imageData);
      }
      if (data.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * data.loaded / data.total);
        this.value = percentDone;
      }
    }, error => {
      // this.isActive = true;
      this.ngxUiLoader.stopLoader('loader-add-product');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });
  }








}
