//Cart component.ts - Type Script file that contains code to render cart feature to elearning application

//including the required files and services 
import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router, NavigationEnd } from '@angular/router';
import { SendMailServiceService } from '../send-mail-service.service';
import { Subscription } from 'rxjs';
import { WindowRefService } from '../window-ref.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { async } from '@angular/core/testing';
//declare var StripeCheckout: StripeCheckoutStatic;
//componnet files specifications 
import $ from "jquery";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})


//exporting the cart component 
export class CartComponent implements OnInit {
  //loader:Boolean
  public subscription: Subscription;
  btnDisabled = false;
  isAddress = true;
  handler: any;
  finalAmount:number
  currentAddress:any
  currentAddress1 = {
    addr1:''
  }
  serviceTax:number
  delcharges:number
  removeCartItem = [];
  quantities = [];
  sendInfo = {
    orderID:'',
    name: '',
    email: '',
    amount:'',
    item:0,
    basicAmount:'',
    address:''

  };
  orders = {
    totalPrice: '',
    products: [],
    status:'',
    //receiptID:0,
    createdBy:''
  };
  orderId:number
  paymentRes:any
  payment = {
    amount:0,
    currency:'INR',
    payment_capture:1,

  }
  isLoggedIn = false;
  user:any
  verifyPayment = {
    order:0,
    razorpay_order_id:'',
    razorpay_payment_id:'',
    razorpay_signature:''
  }
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private sendmailservice: SendMailServiceService,
    private winRef: WindowRefService,
    private tokenStorageService: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
     // alert()$
     $('.homeClass').each(function(){
       $(this).removeClass('active')
     })
        }
    });
  }

  trackByCartItems(index: number, item: any) {
   // console.log(item)
    return item._id;
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

  get beforecartTotal(){
    var beforetotal = 0
    this.finalAmount = 0
    this.cartItems.forEach((data, index) => {
      beforetotal += data['price'] * this.quantities[index];
       });
    return beforetotal;
  }


 
  

  async ngOnInit() {
    this.user = this.tokenStorageService.getUser();
    this.cartItems.forEach(data => {
      this.quantities.push(1);
    });
    if(this.user !==null){
      this.orders.createdBy = this.user.username;
    }
   
    
    this.serviceTax = 20
    this.delcharges = 50
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn){
      this.getAddress()
    }
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

  validate() {
    if (!this.quantities.every(data => data > 0)) {
      this.data.warning('Quantity cannot be less than one.');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else {
      this.data.message = '';
      return true;
    }
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'Siddhi Aquarium',
          description: 'Checkout Payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          },
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error(error);
    }
  }

  async CashOnOrder(){
    if(!this.isLoggedIn){
      this.router.navigate(['/login'])
    }
    else{
      this.orders.totalPrice = JSON.stringify(this.cartTotal)
      this.orders.status = "Created"
     
           this.cartItems.forEach((d, index) => {
             this.orders.products.push({
               product: d['_id'],
               quantity: this.quantities[index],
             });
           });
       
       try {
         if (this.orders) {
           const data = await this.rest.post(
             'http://192.168.1.207:8080/api/seller/orders',
             this.orders
           );
           if(data['success']){
             this.orderId = data['_id']
            this.sendMail(this.orderId);
           }
         }
       } catch (error) {
         this.data.error(error['message']);
       }
    }
  }

 async createRzpayOrder() {
    if(!this.isLoggedIn){
      this.router.navigate(['/login'])
 }
    else{
   this.orders.totalPrice = JSON.stringify(this.cartTotal)
   this.orders.status = "Created"
  
        this.cartItems.forEach((d, index) => {
          this.orders.products.push({
            product: d['_id'],
            quantity: this.quantities[index],
          });
        });
    
    try {
      if (this.orders) {
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/seller/orders',
          this.orders
        );
        if(data['success']){
          this.orderId = data['_id']
         this.payWithRazor(this.orderId);
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }
  
}
  }

  async updateAddress() {
    this.btnDisabled = true;
    try {
      const res = await this.rest.post(
        'http://192.168.1.207:8080/api/test/address',
        this.currentAddress1
      );

      res['success']
        ? (this.data.success(res['message']), await this.data.getProfile())
        : this.data.error(res['message']);
        this.isAddress = false;
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

 async payWithRazor(_id) {
   // alert(_id)
    // const data = await fetch('http://192.168.1.207:8080/api/seller/payment', {method:'POST'}).then(t=>{
    //     t.json()
    // })
    this.payment.amount = this.cartTotal
    this.payment.currency = "INR",
    this.payment.payment_capture = 1
    try {
      if (this.payment) {
        const payData = await this.rest.post(
          'http://192.168.1.207:8080/api/payment',
          this.payment
        );
        if(payData['success']){
          console.log('paydata',payData)
          this.paymentRes = payData['payload']
        }
      }
    } catch (error) {
      this.data.error(error['message']);
    }

    console.log('resonse create order razor pay')
    const options: any = {
      key: 'rzp_test_GWT3anbuTzocbm',
      amount: this.paymentRes.amount, // amount should be in paise format to display Rs 1255 without decimal point
      currency: this.paymentRes.currency,
      name: 'Siddhi Aquarium', // company name or product name
      description: '',  // product description
      order_id: this.paymentRes.id,
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      }
    };
    options.handler = ( async (response, error) => {
      console.log('res',response)
      this.verifyPayment.order = this.orderId
      this.verifyPayment.razorpay_order_id = response.razorpay_order_id
      this.verifyPayment.razorpay_payment_id = response.razorpay_payment_id
      this.verifyPayment.razorpay_signature = response.razorpay_signature

      try {
        if (this.verifyPayment) {
          const verifiedOrder = await this.rest.post(
            'http://192.168.1.207:8080/api/verifyPayement',
            this.verifyPayment
          );
          if(verifiedOrder['success']){
            console.log('verifiedOrder',verifiedOrder)
            this.sendMail(this.orderId)
          }
        }
      } catch (error) {
        this.data.error(error['message']);
      }

    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      console.log('Transaction cancelled.');
      this.deleteOrder(this.orderId)
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  deleteOrder(orderId){
    try {
      const data = this.rest.delete(
        `http://192.168.1.207:8080/api/order/${orderId}`
      );
    } catch(error) {
      this.data.error(error['message']);
    }
  }

   

  // async myOrders(){
   
  
  // }

  sendMail(orderID) {
    console.log(orderID)
      this.sendInfo.orderID = orderID
      
        this.sendInfo.name = this.user.username
        alert(this.sendInfo.name)
        this.sendInfo.email = this.user.email
        this.sendInfo.amount = JSON.stringify(this.cartTotal)
        this.sendInfo.address = this.currentAddress.addr1 + ' ' + this.currentAddress.city + ' ' + this.currentAddress.state     
        this.sendInfo.basicAmount = JSON.stringify(this.cartTotal - 70)
        this.sendInfo.item = this.cartItems.length
        
        // this.sendInfo.orderId = this.orders.receiptID
        // alert(this.sendInfo.orderID)
        this.subscription = this.sendmailservice.sendEmail( this.sendInfo).
        subscribe(data => {
          let msg = data['message']
          //alert(msg);
           console.log(data, "success");
          if(data['success']){
            alert()
          this.cartItems.forEach( (myObject, index) => {
            this.removeProduct(index,myObject)
          }); 
          window.location.href="/order-success"
          //this.router.navigate(['/order-success'])
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

