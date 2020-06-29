import { Component, OnInit } from '@angular/core';

//import { DataService } from '../data.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
user:any
username:string
  constructor(private data: TokenStorageService) { 
    
  }

  ngOnInit() {
    this.user = this.data.getUser();
    this.username = this.user.username;
  }

  
}
