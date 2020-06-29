import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  page = 1;
  pageSize =5;
  roles:any
  roleID:any
  constructor(
    private data: DataService,
    private rest: RestApiService,
    config: NgbPaginationConfig
  ) { 
    config.size = 'sm';
    config.boundaryLinks = true;
  }

  ngOnInit() {
    this.getAllrole();
  }

  getRoleByID(roleID){
    this.roleID = roleID
  }

  async deleteRole(){
    try {
      const data = await this.rest.delete(
        `http://192.168.1.207:8080/api/role/${this.roleID}`
      );
      if(data['success'])
      window.location.reload();
    } catch(error) {
      this.data.error(error['message']);
    }
  }

  async getAllrole(){
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/role'
      );
      data['success']
        ? (this.roles = data['roles'])
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }


}
