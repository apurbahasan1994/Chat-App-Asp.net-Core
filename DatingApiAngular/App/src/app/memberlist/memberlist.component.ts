import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AlrtifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { User } from '../_models/user';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: "male", display: "males" }, { value: "female", display: "females" }];
  userParams: any = {};
  pagination: Pagination;


  constructor(private userService: UserService, private alertify: AlrtifyService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.users = data['users'].results;
      this.pagination = data['users'].pagination;
    })
    this.userParams.gender = this.user.gender === "Male" ? "female" : "male";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 98;
    this.userParams.orderBy = "lastActive";
  }
  resetFilters() {
    this.userParams.gender = this.user.gender === "Male" ? "female" : "male";
    this.userParams.minAge = 18;
    this.userParams.maxAge = 98;
    this.loadUsers();
  }
  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe((data: PaginatedResult<User[]>) => {
      this.users = data.results;
      this.pagination = data.pagination;
    },
      err => {
        this.alertify.Error(err.message);
      }
    )
  }

}
