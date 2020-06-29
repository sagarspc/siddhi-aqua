import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  //user = new User();
  username = '';
  email = '';
  password = '';
  password1 = '';
  btnDisbled = false;

  roles:any
  roleID:''
  newRoles = []
  constructor(private userService: UserService, private router: Router,
    private data: DataService, private rest: RestApiService
    ) { }

  ngOnInit() {
    this.getAllrole();
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


  getAllrole(){
    return this.userService.getAllrole()
    .subscribe(
      data => {
       console.log(data);
       this.roles = data.roles
      }
     );
  }


 async addUser(){
    
    //this.newRoles.push(this.roleID)
    //this.user.roles = [this.roleID]
    // console.log(this.user)
    // this.userService.addUser(this.user)
    //     .subscribe();
    this.btnDisbled = true;
    try {
      if (this.validate()) {
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/test/user',
          {
            username: this.username,
            email: this.email,
            password: this.password,
            roleID:[this.roleID]
          }
          
        );

        data['success']
        ? this.router.navigate(['/user'])
          .then(() => this.data.success(data['message']))
          .catch(error => this.data.error(error))
        : this.data.error(data['message']);
      }
    }
    catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisbled = false;
  }

}
