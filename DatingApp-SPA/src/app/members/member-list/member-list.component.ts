import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResults } from '../../_models/pagination';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};

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
    this.userParams.gender = this.user.gender === 'female' ? 'male' : this.user.gender;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : this.user.gender;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    console.log(`this.pagination.currentPage`, this.pagination.currentPage);
  }

  loadUsers() {
      // console.log(`userParams`, this.userParams);
      this.userService.getUsers(this.pagination.currentPage,
                                this.pagination.itemsPerPage,
                                this.userParams)
      .subscribe((res: PaginatedResults<User[]>) => {
        this.users = res.result;
        console.log(`user list`, this.users);
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      }
    );
  }

}
