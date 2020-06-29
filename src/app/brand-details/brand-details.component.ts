import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brand-details',
  templateUrl: './brand-details.component.html',
  styleUrls: ['./brand-details.component.css']
})
export class BrandDetailsComponent implements OnInit {
  newBrand = '';
  btnDisabled = false;
  brandId:any;
  brand:any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.brandId = res['id'];
      this.getBrandsById(this.brandId)
    });
  }

  getBrandsById(brandId){
    this.rest
        .get(`http://192.168.1.207:8080/api/brands/${brandId}`)
        .then(data => {
          data['success']
            ? (this.brand = data['brand'])
            : this.router.navigate(['/']);
            this.newBrand = this.brand['name']
        })
        .catch(error => this.data.error(error['message']));
  }

  async updateBrand() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.put(
        `http://192.168.1.207:8080/api/brands/${this.brandId}`,
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
