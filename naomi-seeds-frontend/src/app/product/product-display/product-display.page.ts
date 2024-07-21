import { Component, OnDestroy, OnInit, ViewChild, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../constants/system.const';
import { ProductService } from '../service/product.service';
import { AuthService } from '../../login/auth.service';
import { environment } from '../../../environments/environment';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
// import { SwiperCore } from 'swiper/core';
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  EffectCube,
  EffectFlip


} from 'swiper';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  EffectCube,
  EffectFlip
]);

@Component({
  selector: 'app-product-display',
  templateUrl: './product-display.page.html',
  styleUrls: ['./product-display.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductDisplayPage implements OnInit {

  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    // effect: 'cube',
    // spaceBetween: 30,
    pagination: true,
    loop: true,
    zoom: true,
    autoplay: {
      delay:200
    },
    lazy: true

  };
  // loadedProduct: Product[];
  product: any;
  // product: any[] = [];
  items: any;
  isLoading = false;
  inActive = false;
  s3path: any = environment.s3Url;
  imagePresent = true;


cropId: any = '63fdcb7207a58603c69a5abe';

  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  private productSub: Subscription;
  private filterTimeOut: any = null;
  private searchedItem: any;
  private challansSub: Subscription;
  // loadedProduct: Product[];
  private productsSub: Subscription;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public platform: Platform,
    public alertController: AlertController,
    private productsService: ProductService,
  ) {}


    ngAfterContentChecked() {
      if (this.swiper) {
        this.swiper.updateSwiper({});
      }
    }
    ngOnInit() {
    // this.getProduct();

    }


    ionViewWillEnter() {
      this.getProductById();
    }

  getProductById() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('productId')) {
        this.navCtrl.navigateBack('/admin/products');
        return;
      }
      this.isLoading = true;
      this.inActive = true;
      this.ngxUiLoader.startLoader('loader-product-display');
      this.productSub = this.productsService.getProductById(paramMap.get('productId')).subscribe(res => {
        this.ngxUiLoader.stopLoader('loader-product-display');
        this.product = res.data;
        if (!res.data.image || !res.data.image[0]?.filePath || res.data.image[0]?.filePath === 'string' || res.data.image[0]?.filePath === null ) {
          this.imagePresent = false;
        }
        this.isLoading = false;
        this.inActive = false;
      }, error => {
        this.isLoading = false;
        this.inActive = true;
        this.ngxUiLoader.stopLoader('loader-product-display');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
  });
}



    onEdit(productId: string) {
      this.router.navigate(['/', 'app', 'product', 'product-list', this.cropId, 'update', productId]);
      console.log('Editing item', productId);
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





    doRefresh(event) {
      this.getProductById();
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }

    ngOnDestroy() {
      if (this.productSub) {
        this.productSub.unsubscribe();
      }
    }
}
