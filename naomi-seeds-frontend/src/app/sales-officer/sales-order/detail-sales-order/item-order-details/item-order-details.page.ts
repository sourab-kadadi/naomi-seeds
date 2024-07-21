import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonAccordionGroup, NavController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../../service/sales.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UntypedFormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { SalesPersonService } from '../../../service/sales-person.service';
// import { ProductsService } from '../../../service/products.service';
import { AuthService } from '../../../../login/auth.service';
import { popoverController } from '@ionic/core';

@Component({
  selector: 'app-item-order-details',
  templateUrl: './item-order-details.page.html',
  styleUrls: ['./item-order-details.page.scss'],
})
export class ItemOrderDetailsPage implements OnInit {

  @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;

  salesOrderId: any;
  itemId: any;
  approved: any;
  formData: any;
  salesOrder: any;
  items: any;
  item: any;
  isApproved: any;
  isLoading = false;
  inActive = false;


  private salesOrderSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private salesService: SalesService,
    private router: Router,
    public formBuilder: UntypedFormBuilder,
    public toastController: ToastController,
    private ngxUiLoader: NgxUiLoaderService,
    private auth: AuthService,
    public alertController: AlertController

  ) { }

  ngOnInit() {
    this.getSalesOrder();
  }

  getSalesOrder() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-item-detail');
    this.route.paramMap.subscribe(paramMap => {
      // if (!paramMap.has('productId')) {
      //   // redirect
      //   return;
      // }
      // const productId = paramMap.get('productId');
      this.salesOrderSub = this.salesService.getSalesOrderById(paramMap.get('salesOrderId')).subscribe(res => {
        this.salesOrder = res.data;
        this.itemId = paramMap.get('itemId');
        this.salesOrderId = paramMap.get('salesOrderId');
        this.isLoading = false;
        this.inActive = false;
        this.ngxUiLoader.stopLoader('loader-item-detail');
        this.item = this.salesOrder.items.find(({ _id }) => _id === this.itemId);
      },
      (error) => {
        this.isLoading = false;
        this.inActive = true;
        console.log(this.isLoading);
        this.ngxUiLoader.stopLoader('loader-item-detail');
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT
        );
      }
    );
  });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK'],
    });
    await alert.present();
  }

  logAccordionValue() {
    console.log(this.accordionGroup.value);
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
  }

  doRefresh(event) {
    this.salesOrder.length = 0;
    this.getSalesOrder();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}






