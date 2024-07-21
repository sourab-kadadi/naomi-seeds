import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from './login/auth.service';
import { StorageService } from './service/service/storage.service';
import { UserServiceService } from './service/user-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // public appPages = [
  //   { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
  //   { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
  //   { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
  //   { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
  //   { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
  //   { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  // ];

  public appPages : any[] = [];
  // @ViewChild(Nav) nav: Nav;
    constructor(public authService: AuthService, private route: Router,     public ionStorage: StorageService,     private userService: UserServiceService) { }
    // constructor(private authProvider: AuthProvider) { } 

    tokenData: any;


    async ngOnInit() {
      await this.ionStorage.getTokenData().then((value) => {
        this.tokenData = value;
      });



      // if (this.tokenData) {
      //   // await this.authService.getAndStoreUserPermissions();
      //   this.route.navigate(['/app']);       
      // } else {
      //   this.route.navigate(['/login']);
      // }




    //   if(true) {
    //     this.appPages = [
    // // { title: 'Dashboard', url: '/folder/Dashboard', icon: 'easel' },
    // { title: 'Products', url: '/products', icon: 'file-tray-stacked' },
    // { title: 'Lot Details', url: '/admin/inventory-details', icon: 'card' },
    //     // { title: 'Distributors', url: '/distributors', icon: 'earth' },
    // // { title: 'Sales Order', url: '/folder/Sales Order', icon: 'archive' },
    // // { title: 'Delivery Challan', url: '/delivery-challan', icon: 'reader' },

    // // { title: 'Internal Party Transfer', url: '/folder/Internal Party Transfer', icon: 'trail-sign' },
    // { title: 'Payments received', url: '/admin/payments-received', icon: 'card' },
    // // { title: 'Expense management', url: '/folder/Expense management', icon: 'receipt' },
    // // { title: 'Reports', url: '/folder/Reports', icon: 'analytics' },
    // { title: 'Account Statements', url: '/admin/account-statements', icon: 'reader' },
    // { title: 'User Management', url: '/admin/user-management', icon: 'people' }
    //     ]

    //   }
    }




    ionViewWillEnter() {
      // if(this.authProvider.isAdmin()) {
console.log('here');


      // else if (this.authProvider.isSalesOfficer()) {
      //   this.pages = [
      //     { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
      //     { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
      //     { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
      //     { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
      //     { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
      //     { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
      //   ]
      // }
    }


    // openPage(url) {
    //   this.nav.setRoot(url);
    // }





}
