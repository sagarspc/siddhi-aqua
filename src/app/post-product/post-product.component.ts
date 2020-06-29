import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {

  product = {
    title: '',
    price: 0,
    categoryId: '',
    brandId: '',
    description: '',
    imageUrl: '',
    stock:'',
    product_picture: null
  };

  categories: any;
  brands:any;
  btnDisabled = false;
  options = [
    { name: "In Stock", value: 1 },
    { name: "Out Of Stock", value: 2 }
  ]
  selectedOption: string;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

   ngOnInit() {

    this.getCategories();
    this.getbrands();
    
    this.selectedOption = this.options[0].name
    
  }
 async getCategories(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/categories'
      );
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  async getbrands(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/brands'
      );
      data['success']
        ? (this.brands = data['brands'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }


  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
          if(product.brandId){
            if(product.stock){
          if (product.description) {
            if (product.imageUrl) {
              return true;
            }
            else{
              this.data.error('Please select product image URL.');
            }
            
          } else {
            this.data.error('Please enter description.');
          }
        }
        else{
          this.data.error('Please select stock.');
        }

        }
        else{
          this.data.error('Please select brand.');
        }
        
        } else {
          this.data.error('Please select category.');
        }
        
      } else {
        this.data.error('Please enter a price.');
      }
    } else {
      this.data.error('Please enter a title.');
    }
  }

  fileChange(event: any) {
    this.product.product_picture = ''
  }

  async post() {
    this.btnDisabled = true;
    this.product.stock = this.selectedOption
    try {
      if (this.validate(this.product)) {
        const form = new FormData();
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/seller/products',
          this.product
        );
        data['success']
          ? this.router.navigate(['/profile/myproducts'])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);
      }
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
