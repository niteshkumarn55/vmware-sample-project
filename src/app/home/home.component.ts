import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userInfo: any;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(
      user => {
        this.userInfo = user;
      }
    )
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }

}
