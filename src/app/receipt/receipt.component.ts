import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import $ from 'jquery'
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  orderID:any
  orderDetails:any
  
  constructor(private activatedRoute: ActivatedRoute,private rest: RestApiService,
    private data: DataService) { } 
  
  @ViewChild('content', {static: true}) content: ElementRef;

  SavePDF() {
   
    const div = document.getElementById('content');
    const options = {
      background: 'white',
      scale: 1
    };

    html2canvas(div, options).then((canvas) => {

      var img = canvas.toDataURL("image/PNG");
      var doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 3;
      const bufferY = 3;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save('postres.pdf');  
    });
  }
  
  
  async ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.orderID = res['id'];
      this.getOrderById(this.orderID);
  });
}

async getOrderById(orderID){
  if (!orderID) {
    this.orderDetails = null;
  }
  try {
    const data = await this.rest.get(
      `http://192.168.1.207:8080/api/accounts/orders/${this.orderID}`);
    
    if(data['success']){
      this.orderDetails = data['order']
      console.log(this.orderDetails)
    }
          
   
  } catch (error) {
    this.data.error(error['message']);
  }
}
}
