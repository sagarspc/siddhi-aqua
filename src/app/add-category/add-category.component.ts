import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  newCategory = '';
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) { }

  ngOnInit() {
    
}

async addCategory() {
  this.btnDisabled = true;
  try {
    const data = await this.rest.post(
      'http://192.168.1.207:8080/api/categories',
      { name: this.newCategory }
    );
    data['success']
    ? this.router.navigate(['/categories'])
      .then(() => this.data.success(data['message']))
      .catch(error => this.data.error(error))
    : this.data.error(data['message']);

  } catch(error) {
    this.data.error(error['message']);
  }
  this.btnDisabled = false;
}


}
