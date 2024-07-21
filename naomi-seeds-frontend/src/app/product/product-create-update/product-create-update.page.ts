import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, UntypedFormControl, UntypedFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { ProductsCategoryService } from 'src/app/products-category/service/products-category.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-create-update',
  templateUrl: './product-create-update.page.html',
  styleUrls: ['./product-create-update.page.scss'],
})
export class ProductCreateUpdatePage implements OnInit {


  cropId: any;
productId: any;

  value = 0;
  bufferValue = 100;
  progressBarVisible = false;
  imageData: any;
  s3path: any = environment.s3Url;

  signedUrl: any;
  image: any;

  isToggleChecked= true;
  //buttons for ngIf
  resetMorfButton = false;
  morfActive = false;
  isMorf = false;
  featureActive = false;
  resetFeatureButton = false;
  morphologicalCharacters = [];
  specialFeaturesUSPS = [];

  productCategories: any[] = [];
productCategory: any;

  imagesPaths = [];
  isActive = true;
  featureItem: any = this.formBuilder.group({
    name: ['', [Validators.required]]
  });

  morphologicalItem: any = this.formBuilder.group({
    key: ['', [Validators.required]],
    value: ['', [Validators.required]]
  });

  imageItem: any = this.formBuilder.group({
    filePath: ['', [Validators.required]],
  });

