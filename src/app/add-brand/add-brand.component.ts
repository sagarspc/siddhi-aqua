import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  newBrand = '';
  btnDisabled = false;
  
  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rest: RestApiService
  ) { }

  ngOnInit() {
  }

  async addBrand() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(
        'http://192.168.1.207:8080/api/brands',
        { name: this.newBrand }
      );
      data['success']
      ? this.router.navigate(['/brands'])
        .then(() => this.data.success(data['message']))
        .catch(error => this.data.error(error))
      : this.data.error(data['message']);
    } catch(error) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

  


}
