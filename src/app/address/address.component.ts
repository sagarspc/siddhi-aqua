import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  btnDisabled = false;

  currentAddress: any;

  constructor(private data: DataService, private rest: RestApiService,private userService: UserService) { }

  async ngOnInit() {
    try {
      const data = await this.rest.get(
        'http://192.168.1.207:8080/api/test/address'
      );

      if (
        JSON.stringify(data['address']) === '{}' &&
        this.data.message === ''
      ) {
        this.data.warning(
          'You have not entered your shipping address. Please enter your shipping address.'
        );
      }
      this.currentAddress = data['address'];
    } catch (error) {
      this.data.error(error['message']);
    }
    //this.getAddress()
  }

  // getAddress(){
  //   return this.userService.getAddress()
  //   .subscribe(
  //     data => {
  //      console.log(data);
  //         if (
  //       JSON.stringify(data['address']) === '{}' &&
  //       this.data.message === ''
  //     ) {
  //       this.data.warning(
  //         'You have not entered your shipping address. Please enter your shipping address.'
  //       );
  //     }
  //     this.currentAddress = data.address
  //     }
  //    );
  // }

  async updateAddress() {
    this.btnDisabled = true;
    try {
      const res = await this.rest.post(
        'http://192.168.1.207:8080/api/test/address',
        this.currentAddress
      );

      res['success']
        ? (this.data.success(res['message']), await this.data.getProfile())
        : this.data.error(res['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
