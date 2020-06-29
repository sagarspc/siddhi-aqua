import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.component.html',
  styleUrls: ['./myproducts.component.css']
})
export class MyproductsComponent implements OnInit {
  page = 1;
  pageSize =3;

  products: any;
  productId:any;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    config: NgbPaginationConfig
  ) { 
    config.size = 'sm';
    config.boundaryLinks = true;

  }

  ngOnInit() {
    this.getProducts(); 
  }

  async getProducts(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/seller/products'
      );
      data['success']
        ? (this.products = data['product'])
        : this.data.error(data['message']);
        console.log(this.products)
    } catch(error) {
      this.data.error(error['message']);
    }
  }

  getProductID(ProductID){
    this.productId = ProductID
  }

 async deleteProduct(){
    try {
      const data = await this.rest.delete(
        `http://192.168.1.207:8080/api/seller/products/${this.productId}`
      );
      if(data['success'])
      //this.getProducts();
      window.location.reload();
    } catch(error) {
      this.data.error(error['message']);
    }
  }

}
