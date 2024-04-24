import {Component, Inject, OnInit} from '@angular/core';
import oktaConfig from "../../config/okta-config";
import OktaSignIn from "@okta/okta-signin-widget"
import {OKTA_AUTH, OktaAuthModule} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaLogin: any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaLogin = new OktaSignIn({
      logo: '',
      baseUrl: oktaConfig.openId.issuer.split("/oauth2")[0],
      clientId: oktaConfig.openId.clientId,
      redirectUri: "http://localhost:4200/login/callback",
      authParams: {
        pkce: true,
        issuer: oktaConfig.openId.issuer,
        scopes: oktaConfig.openId.scopes
      }
    });
  }

  ngOnInit(): void {
    this.oktaLogin.remove();
    this.oktaLogin.renderEl({
        'el': '#okta-sign-in-widget',
      },
      (response: { status: string; }) => {
        if (response.status  === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      });
  }
}
