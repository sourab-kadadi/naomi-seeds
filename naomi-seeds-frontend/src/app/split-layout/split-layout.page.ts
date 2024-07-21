/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/service/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageLib, PageLocation, Role } from '../constants/system.const';
import { AuthService } from '../login/auth.service';
import { UserServiceService } from '../service/user-service.service';
import { AlertController } from '@ionic/angular';
import { PermissionsDataBehaviourSubjectService } from '../service/permissions-data-behaviour-subject.service';
import { PdfService } from '../service/pdf-temp.service';

@Component({
  selector: 'app-split-layout',
  templateUrl: './split-layout.page.html',
  styleUrls: ['./split-layout.page.scss'],
})
export class SplitLayoutPage implements OnInit {
  tokenData: any;
  userRole: string;
  public appPages: any[] = [];

  public permissionsData: any;

  constructor(public ionStorage: StorageService,
    private authService: AuthService,
    private userService: UserServiceService,
    public alertController: AlertController,
    private permissionsDataBehaviourSubjectService: PermissionsDataBehaviourSubjectService,

    private pdfService: PdfService
  ) {


    // comment this line of code to bypass access
    this.userService.getPermissionsDataByUserProfile().subscribe({
      next: (res) => {
    console.log(res)
        this.permissionsData = res.data.permissionsData;
        this.permissionsDataBehaviourSubjectService.updatePermissionsData(res.data.permissionsData, res.data.userTypeInternalOrExternal, res.data.roles[0], res.data.userLinkToProfileId)
      },
      error: (e) => {
        if (e.statusCode && e.statusCode === 401) {
          this.presentAlert('Unauthorized, please enter valid email and password');
        } else {
          this.presentAlert(e.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        }
      },
      complete: () => this.menuContentDisplay()
    })
  }

  async ngOnInit() {

  }


  ionViewWillEnter() {
    // this.getAccessToken();
    //       this.ionStorage.getTokenData().then( res => {
    //   this.tokenData = res;
    //       this.userRole = this.tokenData.roles[0]; 
    //       if (res) {
    //         this.menuContentDisplay(); 
    //       }
    //     } 
    //  );

    //     let getSession = this.ionStorage.get("token");
    // console.log(getSession)
    // let role = this.ionStorage.get("ROLE");
    // console.log(role)
    // let STATE = this.ionStorage.get("STATE");
    // console.log(STATE)



  }






  async menuContentDisplay() {

    console.log(this.permissionsData)

    // console.log(this.permissionsData.products.CAN_READ);
      this.appPages = [
        // { title: 'Dashboard', url: '/folder/Dashboard', icon: 'easel', permissionStatus: this.permissionsData.products.CAN_READ },
        { title: 'Products Category', url: '/app/products-category', icon: 'card', permissionStatus: this.permissionsData.productsCategory?.CAN_READ },
        { title: 'Product', url: '/app/product', icon: 'file-tray-stacked', permissionStatus: this.permissionsData.products?.CAN_READ},
        { title: 'Product Packing Size', url: '/app/product-packing-size', icon: 'file-tray-stacked', permissionStatus: this.permissionsData.productPackingSize?.CAN_READ},



        // { title: 'Products', url: '/app/products', icon: 'file-tray-stacked', permissionStatus: this.permissionsData.products.CAN_READ},


        
        { title: 'Products lot page', url: '/app/products-lot-page', icon: 'card', permissionStatus: this.permissionsData.lotData?.CAN_READ },
        // { title: 'Distributors', url: '/distributors', icon: 'earth', permissionStatus: this.permissionsData.products.CAN_READ },
        { title: 'Orders(Sales/Return/IPT)', url: '/app/orders', icon: 'archive', permissionStatus: this.permissionsData.salesOrders?.CAN_READ },
        // { title: 'Delivery Challan', url: '/delivery-challan', icon: 'reader', permissionStatus: this.permissionsData.products.CAN_READ },
        { title: 'Payments', url: '/app/payment', icon: 'card', permissionStatus: this.permissionsData.paymentsReceived?.CAN_READ },
        { title: 'Role & Permission Management', url: '/app/role-and-permission-management', icon: 'card', permissionStatus: this.permissionsData.rolesAndPermissionsPageAccess?.CAN_READ },
        { title: 'Account Statements', url: '/app/account-statements', icon: 'reader', permissionStatus: this.permissionsData.products?.CAN_READ },
        // { title: 'User Management', url: '/app/user-management', icon: 'people', permissionStatus: this.permissionsData.users.CAN_READ },
        { title: 'Profile Management', url: '/app/profile-management', icon: 'people', permissionStatus: this.permissionsData.profilePage?.CAN_READ },
        { title: 'Users Management', url: '/app/users-management', icon: 'people', permissionStatus: this.permissionsData.users?.CAN_READ }
      ]
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






  async generatePdf() {
    this.pdfService.generatePdf().subscribe(res => {
console.log('processed', res )
this.presentAlert("pdf gfenerated frontend msg");
}, error => {

      this.presentAlert(`error in generating pdf frontend msg ${error}` );
    });
  }



}
