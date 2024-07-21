import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {

  public appPages = [
    // { title: 'Dashboard', url: './folder/Dashboard', icon: 'easel' },
    { title: 'Products', url: '/manager/products', icon: 'file-tray-stacked' },
    // { title: 'Distributors', url: '/distributors', icon: 'earth' },

    { title: 'Sales Order', url: '/manager/sales-order', icon: 'reader' },
    { title: 'Pending Approvals', url: '/manager/pending-approvals', icon: 'reader' },
    { title: 'Payments Received', url: '/manager/payments-received', icon: 'archive' },
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
