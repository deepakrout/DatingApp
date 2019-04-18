import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: any;

  constructor(private routes: ActivatedRoute) { }

  ngOnInit() {
    this.routes.data.subscribe(data => {
      this.user = data['user'];
    });
  }

}
