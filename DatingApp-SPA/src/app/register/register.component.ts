import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private auth: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {}

  register(): void {
    console.log(this.model);
    this.auth.register(this.model).subscribe(() => {
      console.log(`Registration Success`);
      this.alertify.success(`Registration Success`);
    },
    (error) => {
      console.log(`Error in registering User`, error);
      this.alertify.error(`Error in registering User: ${error}`);
    });
  }

  cancel(): void {
    console.log(`Cancel`);
    this.cancelRegister.emit(false);
  }
}
