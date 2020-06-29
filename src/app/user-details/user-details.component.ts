import { Component, OnInit } from '@angular/core';
//import { User } from '../user';
//import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
user :any
  //user = new User();
  username = '';
  email = '';
  password = '';
  password1 = '';
  btnDisbled = false;
  roles:any
  roleID:''
  newRoles = []
  userId:any
  constructor(private userService: UserService,private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.userId = res['id'];
      this.getUserById(this.userId)
      this.getAllrole();
    });
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

getUserById(userID){
  this.rest
        .get(`http://192.168.1.207:8080/api/test/user/${userID}`)
        .then(data => {
          data['success']
            ? (this.user = data['user'])
            : this.router.navigate(['/user']);
            //this.user.password = null
            this.username = this.user['username']
            this.email = this.user['email']
           // this.password = this.user['password']
            this.roleID = this.user.roles[0]['_id'] 
        })
        .catch(error => this.data.error(error['message']));
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

  async updateUser(){
  //this.user.roles = [this.roleID]
  try {
    if (this.validate()) {
      const data = await this.rest.put(
        `http://192.168.1.207:8080/api/test/user/${this.userId}`,
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
  } catch (error) {
    this.data.error(error['message']);
  }
}
}
