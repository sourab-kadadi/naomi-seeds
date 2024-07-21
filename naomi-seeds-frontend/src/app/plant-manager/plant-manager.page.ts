import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant-manager',
  templateUrl: './plant-manager.page.html',
  styleUrls: ['./plant-manager.page.scss'],
})
export class PlantManagerPage implements OnInit {
  public appPages = [
    // { title: 'Dashboard', url: './folder/Dashboard', icon: 'easel' },
    { title: 'Products', url: '/plant-manager/products', icon: 'file-tray-stacked' },
    // { title: 'Distributors', url: '/distributors', icon: 'earth' },
    { title: 'Requirement', url: '/plant-manager/requirement', icon: 'reader' },
    { title: 'Sales Order', url: '/plant-manager/sales-order', icon: 'reader' },
    // { title: 'Pending Approvals', url: '/plant-manager/pending-approvals', icon: 'reader' },
    // { title: 'Payments Received', url: '/plant-manager/payments-received', icon: 'archive' },
    // { title: 'Inventory', url: '/folder/Inventory', icon: 'file-tray-stacked' },
    // { title: 'products', url: '/plant-manager/products', icon: 'trail-sign' },
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
