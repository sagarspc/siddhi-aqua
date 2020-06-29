import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  newRole= {
    name:''
  }
  constructor(private userService: UserService, private router:Router) { }

  ngOnInit() {
  }

  addRole() {
    console.log(this.newRole);
    this.userService.addRole(this.newRole)
        .subscribe(data => {
          if(data){
            this.router.navigate(['/roles'])
          }
        });
    
  }
}
