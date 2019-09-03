import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialUser, AuthService } from "angularx-social-login";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  user: SocialUser;
  loggedIn: boolean;
  loginState: Subject<any> = new Subject();

  constructor(private authService: AuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);      
      this.loginState.next(this.loggedIn);
    });
  }

  signIn() {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut() {
    return this.authService.signOut();
  }

  getAuthToken() {
    return this.user.authToken;
  }

  getUserPhoto() {
    return this.user.photoUrl;
  }
}
