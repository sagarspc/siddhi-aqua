import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(private router: Router) { 
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
