import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../../../constants/system.const';
import { ProductsService } from '../../../service/products.service';
import { AuthService } from '../../../login/auth.service';
import { environment } from '../../../../environments/environment';
import { UserServiceService } from '../../../service/user-service.service';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.page.html',
  styleUrls: ['./user-display.page.scss'],
})
export class UserDisplayPage implements OnInit {

  // loadedProduct: Product[];
  user: any;
  // product: any[] = [];
  items: any;
  isLoading = false;
  inActive = false;
  s3path: any = environment.s3Url;
  imagePresent = true;

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
    private productsService: ProductsService,
    private userServiceService: UserServiceService,
  ) {}



    ngOnInit() {
    // this.getProduct();

    }


    ionViewWillEnter() {
      this.getProductById();
    }

  getProductById() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) {
        this.navCtrl.navigateBack('/admin/user-management');
        return;
      }
      this.isLoading = true;
      this.inActive = true;
      this.ngxUiLoader.startLoader('loader-user-display');
      this.productSub = this.userServiceService.getUserById(paramMap.get('userId')).subscribe(res => {
        this.ngxUiLoader.stopLoader('loader-user-display');
        this.user = res.data;
        if (!res.data.image || !res.data.image.filePath || res.data.image.filePath === 'string' || res.data.image.filePath === null ) {
          this.imagePresent = false;
        }
        this.isLoading = false;
        this.inActive = false;
      }, error => {
        this.isLoading = false;
        this.inActive = true;
        this.ngxUiLoader.stopLoader('loader-user-display');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
  });
}



    onEdit(productId: string) {
      this.router.navigate(['/', 'admin', 'products', 'product-edit', productId]);
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

    // ngOnDestroy() {
    //   if (this.productSub) {
    //     this.productSub.unsubscribe();
    //   }
    // }
}
