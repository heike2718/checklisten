import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'chl-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.css']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private router: Router
    , private authService: AuthService) { }

  ngOnInit(): void {
  }

  goHome(): void {
    this.router.navigateByUrl('/landing');
  }

  logIn(): void {
    this.authService.logIn();
  }

}
