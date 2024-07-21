import { Component } from '@angular/core';
@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
})
export class AdminComponent {
  public appPages = [
    // { title: 'Dashboard', url: '/folder/Dashboard', icon: 'easel' },
    { title: 'Products', url: '/products', icon: 'file-tray-stacked' },
    { title: 'Inventory', url: '/inventory-details', icon: 'file-tray-stacked' },
    { title: 'Inventory', url: '/inventory_details', icon: 'file-tray-stacked' },
    // { title: 'Distributors', url: '/distributors', icon: 'earth' },
    // { title: 'Sales Order', url: '/folder/Sales Order', icon: 'archive' },
    // { title: 'Delivery Challan', url: '/delivery-challan', icon: 'reader' },
    // { title: 'Inventory', url: '/folder/Inventory', icon: 'file-tray-stacked' },
    // { title: 'Internal Party Transfer', url: '/folder/Internal Party Transfer', icon: 'trail-sign' },
    // { title: 'Payments received', url: '/folder/Payments received', icon: 'card' },
    // { title: 'Expense management', url: '/folder/Expense management', icon: 'receipt' },
    // { title: 'Reports', url: '/folder/Reports', icon: 'analytics' },
    // { title: 'User', url: '/user/list', icon: 'people' }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
