import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './_services/auth.service';
import { TokenStorageService } from './_services/token-storage.service';





@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,private authService: AuthService, private tokenStorage: TokenStorageService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    // If the previous URL was blank, then the user is directly accessing this page

    //const currentUser = this.authService.currentUserValue;
    const user = this.tokenStorage.getUser();
    if (user) {
      // check if route is restricted by role
      if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
          // role not authorised so redirect to home page
          this.router.navigate(['/home']);
          return false;
      }

      // authorised so return true
      return true;
  }
  // not logged in so redirect to login page with the return url
  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
  return false;
  }
}
