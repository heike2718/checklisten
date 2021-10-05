import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'chl-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(public authService: AuthService
    , private router: Router) { }

  ngOnInit(): void {
  }

  logIn(): void {
    this.authService.logIn();
  }

  gotoChecklisten(): void {
    this.router.navigateByUrl('/listen');
  }

  gotoVorlagen(): void {
    this.router.navigateByUrl('/vorlagen');
  }

}
