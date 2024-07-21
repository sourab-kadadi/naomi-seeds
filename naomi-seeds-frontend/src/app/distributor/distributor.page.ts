import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-distributor',
  templateUrl: './distributor.page.html',
  styleUrls: ['./distributor.page.scss'],
})
export class DistributorPage implements OnInit {

  public appPages = [
    { title: 'Dashboard', url: '/distributor/dashboard', icon: 'easel' },
    { title: 'Products', url: '/distributor/products', icon: 'file-tray-stacked' },
    // { title: 'Distributors', url: '/distributors', icon: 'earth' },

    { title: 'Sales Order', url: '/distributor/sales-order', icon: 'reader' },
    { title: 'Pending Approvals', url: '/distributor/pending-approvals', icon: 'reader' },
    { title: 'Payments Done', url: '/distributor/payments-received', icon: 'archive' },
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
