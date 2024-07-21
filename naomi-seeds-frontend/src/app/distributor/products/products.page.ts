import { Component, OnDestroy, OnInit } from '@angular/core';

import { ProductsService } from '../../service/products.service';
import { Subscription } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  products: any[] = [];

  private filterTimeOut: any = null;
  // s3path: any = environment.s3Url;

  filter = {
    page: 0,
    count: 15,
    search: '',
    location: ''
  };

  // loadedProduct: Product[];

  private productsSub: Subscription;

  constructor(
    private productsService: ProductsService,
    public navCtrl: NavController,

    private route: ActivatedRoute) {}



  ngOnInit() {
    // this.productsSub = this.productsService.products.subscribe(products => {
    //   this.loadedProducts = products;
    // });
    this.getAllProducts();
  }


  getAllProducts() {
    this.productsSub = this.productsService.getProducts(this.filter).subscribe(res => {
      this.products = res.data;
    console.log(this.products);

    }, error => {
      // this.ngxUiLoader.stopLoader("product-loader");
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });


  }

  // onChangeSearch(event) {
  //   this.filter.page = 0;
  //   if(this.filterTimeOut) {
  //   this.filterTimeOut = clearTimeout(this.filterTimeOut);
  //   }
  //   this.filterTimeOut = setTimeout(() => {
  //     this.getAllProducts();
  //   }, 500);
  // }


// navForWard(id) {
//   this.navCtrl.navigateForward('product-detail/' + id);
// }
// ionViewWillLeave() {
//   this.productsSub.unsubscribe();
//   // console.log('unsubscribe');
// }


}
