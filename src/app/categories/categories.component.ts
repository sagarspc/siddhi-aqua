import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  page = 1;
  pageSize =5;

  categories: any;
  categoryByID:any;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    config: NgbPaginationConfig
  ) { 
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  async ngOnInit() {
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

  getCategoryByID(categoryID){
    this.categoryByID = categoryID
  }

  async deleteCategory(){
    try {
      const data = await this.rest.delete(
        `http://192.168.1.207:8080/api/categories/${this.categoryByID}`
      );
      if(data['success'])
    //  this.getBrands();
      window.location.reload();
    } catch(error) {
      this.data.error(error['message']);
    }
  }
}
