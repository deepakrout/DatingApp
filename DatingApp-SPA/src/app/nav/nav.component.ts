import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private auth: AuthService ) { }

  ngOnInit() {
  }

  login() {
   // console.log(`Sending to server`, this.model);

    this.auth.login(this.model).subscribe(next => {
      console.log(`Logged in Successfull!`);
    },
    error => {
      console.log(`Failed to login!`);
    });

  }

  loggedIn() {
    const token = localStorage.getItem('token');
   // console.log(`token ${token}`);
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    console.log(`Logged out`);
  }

}
