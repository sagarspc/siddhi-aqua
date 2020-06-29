import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product = {
    title: '',
    price: 0,
    categoryId: '',
    brandId:'',
    stock:'',
    description: '',
    imageUrl: '',
    product_picture: null
  };
  categories: any;
  brands:any;
  productID:any
  btnDisabled = false;
  options = [
    { name: "In Stock", value: 1 },
    { name: "Out Of Stock", value: 2 }
  ]
  selectedOption: string;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) { }
  selectedID:number

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.productID = res['id'];
      this.rest
        .get(`http://192.168.1.207:8080/api/product/${res['id']}`)
        .then(data => {
          data['success']
            ? (this.product = data['product'])
            : this.router.navigate(['/']);
            this.product.categoryId = this.product['category']._id
            this.product.brandId = this.product['brand']._id
            this.selectedOption = this.product['stock']
        })
        .catch(error => this.data.error(error['message']));
    });
    this.getCategories();
    this.getbrands();
    
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

  validate(product) {
    if (product.title) {
      if (product.price) {
        if (product.categoryId) {
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


  async updateProduct() {
    this.product.stock = this.selectedOption
    this.btnDisabled = true;
    try {
      if (this.validate(this.product)) {
        const form = new FormData();
        const data = await this.rest.put(
          `http://192.168.1.207:8080/api/seller/products/${this.productID}`,
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
