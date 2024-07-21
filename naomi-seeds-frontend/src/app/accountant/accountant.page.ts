import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accountant',
  templateUrl: './accountant.page.html',
  styleUrls: ['./accountant.page.scss'],
})
export class AccountantPage implements OnInit {
  public appPages = [
    // { title: 'Dashboard', url: '/folder/Dashboard', icon: 'easel' },
    // { title: 'Products', url: '/admin/products', icon: 'file-tray-stacked' },
    // { title: 'Lot Details', url: '/admin/inventory-details', icon: 'card' },
        // { title: 'Distributors', url: '/distributors', icon: 'earth' },
    // { title: 'Sales Order', url: '/folder/Sales Order', icon: 'archive' },
    // { title: 'Delivery Challan', url: '/delivery-challan', icon: 'reader' },

    // { title: 'Internal Party Transfer', url: '/folder/Internal Party Transfer', icon: 'trail-sign' },
    { title: 'Payments Received', url: '/accountant/payments-received', icon: 'card' },
    // { title: 'Expense management', url: '/folder/Expense management', icon: 'receipt' },
    // { title: 'Reports', url: '/folder/Reports', icon: 'analytics' },
    { title: 'Account Statements', url: '/accountant/account-statements', icon: 'reader' },
    // { title: 'User Management', url: '/admin/user-management', icon: 'people' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
