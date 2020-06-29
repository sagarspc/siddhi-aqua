import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from './_services/auth.service';
import { TokenStorageService } from './_services/token-storage.service';
import { RestApiService } from './rest-api.service';
import { UserService } from './_services/user.service';
import { DataService } from './data.service';
import { ToastrService } from 'ngx-toastr';
import { Router,NavigationEnd  } from '@angular/router';
import * as $ from 'jquery';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import { ProductsComponent } from './products/products.component';
//import { url } from 'inspector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  page = 1;
  pageSize =3;

  regusername = '';
  email = '';
  regpassword = '';
  password1 = '';
  isSeller = false;
  btnDisbled = false;

  form: any = {};
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  isLoginFailed = false;
  errorMessage = '';
  currentLocation:any
  products;amy;
  obj:any
  obj1:any
  constructor(private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private data: DataService,
    private toastr: ToastrService,
    private rest: RestApiService,
    private userService:UserService,
    private router: Router,
    public location: Location,
    config: NgbPaginationConfig,
    ) {
     if(window.location.href == 'http://192.168.1.207:4200/home'){
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
       // alert()$
       $('.homeClass').each(function(){
         $(this).addClass('active')
       })
          }
          window.scrollTo(0, 0)
      });
     }
     else{
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
       // alert()$
       $('.homeClass').each(function(){
         $(this).removeClass('active')
       })
          }
      });
     }
     }

  ngOnInit() {
  
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      console.log(user)
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      console.log(this.username)
    }
    // this.currentLocation = this.location.path();
    // sessionStorage.setItem("class", "active");
    // sessionStorage.setItem("path", this.currentLocation);
 
    // var active = sessionStorage.getItem('class')
    // var currentLocation = sessionStorage.getItem('path')
    //  $(document).ready(function(){
    //   var target = $('ul.navbar-nav li.homeClass');
    //   if(currentLocation == '/home')
    //   target.addClass(active)
    //   else
    //   target.removeClass(active)
    // });
    if(!this.showAdminBoard){
    $(document).ready(function(){

    
    window.onscroll = function() {myFunction()};

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
})

}

$(document).ready(function(){
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

});

    this.getProduct()
  }

 async getProduct(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/products'
      );
      data['success']
        ? (this.products = data['products'])
        : this.data.error('Could not fetch products.');
        this.obj = this.products
        this.obj1 = this.products
    } catch(error) {
      this.data.error(error['message']);
      
    }
  }

  validate() {
    if (this.regusername) {
      if (this.email) {
        if (this.regpassword) {
          if (this.password1) {
            if (this.regpassword === this.password1) {
              return true;
            }
            else {
              this.data.error('Passwords do not match');
            }
          }
          else {
            this.data.error('Confirmation password is not entered');
          }
        }
        else {
          this.data.error('Password is not entered');
        }
      }
      else {
        this.data.error('E-mail not entered');
      }
    }
    else {
      this.data.error('Name is not entered');
    }
  }

  async register() {
    this.btnDisbled = true;

    try {
      if (this.validate()) {
        $(document).ready(function(){
          $('#registerModal').hide()
          $('.modal-backdrop').remove();
          $('.modal-open').css('overflow','auto');
         })
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/auth/signup',
          {
            username: this.regusername,
            email: this.email,
            password: this.regpassword,
            isSeller: this.isSeller
          }
        );
        
        if (data['success']) {
          
         // sessionStorage.setItem('token', data['token']);
         localStorage.setItem('token', data['accessToken'] );
         await this.data.getProfile();
        
          this.router.navigate(['profile/address'])
            .then(() => {
              this.data.success(
                'Registration Successful! Please enter your shipping address below.'
              )
            }).catch(error => this.data.error(error));
        }
        else {
          this.data.error(data['message']);
        }
      }
    }
    catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisbled = false;
  }

  get User(){
    return this.tokenStorageService.getUser()
  }
  // reloadPage() {
  //   window.location.reload();
  // }
  get cartItems() {
   
    return this.data.getCart();
  }


  public onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        //console.log(data)
       $(document).ready(function(){
        $('#exampleModal').hide()
       // $('.modal').remove();
        $('.modal-backdrop').remove();
        //$('body').removeClass( "modal-open" );
       })
        
        this.tokenStorageService.saveToken(data.accessToken);
        this.tokenStorageService.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorageService.getUser().roles;
        if(this.roles[0] == 'ROLE_ADMIN'){
          this.reloadAdminPage();
        }
        //this.router.navigate(['/home']);
        else
        this.reloadPage();
       
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
 

  logout() {
    this.tokenStorageService.signOut();
    window.location.href="/"
    this.toastr.success('Logout Successfully');
  }

  reloadPage() {
    window.location.href="/home"
  }
  reloadAdminPage() {
    window.location.href="/profile/myproducts"
  }
}
