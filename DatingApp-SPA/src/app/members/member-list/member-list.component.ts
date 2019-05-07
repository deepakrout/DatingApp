import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResults } from '../../_models/pagination';
import { cleanSession } from 'selenium-webdriver/safari';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;

  constructor( private userService: UserService,
               private alertify: AlertifyService,
               private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();

    this.route.data.subscribe(data => {
      // console.log(`member-list.component`, data,  data['users'].result);
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    console.log(`this.pagination.currentPage`, this.pagination.currentPage);
  }

  loadUsers() {
      this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res: PaginatedResults<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }

}
