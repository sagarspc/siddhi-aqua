//my-orders component.ts - Type Script file that contains code to render orders to elearning application

//including the required files and services
import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

//component specific details 
@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})

//exporting orders component 
export class MyordersComponent implements OnInit {

 myorders: any;
 page = 1;
 pageSize =6;
  constructor(private data: DataService, private rest: RestApiService,config: NgbPaginationConfig,) {
    config.size = 'sm';
    config.boundaryLinks = true;
   }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/accounts/orders'
      );
      data['success']
        ? (this.myorders = data['orders'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }

  }

}
