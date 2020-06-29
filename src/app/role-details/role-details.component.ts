import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {
  newRole= {
    name:''
  }
  btnDisabled = false;
  roleID:any;
  roles:any;
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rest: RestApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.roleID = res['id'];
      this.getRoleById(this.roleID)
    });
  }
  
  getRoleById(roleID){
    this.rest
        .get(`http://192.168.1.207:8080/api/role/${roleID}`)
        .then(data => {
          data['success']
            ? (this.roles = data['role'])
            : this.router.navigate(['/']);
            this.newRole.name = this.roles['name']
        })
        .catch(error => this.data.error(error['message']));
  }

  async updateRole() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.put(
        `http://192.168.1.207:8080/api/role/${this.roleID}`,
        this.newRole
      );
      data['success']
      ? this.router.navigate(['/roles'])
        .then(() => this.data.success(data['message']))
        .catch(error => this.data.error(error))
      : this.data.error(data['message']);
    } catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }
}