  productForm: any = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    cropId: ['', [Validators.required]],
    crop: ['', [Validators.required]],
    cropType: ['', [Validators.required]],
    hsnCode: ['', [Validators.required]],
    image: this.formBuilder.array([]),
    morphologicalCharacters: this.formBuilder.array([]),
    specialFeaturesUSPS: this.formBuilder.array([]),
    truthfulLabel: this.formBuilder.group({
      germinationInPercentageMin: [''],
      geneticPurityInPercentageMin: [''],
      physicalPuritySeedInPercentageMin: [''],
      inertMatterNotMoreThanPercentMax: [''],
      moistureInPercentageMax: [''],
      otherCropSeedsNotMoreThanPerKgMax: [''],
      weedSeedsPerKgMax: [''],
      maleSeedUsed: [''],
      femaleSeedUsed: [''],
    }),
    productAvailableForCurrentSeason: [, [Validators.required]],
    status: [, [Validators.required]],
  });




  mode: 'create' | 'update' = 'create';
  constructor(
    private productService: ProductService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: UntypedFormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private productsCategoryService: ProductsCategoryService
  ) {

    this.mode = this.route.snapshot.data.mode || 'create';
    this.cropId = this.route.snapshot.paramMap.get('productCategoryId');
    this.productId = this.route.snapshot.paramMap.get('productId');
  }

  ngOnInit() {


this.getProductCategoryDropdown();


if (this.mode === 'update') {
  // this.active = false;
  this.ngxUiLoader.startLoader("loader-add-product");
  this.productService.getProductById(this.productId).subscribe({
    next: (res) => {
      console.log(res)

      this.productCategory = {
        _id: res.data.cropId,
        name: res.data.crop
      }
      this.productForm.patchValue({
        name: res.data.name,
        cropId: res.data.cropId,
        crop: res.data.crop,
        cropType: res.data.cropType,
        hsnCode: res.data.hsnCode,
        truthfulLabel: this.productForm.get('truthfulLabel').patchValue({
          germinationInPercentageMin: res.data.germinationInPercentageMin,
          geneticPurityInPercentageMin: res.data.geneticPurityInPercentageMin,
          physicalPuritySeedInPercentageMin: res.data.physicalPuritySeedInPercentageMin,
          inertMatterNotMoreThanPercentMax: res.data.inertMatterNotMoreThanPercentMax,
          moistureInPercentageMax: res.data.moistureInPercentageMax,
          otherCropSeedsNotMoreThanPerKgMax: res.data.otherCropSeedsNotMoreThanPerKgMax,
          weedSeedsPerKgMax: res.data.weedSeedsPerKgMax,
          maleSeedUsed: res.data.maleSeedUsed,
          femaleSeedUsed: res.data.femaleSeedUsed,
        }),
        productAvailableForCurrentSeason: res.data.productAvailableForCurrentSeason,
        status: res.data.status,
    });


    this.imagesPaths = [...this.imagesPaths, ...res.data.image];
    this.productForm.value.specialFeaturesUSPS = [...this.productForm.value.specialFeaturesUSPS, ...res.data.specialFeaturesUSPS];
    // eslint-disable-next-line max-len
    // this.productForm.value.morphologicalCharacters = [...this.productForm.value.morphologicalCharacters, ...res.data.morphologicalCharacters];
    this.morphologicalCharacters=[];
for (let morf of res.data.morphologicalCharacters) {
this.morphologicalCharacters.push(morf);
}

this.specialFeaturesUSPS = [];
for (let spl of res.data.specialFeaturesUSPS) {
  this.specialFeaturesUSPS.push(spl);
        }
    // eslint-disable-next-line no-underscore-dangle
    console.log(this.productForm);
    // eslint-disable-next-line no-underscore-dangle
    this.productId = res.data._id;
    this.featureActive = true;
    // if (res.data.image.filePath !== null) {
      this.imageData = { filePath: res.data.image.filePath };
    // }



  },
    error: (e) => {
      // this.active = true;
      this.ngxUiLoader.stopLoader("loader-add-product");
      // if (e.statusCode && e.statusCode === 401) {
      // this.presentAlert('Unauthorized, please enter valid email and password');
      // } else {
      this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      // }
    },
    complete: () => {
      // this.active = true;
      this.ngxUiLoader.stopLoader("loader-add-product");
    }
  })
}
















  }

  ionViewWillEnter() {
    this.productForm.reset();
    this.resetMorfButton = false;
    this.morfActive = false;
    this.isMorf = false;
    this.featureActive = false;
    this.resetFeatureButton = false;
    this.imagesPaths = [];
    this.morphologicalCharacters = [];
    this.specialFeaturesUSPS = [];
    console.log()

  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get errorControl() {
    return this.productForm.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  onCreateProduct() {
    if (!this.productForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      this.ngxUiLoader.startLoader('loader-add-product');
      this.isActive = false;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      for (let img of this.imagesPaths) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const control = <UntypedFormArray>this.productForm.get('image');
        control.push(new UntypedFormControl(img));
      }
      for (let morf of this.morphologicalCharacters) {
        this.productForm.value.morphologicalCharacters.push(morf);
      }

      for (let spl of this.specialFeaturesUSPS) {
        this.productForm.value.specialFeaturesUSPS.push(spl);
      }


      this.productService.createProduct(this.productForm.value).subscribe((res) => {
        this.ngxUiLoader.stopLoader('loader-add-product');
        this.isActive = true;
        this.productForm.reset();
        this.router.navigate(['/app/product']);
        this.presentToast(MessageLib.PRODUCT_ADD_SUCCESS);
      }, error => {
        this.isActive = true;
        this.ngxUiLoader.stopLoader('loader-add-product');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });

    }
  }





  onUpdateProduct() {
    // this.isSubmitted = true;
    if (!this.productForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      // this.productForm.image.reset();
      // for (let img of this.imagesPaths) {
      //   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      //   const control = <FormArray>this.productForm.get('image');
      //   control.push(new FormControl(img));
      // }

      for (let morf of this.morphologicalCharacters) {
        this.productForm.value.morphologicalCharacters.push(morf);
              }

              for (let spl of this.specialFeaturesUSPS) {
                this.productForm.value.specialFeaturesUSPS.push(spl);
                      }
      this.productForm.value.image = [...this.productForm.value.image, ...this.imagesPaths];
      console.log(this.productForm.value.image);
      // this.inActive = true;
      // this.isLoading=true;
      this.ngxUiLoader.startLoader('loader-add-product');
      this.productService.updateProductById(this.productId, this.productForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader('loader-add-product');
        // this.inActive = false;
        // this.isLoading=false;
        this.presentAlert('Data Updated Successfully!!!');
        this.productForm.reset();
        this.router.navigate(['/app/product/']);
      }, error => {
        // this.inActive = false;
        // this.isLoading=false;
        // this.ngxUiLoader.stopLoader('loader-add-product');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
    }
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

  onAddMorphological() {
    this.morfActive = true;
    this.resetMorfButton = true;
    this.presentToast(MessageLib.DATA_ADD);
    this.morphologicalCharacters.push(this.morphologicalItem.value);
    // this.presentToast(MessageLib.DATA_ADD);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    // const control = <FormArray>this.productForm.get('morphologicalCharacters');
    // control.push(new FormControl(this.morphologicalItem.value));
    this.morphologicalItem.reset();
  }

  resetmorf() {
    this.morphologicalCharacters = [];
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions

    this.morfActive = false;
    this.resetMorfButton = false;
    this.presentToast(MessageLib.FIELD_RESET);
  }

  onDeleteMorf(index) {
    if (index > -1) {
      this.morphologicalCharacters.splice(index, 1);
    }
  }

  onAddItem() {
    this.featureActive = true;
    this.resetFeatureButton = true;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.specialFeaturesUSPS.push(this.featureItem.value);
    // this.presentToast(MessageLib.DATA_ADD);
    this.featureItem.reset();
  }

  resetFeatures() {
    this.specialFeaturesUSPS = [];
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.featureActive = false;
    this.resetFeatureButton = false;
    this.presentToast(MessageLib.FIELD_RESET);
  }


  onDeleteItem(index) {
    if (index > -1) {
      this.specialFeaturesUSPS.splice(index, 1);
    }
  }

  saveImage(event) {
    this.image = event;
console.log(event)
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    this.imagesPaths.push(this.image);



    console.log(this.productForm);
  }

  deleteImage(i) {
    this.imagesPaths.splice(i, 1);
    // this.imageData.reset();
    // this.saveImage(this.imageData);
    // this.onSave.emit({data: this.imageData});
  }





  async uploadFileToS3(event: any) {
    this.value = 0;
    this.progressBarVisible = true;
    let file = event.target.files[0];
    this.ngxUiLoader.startLoader('loader-add-product');
    // this.isActive = false;
    let presignedUrl: any = await firstValueFrom(this.uploadService.getS3Url());
    // let presignedUrl: any = await this.uploadService.getS3Url();
    console.log(presignedUrl)
    this.uploadService.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
      this.ngxUiLoader.stopLoader('loader-add-product');
      // this.isActive = true;
      if (data.type === HttpEventType.Response) {
        this.progressBarVisible = false;
        // this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
        this.imageData = { filePath: presignedUrl.data.fields.key,  type: file.type};
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






  ionViewWillLeave() {
    this.productForm.reset();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <UntypedFormArray>this.productForm.get('morphologicalCharacters');
    control.controls = [];
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const con = <UntypedFormArray>this.productForm.get('specialFeaturesUSPS');
    con.controls = [];
    this.resetMorfButton = false;
    this.morfActive = false;
    this.isMorf = false;
    this.featureActive = false;
    this.resetFeatureButton = false;
  }







   async getProductCategoryDropdown() {
    // this.active = false;
    this.ngxUiLoader.startLoader('loader-add-product');
    this.productsCategoryService.getProductsCategoryDropDown().subscribe({
      next: (res) => {
        if (res.data) {
          this.productCategories = res.data;
        }
        if (res.status === false) {
          this.presentAlert('No Product Categories Found !!!');
        }
      }, error: (e) => {
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        // this.active = true;
        this.ngxUiLoader.stopLoader("loader-add-product");
        this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);

      }, complete: () => {
        // this.active = true;
        this.ngxUiLoader.stopLoader('loader-add-product');
      }
    });
  }



  onChangeProductCategory(event: any) {
    this.productForm.patchValue({
      cropId: event.value._id,
      crop: event.value.cropName,
      cropType: event.value.cropType,
    })
  }


  async onSave() {
    if (this.mode === 'create') {
      this.onCreateProduct();
    } else if (this.mode === 'update') {
      this.onUpdateProduct();
    }
  }



}

















