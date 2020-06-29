import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit {

  constructor(private router: ActivatedRoute,) { }
  orderid:any
  ngOnInit() {
    this.orderid = this.router.snapshot.paramMap.get('id');
    //alert(orderid)
  }

}
