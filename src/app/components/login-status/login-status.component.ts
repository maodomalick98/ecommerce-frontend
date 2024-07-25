import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userName: string = '';

  storage : Storage = sessionStorage;

  constructor(private oktaAuthStateService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAtuh: OktaAuth) {
  }

  ngOnInit(): void {
    this.oktaAuthStateService.authState$.subscribe(
      response => {
        this.isAuthenticated = response.isAuthenticated!;
        this.getUsersDetails();
      });

  }

 getUsersDetails() {
    if(this.isAuthenticated) {
      this.oktaAtuh.getUser().then(res => {
        this.userName = res.name!
        const email = res.email!;
        this.storage.setItem('userEmail', JSON.stringify(email));
      })
    }
  }

  logout() {
    this.oktaAtuh.signOut();
  }
}
