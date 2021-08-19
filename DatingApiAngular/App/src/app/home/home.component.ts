import { Component, OnInit } from '@angular/core';
import { AlrtifyService } from '../services/alertify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean;
  constructor(private alertify: AlrtifyService) { }

  ngOnInit(): void {
  }
  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  showReg(event: boolean) {
    if (!event) {
      this.registerMode = event;
    }

  }


}
