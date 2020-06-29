//Order Details component.ts - Type Script file that contains code to render details of the order to elearning application


//including the required files and services
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { SendMailServiceService } from '../send-mail-service.service';
import { Subscription } from 'rxjs';
//component specific details
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})

//exporting OrderDetails component for reuse 
export class OrderdetailsComponent implements OnInit {
  user:any
  isLoggedIn = false;
  showAdminBoard = false;
  options = [
    { name: "Created", value: 1 },
    { name: "Shipped", value: 2 },
    { name: "En Route", value: 3 },
    { name: "Arrived", value: 4 }
  ]

orderId: any;
paymentID:any;
products: any;
orderDate:string
orderTotal:number
orderStatus:string

selectedOption: string;
selectedOptionID:number;
  printedOption: string;

order = {
  totalPrice: '',
  products: [],
  status:''
};
refund={
  amount:0,
  speed:''
}
serviceTax:number
delcharges:number
quantities = [];
public subscription: Subscription;
currentAddress:any
sendInfo = {
  orderID:'',
  name: '',
  email: '',
  amount:'',
  item:0,
  status:'',
  basicAmount:'',
  address:''

};
  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private sendmailservice: SendMailServiceService,
    private tokenStorageService: TokenStorageService
  ) {}


 async ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.orderId = res['id'];
      this.getProducts();
      this.getVerifiedOrders();
      this.getAddress()
    });

   

    this.data.getProfile();
    this.user = this.tokenStorageService.getUser();
    this.selectedOption = this.options[0].name
    //this.selectedOptionID = this.options[0].value
    //alert(this.orderStatus)
    this.serviceTax = 20
    this.delcharges = 50
  }

  

async getProducts(event?: any) {
    if (event) {
      this.products = null;
    }
    try {
      const data = await this.rest.get(
        `http://192.168.1.207:8080/api/accounts/orders/${this.orderId}`);
      data['success']
            ? (this.products = data['order'])
            : this.data.error(data['message']);
            this.order = data['order']
           // this.order.status = ""
            //console.log(this.order)
            this.orderDate = this.products.crated
            this.orderStatus = this.products.status
           // alert(this.orderStatus)
            this.orderTotal = parseInt(this.products.totalPrice)
            this.products=this.products.products;
     
    } catch (error) {
      this.data.error(error['message']);
    }
  }

 async CancelledOrder(){
    this.order.status = "Cancelled"
    try {
      if (this.order) {
        const data = await this.rest.put(
          `http://192.168.1.207:8080/api/seller/orders/${this.orderId}`,
          this.order
        );
        if(data['success']){
          var sendmailData = data['order']
          console.log('sendmailData',sendmailData)
          this.instantRefund(sendmailData)
          //this.sendMail(sendmailData)
        }
        data['success']
          ? this.router.navigate(['/order-tracking/'+ this.orderId])
            .then(() => this.data.success(data['message']))
            .catch(error => this.data.error(error))
          : this.data.error(data['message']);

         
          
         
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  }

 async getVerifiedOrders(){
    try {
        const verifiedOrder = await this.rest.get(
          `http://192.168.1.207:8080/api/verifyPayement`);
          this.paymentID = verifiedOrder['payment'][0].razorpay_payment_id
          console.log(this.paymentID)
        }
     catch (error) {
      this.data.error(error['message']);
    }
  }
  async instantRefund(mailData){

    try {
      this.refund.amount = this.orderTotal
      this.refund.speed = "optimum"
        const refund = await this.rest.post(
          `http://192.168.1.207:8080/api/payments/${this.paymentID}/refund`,
          this.refund
        );
        this.sendMail(mailData);
      }
     catch (error) {
      this.data.error(error['message']);
    }
  }

  
  ChnageStausByAdmin() {
    //his.printedOption = this.selectedOption;
    this.order.status = this.selectedOption
    try {
      if (this.order) {
        const data = this.rest.put(
          `http://192.168.1.207:8080/api/seller/orders/${this.orderId}`,
          this.order
        );
        if(data['success'])
        window.location.reload()
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  }

  trackOrder(){
    window.location.reload()
  }

  async getAddress(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/test/address'
      );
      this.currentAddress = data['address'];
    } catch (error) {
      this.data.error(error['message']);
    }
  }
  get cartItems() {
    //this.toastr.success('Order generate Successfully');
    return this.data.getCart();
  }
  get cartTotal() {
    //var total = this.serviceTax + this.delcharges;
    
    var total = this.serviceTax + this.delcharges;
    this.cartItems.forEach((data, index) => {
      total += data['price'] * this.quantities[index];
      
    });
    return total;
  }

 sendMail(orderData){
   console.log(orderData._id)
    this.sendInfo.orderID = orderData._id
    this.sendInfo.name = this.order['owner'].username
    this.sendInfo.email = this.order['owner'].email
    this.sendInfo.status = this.order.status
    this.sendInfo.amount = JSON.stringify(orderData.totalPrice)
    this.sendInfo.address = this.currentAddress.addr1 + ' ' + this.currentAddress.city + ' ' + this.currentAddress.state     
    this.sendInfo.basicAmount = JSON.stringify(orderData.totalPrice - 70)
    this.sendInfo.item = orderData.products.length
    console.log(this.sendInfo)
    this.subscription = this.sendmailservice.sendEmail(this.sendInfo).
        subscribe(data => {
          let msg = data['message']
          //alert(msg);
           console.log(data, "success");
          if(data['success']){
          this.cartItems.forEach( (myObject, index) => {
            this.removeProduct(index,myObject)
          }); 
          //this.router.navigate(['/order-success'])
         // window.location.reload();
        }
        }, error => {
          console.error(error, "error");
        } );
  }

  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }
}
