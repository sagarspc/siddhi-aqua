import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../_services/token-storage.service';
import $ from "jquery";
import { Router,NavigationEnd, ActivatedRoute } from '@angular/router';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-shop-category',
  templateUrl: './shop-category.component.html',
  styleUrls: ['./shop-category.component.css']
})
export class ShopCategoryComponent implements OnInit {
  user:any
  value:any
  page = 1;
    pageSize =3;
    products: any;
    categories:any;
    brands:any;
    obj:any;
    currentRate:any
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
      this.currentRate= 4
      var slider = document.getElementById("myRange");
      var output = document.getElementById("demo");
      output.innerHTML = slider['value'];

      slider.oninput = function() {
        output.innerHTML = slider['value'];

      }
      
      
      this.user = this.tokenStorageService.getUser();
      this.data.getProfile();
      this.getProducts();
      this.getCategories();
      this.getBrands(); 
    }

    async getProducts(){
      try {
        
        this.spinner.show();
        
        const data = await this.rest.get(
          'http://192.168.1.207:8080/api/products'
        );
        data['success']
          ? (this.products = data['products'])
          : this.data.error('Could not fetch products.');
          
          if(data['success']){
            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.obj = this.products
              this.spinner.hide();
              
            }, 1000);
            
          }
          


      } catch(error) {
        this.data.error(error['message']);
        
      }
    }
  async getCategories(){
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
 async getBrands(){
      try {
        const data = await this.rest.get(
          'http://192.168.1.207:8080/api/brands'
        );
        data['success']
          ? (this.brands = data['brands'])
          : this.data.error('Could not fetch brands.');
        
      } catch (error) {
        
      }
    }
   
    addProductCart (products) {
      this.data.addProductCart(products)
        ? this.data.success(this.toastr.success('Product successfully added to cart'))
        : this.data.error(this.toastr.error('Product has already been added to cart'));
        //this.toastr.success('Product successfully added to cart');
        //this.toastr.error('Product already added to cart');
    }
  
    getProductsByCategory(id) {
      
      var obj1 = this.products.filter(function(node) {
          return node.category._id==id;
      });
      this.obj = []
      this.spinner.show()
      if(obj1.length > 0){
        this.obj = obj1
        this.spinner.hide();
      }
      else{
        setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 3000);
      }
      
    
  }


  getProductsByBrand(id) {
    var obj1 = this.products.filter(function(node) {
        return node.brand._id==id;
    });
    this.obj = []
    this.spinner.show()
    if(obj1.length > 0){
      this.obj = obj1
      this.spinner.hide();
    }
    else{
      setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    }
    
  
}
  
  
    // getProductsByCategory(id){
    //   return this.products.filter(x => x.category._id === id);
    // }
    onPriceChange(e:any){
     if(e.target.value >160){
      var obj1 = this.products.filter(function(node) {
        return node.price >=160 && node.price <= e.target.value;
    });
    this.obj = []
    this.spinner.show()
    if(obj1.length > 0){
      this.obj = obj1
      this.spinner.hide();
    }
    else{
      setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    }
  }
  else{
    this.getProducts();
  }
  }
 }
