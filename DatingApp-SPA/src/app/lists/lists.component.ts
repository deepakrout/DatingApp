import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResults } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private route: ActivatedRoute,
              private alertify: AlertifyService
  ) { }

  /** ngOnInit event */
  ngOnInit() {
    // Subscribe to route data
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  /** Method to load user based on params */
  loadUsers() {
   // console.log(`userParams`, this.likesParam);
    this.userService.getUsers(this.pagination.currentPage,
      this.pagination.itemsPerPage,
      null, this.likesParam)
      .subscribe((res: PaginatedResults<User[]>) => {
        this.users = res.result;
        console.log(`user list`, this.users);
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      }
      );
  }

  /** Method called in page change event */
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
    // console.log(`this.pagination.currentPage`, this.pagination.currentPage);
  }

}
