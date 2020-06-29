import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../_services/token-storage.service';
import $ from "jquery";
import { Router,NavigationEnd, ActivatedRoute } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
//import 'owl.carousel2/dist/assets/owl.carousel.css';
//import 'imports?jQuery=jquery!owl.carousel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
user:any
page = 1;
  pageSize =3;
  products: any;
  categories:any;
  obj:any
  roleID:string
  constructor(
    private rest: RestApiService,
    private data: DataService,
    private toastr: ToastrService,
    private tokenStorageService: TokenStorageService,
    private _router:Router,
    route:ActivatedRoute,
    config: NgbPaginationConfig,
    private spinner: NgxSpinnerService
  ) { 
    config.size = 'sm';
    config.boundaryLinks = true;

    this._router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
     // alert()$
     $('.homeClass').each(function(){
       $(this).addClass('active')
     })
        }
    });
  }

  async ngOnInit() {
    //this.roleID = this.data.user.roles[0]
    //console.log(this.data.user.name) 
    
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    this.user = this.tokenStorageService.getUser();

    this.data.getProfile();
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/products'
      );
      data['success']
        ? (this.products = data['products'])
        : this.data.error('Could not fetch products.');
        this.obj = this.products
    } catch(error) {
      this.data.error(error['message']);
      
    }


    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error('Could not fetch categories.');
    } catch(error) {
      this.data.error(error['message']);
    }
   
  }

 
  addProductCart (products) {
    this.data.addProductCart(products)
      ? this.data.success('Product successfully added to cart.')
      : this.data.error('Product has already been added to cart.');
      this.toastr.success('Product successfully added to cart');
  }

  getProductsByCategory(id) {
    
    var obj1 = this.products.filter(function(node) {
        return node.category._id==id;
    });
    console.log(obj1)
    this.obj = []
     this.obj = obj1
}


  // getProductsByCategory(id){
  //   return this.products.filter(x => x.category._id === id);
  // }
  
}
