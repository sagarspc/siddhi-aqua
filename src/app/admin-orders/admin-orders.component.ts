import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  page = 1;
  pageSize =3;
  orders: any;

  constructor(private data: DataService, private rest: RestApiService,config: NgbPaginationConfig) { 
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/seller/orders'
      );
      data['success']
        ? (this.orders = data['orders'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
