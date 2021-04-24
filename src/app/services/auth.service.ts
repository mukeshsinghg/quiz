import { HttpClient } from '@angular/common/http';
import { Injectable, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, catchError, share } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/iquiz';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn(username: string): boolean {
   // console.log("islogin", localStorage.getItem(username) ? true : false);
    return localStorage.getItem(username) ? true : false
  }

  private _baseurl = environment.basepath;
  constructor(private http: HttpClient) { }

  Login(userform: any): Observable<IUser> {
    return this.http.post<IUser>(this._baseurl+"/login",userform);
  }

}
