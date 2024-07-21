import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonAccordionGroup,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SalesService } from '../../../service/sales.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';
import {
  MessageLib,
  ngXFgsType,
  ngXLoaderType,
  Role,
} from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  UntypedFormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
// import { SalesPersonService } from '../../../service/sales-person.service';
// import { ProductsService } from '../../../service/products.service';
import { AuthService } from '../../../login/auth.service';
import { popoverController } from '@ionic/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-detail-sales-order',
  templateUrl: './detail-sales-order.page.html',
  styleUrls: ['./detail-sales-order.page.scss'],
})
export class DetailSalesOrderPage implements OnInit {
  @ViewChild(IonAccordionGroup, { static: true })
  accordionGroup: IonAccordionGroup;
  s3path: any = environment.s3Url;
  // challanId: any = '625074a6ab069003976f74d6';
  salesOrderId: any;
  approved: any;
  formData: any;
  salesOrder: any;
  items: any;
  isLoading = false;
  inActive = false;
  // public isApprovedByManagerDC = false;

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
    // this.getAllSalesOrder();
  }

  ionViewWillEnter() {
    this.getAllSalesOrder();
  }

  getAllSalesOrder() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-detail');
    this.route.paramMap.subscribe((paramMap) => {
      // if (!paramMap.has('productId')) {
      //   // redirect
      //   return;
      // }
      // const productId = paramMap.get('productId');
      this.salesOrderSub = this.salesService
        .getSalesOrderByIdAndUserFilter(paramMap.get('salesOrderId'))
        .subscribe(
          (res) => {
            this.isLoading = false;
            this.inActive = false;
            this.ngxUiLoader.stopLoader('loader-detail');
            if (res.status === false){
              this.inActive = true;
              this.presentAlert(res.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
              return;
            }
            this.salesOrder = res.data;
            // eslint-disable-next-line no-underscore-dangle
            this.salesOrderId = res.data._id;
            this.items = this.salesOrder.items;
          },
          (error) => {
            this.isLoading = false;
            this.inActive = true;
            this.ngxUiLoader.stopLoader('loader-detail');
            // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
            this.presentAlert(
              error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT
            );
          }
        );
    });
  }



  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
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
  }

  closeAccordion() {
    this.accordionGroup.value = undefined;
  }

  onClickItem(i) {
    // eslint-disable-next-line no-underscore-dangle
    this.router.navigate(['./', this.items._id]);
  }

  onApproveBySalesOfficerShipping() {
    this.isLoading = true;
    this.inActive = true;
    this.ngxUiLoader.startLoader('loader-detail');
    this.salesService
      .onApproveBySalesOfficerShipping(this.salesOrderId)
      .subscribe(
        (res) => {
          this.approved = res.data;
          this.isLoading = false;
          this.inActive = false;
          this.ngxUiLoader.stopLoader('loader-detail');
          this.presentAlert(MessageLib.WORKFLOW_UPDATE_SUCCESSFUL);
          this.getAllSalesOrder();

        },
        (error) => {
          this.isLoading = false;
          this.inActive = true;
          this.ngxUiLoader.stopLoader('loader-detail');
          this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        }
      );
  }

  doRefresh(event) {
    this.salesOrder.length = 0;
    this.getAllSalesOrder();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
