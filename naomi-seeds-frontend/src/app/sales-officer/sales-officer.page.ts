import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-sales-officer',
  templateUrl: './sales-officer.page.html',
  styleUrls: ['./sales-officer.page.scss'],
})
export class SalesOfficerPage implements OnInit {
  public appPages = [
    // { title: 'Dashboard', url: './folder/Dashboard', icon: 'easel' },
    // { title: 'Products', url: '/admin/products', icon: 'file-tray-stacked' },
    // { title: 'Distributors', url: '/distributors', icon: 'earth' },
    { title: 'Requirement', url: '/sales-officer/requirement', icon: 'reader' },
    { title: 'Sales Order', url: '/sales-officer/sales-order', icon: 'reader' },
    { title: 'Pending Approvals', url: '/sales-officer/pending-approvals', icon: 'reader' },
    { title: 'Payments Received', url: '/sales-officer/payments', icon: 'archive' },
    // { title: 'Inventory', url: '/folder/Inventory', icon: 'file-tray-stacked' },
    // { title: 'products', url: '/sales-officer/products', icon: 'trail-sign' },
    // { title: 'Payments received', url: '/folder/Payments received', icon: 'card' },
    // { title: 'Expense management', url: '/folder/Expense management', icon: 'receipt' },
    // { title: 'Reports', url: '/folder/Reports', icon: 'analytics' },
    // { title: 'User', url: '/user/list', icon: 'people' }
  ];
  // selectedPath = '';
  constructor(
// private router: Router
  ) {
    // this.router.events.subscribe((event: RouterEvent) => {
    //   this.selectedPath = event.url;
    // });
  }

  ngOnInit() {
  }

}
