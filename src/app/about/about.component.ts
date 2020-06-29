import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(  private router: Router,) { 
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
     // alert()$
     $('.homeClass').each(function(){
       $(this).removeClass('active')
     })
        }
    });
  }

  ngOnInit() {
  }

}
