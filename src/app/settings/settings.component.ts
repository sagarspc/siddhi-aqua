import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings = {
    username:'',
    email:'',
    newPwd:'',
    confirmPwd:'',
    isSeller: null
  }
  user:any;
  constructor(private data: DataService, private rest: RestApiService, private tokenStrg: TokenStorageService) { }

  async ngOnInit() { 
    this.user = this.tokenStrg.getUser();
    try {
      if (!this.data.user) {
        
        await this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPwd: '',
        pwdConfirm: ''
      }, this.data.user);
    } catch(error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if (settings['username']) {
      if (settings['email']) {  
        if (settings['newPwd']) {
          if (settings['confirmPwd']) {
            if (settings['newPwd'] === settings['confirmPwd']) {
              return true;
            } else {
              this.data.error("Passwords do not match")
            }
          } else {
            this.data.error("Please enter confirmation password");
          }
        } else {
          if (!settings['pwdConfirm']) {
            return true;
          } else {
            this.data.error("Please enter new password");
          }
        }
      } else {
        this.data.error("Please enter your email");
      }
    } else {
      this.data.error("Please enter your name");
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.rest.post(
          'http://192.168.1.207:8080/api/test/profile',
          {
            username: this.currentSettings.username,
            email: this.currentSettings.email,
            password: this.currentSettings.newPwd,
            isSeller: this.currentSettings.isSeller
          }
        );

        data['success']
          ? (this.data.getProfile(), this.data.success(data['message']))
          : this.data.error(data['message'])
      }
    } catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
