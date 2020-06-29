import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
brands:any
brandID:any
page = 1;
  pageSize =5;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    config: NgbPaginationConfig
  ) { 
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit() {
    this.getBrands();
  }

  getBranBydID(brandID){
    this.brandID = brandID
    
  }
  
  async deleteBrand(){
    try {
      const data = await this.rest.delete(
        `http://192.168.1.207:8080/api/brand/${this.brandID}`
      );
      if(data['success'])
    //  this.getBrands();
      window.location.reload();
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
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
