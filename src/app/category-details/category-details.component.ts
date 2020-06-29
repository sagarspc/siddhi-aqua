import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit {
  categories:any
  newCategory = '';
  btnDisabled = false;
  categoryId:any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res['id'];
      this.getCategoryById(this.categoryId)
    });
    
}

getCategoryById(categoryId){
  this.rest
  .get(`http://192.168.1.207:8080/api/categoriesbyID/${categoryId}`)
  .then(data => {
    data['success']
      ? (this.categories = data['category'])
      : this.router.navigate(['/']);
      this.newCategory = this.categories['name']
  })
  .catch(error => this.data.error(error['message']));

}


async updateCategory() {
  this.btnDisabled = true;
  try {
    const data = await this.rest.put(
      `http://192.168.1.207:8080/api/categories/${this.categoryId}`,
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
