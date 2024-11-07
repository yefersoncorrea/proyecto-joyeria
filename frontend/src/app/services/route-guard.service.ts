import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from 'jwt-decode';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth:AuthService,
    public router:Router,
    private snackbarService:SnackbarService) { }

    canActivate(route:ActivatedRouteSnapshot):boolean{
      const token:any = localStorage.getItem('token');
      var tokenPayload:any;
      try{
        tokenPayload = jwt_decode(token);
      }
      catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      if(['admin','user'].includes(tokenPayload.rol)){
        if(this.auth.isAuthenticated()){
          return true;
        }
        this.snackbarService.openSnackBar(GlobalConstants.unauthorized,GlobalConstants.error);
        this.router.navigate(['/joyeria/dashboard']);
        return false;
      }
      else{
        this.router.navigate(['/']);
        return false;
      }
      }
}
