import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  //summary:any
  page = 1;
  pageSize =5;

  content = '';
  users: any;
  userID:any;
  errorMessage: string;
  constructor(private userService: UserService, private rest: RestApiService,
    private data: DataService,config: NgbPaginationConfig) { 
      config.size = 'sm';
      config.boundaryLinks = true;
    }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/test/all'
      );
      if(data['success']){
        this.users = data['users']
        console.log(this.users)
      }
    } catch (error) {
      this.data.error(error['message']);
    }

    //this.getAllData()
  }

  getUserID(UserID){
    this.userID = UserID
  }
  
  async deleteUser(){
    try {
      const data = await this.rest.delete(
        `http://192.168.1.207:8080/api/test/user/${this.userID}`
      );
      if(data['success'])
    //  this.getBrands();
      window.location.reload();
    } catch(error) {
      this.data.error(error['message']);
    }
  }
  
}
