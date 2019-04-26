import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor( public auth: AuthService,
               private alertiFy: AlertifyService,
               private router: Router ) { }

  ngOnInit() {
  }

  login() {
   // console.log(`Sending to server`, this.model);

    this.auth.login(this.model).subscribe(next => {
      console.log(`Logged in Successfull!`);
      this.alertiFy.success(`Logged in Successfull!`);
    },
    error => {
      // console.log(`Failed to login!`, error);
      this.alertiFy.error(`Failed to login! ${error}`);
    }, () => {
        this.router.navigate(['/members']);
    });

  }

  loggedIn() {
   return this.auth.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.auth.decodedToken = null;
    this.auth.currentUser = null;
    console.log(`Logged out`);
    this.alertiFy.message(`Logged out`);
    this.router.navigate(['/home']);
  }

}
