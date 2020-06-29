import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
})
export class RequestResetComponent implements OnInit {
  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private data: DataService, 
    private rest: RestApiService
   ) {

  }


  ngOnInit() {

    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


 async RequestResetUser(form) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
        try {
          const data = await this.rest.post(
            'http://192.168.1.207:8080/api/auth/req-reset-password',
            this.RequestResetForm.value
          );
          if(data['success']){
            this.RequestResetForm.reset();
            this.successMessage = "Reset password link send to email sucessfully.";
               setTimeout(() => {
                this.successMessage = null;
                this.router.navigate(['/login']);
              }, 3000);
          }
          
        } catch (error) {
          this.data.error(error)
        }
    } 
    else {
      this.IsvalidForm = false;
    }
  }
}