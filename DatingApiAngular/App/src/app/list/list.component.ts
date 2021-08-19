import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AlrtifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { User } from '../_models/user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlrtifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'].results;
      this.pagination = data['users'].pagination;
    })
    this.likesParam = 'Likers';
  }
  loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe((res: PaginatedResult<User[]>) => {
        this.users = res.results;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.Error(error);
      });
    console.log(this.users)
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
