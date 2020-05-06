import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { GlobalService } from '../global/global.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, public global: GlobalService) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log(route);

    let authInfo = {
      authenticated: false
    };

    if (!this.global.gWalletList.length || this.global.currentWalletIndex < 0) {
      // this.router.navigate(['signin']);
      return false;
    }

    return true;

  }

}