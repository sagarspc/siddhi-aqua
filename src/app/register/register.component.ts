import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';

import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;
  btnDisbled = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService,
    private userService:UserService,private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
  }

  validate() {
    if (this.username) {
      if (this.email) {
        if (this.password) {
          if (this.password1) {
            if (this.password === this.password1) {
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
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/auth/signup',
          {
            username: this.username,
            email: this.email,
            password: this.password,
            isSeller: this.isSeller
          }
        );
        if (data['success']) {
         // sessionStorage.setItem('token', data['token']);
         localStorage.setItem('token', data['accessToken'] );
         alert(localStorage.setItem('token', data['accessToken'] ))
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

}