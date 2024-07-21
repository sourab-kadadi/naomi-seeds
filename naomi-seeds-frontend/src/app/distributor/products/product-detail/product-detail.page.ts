import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../service/products.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  // loadedProduct: Product[];
  product: any;
  // product: any[] = [];


  private productSub: Subscription;


  constructor(

    private route: ActivatedRoute,
    private navCtrl: NavController,
    private productsService: ProductsService,
    private router: Router
  ) {}



    ngOnInit() {
    this.getProduct();

    }


  getProduct() {
    this.route.paramMap.subscribe(paramMap => {
      // if (!paramMap.has('productId')) {
      //   // redirect
      //   return;
      // }
      // const productId = paramMap.get('productId');
      this.productSub = this.productsService.getProductById(paramMap.get('productId')).subscribe(product => {
        this.product = product.data;

      });
      // console.log(this.productSub);
      console.log(this.product);
    });
  }




}
