import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './response-reset.component.html',

})
export class ResponseResetComponent implements OnInit {
  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private data: DataService, 
    private rest: RestApiService,
    private fb: FormBuilder ) {

    this.CurrentState = 'Wait';
    this.route.params.subscribe(params => {
      this.resetToken = params.token;
      console.log(this.resetToken);
      this.VerifyToken();
    });
  }


  ngOnInit() {

    this.Init();
  }

 async VerifyToken() {
    try {
      const data = await this.rest.post(
        'http://192.168.1.207:8080/api/auth/valid-password-token',
        { resettoken: this.resetToken }
      );
      if(data['success']){
        this.CurrentState = 'Verified';
      }
    } catch (error) {
      this.CurrentState = 'NotVerified';
    }
  }

  Init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(4)],]
      }
    );
  }

  Validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true
      };
    }

    return null;
  }


 async ResetPassword(form) {
    console.log(form.get('confirmPassword'));
    if (form.valid) {
      this.IsResetFormValid = true;
      try {
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/auth/new-password',
          this.ResponseResetForm.value
        );
        if(data['success']){
          this.ResponseResetForm.reset();
          this.successMessage = "Password Reset sucessfully.";
             setTimeout(() => {
              this.successMessage = null;
              this.router.navigate(['/login']);
            }, 3000);
        }
        
      } catch (error) {
        this.data.error(error)
      }
    }
     else { this.IsResetFormValid = false; }
  }
}