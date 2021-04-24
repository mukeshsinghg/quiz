import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IUser } from '../interfaces/iquiz';
import { AuthService } from '../services/auth.service';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { user } from '../catalog/catalog.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  SignedinUser: IUser = new user();
  Hide: boolean;
  @Output() UserSignedIn: EventEmitter<IUser> = new EventEmitter<IUser>();
  constructor(private userservice: AuthService, private formBulder: FormBuilder) { }
  loginform = this.formBulder.group({
    username: '',
    password: ''
  });

  onSubmit(): void {
    //console.log("login submit working");
    this.userservice.Login(this.loginform.value).subscribe(
      res => {
        console.log("response froms subscribe", res);
        this.SignedinUser.userid = res.userid;
        this.SignedinUser.username = res.username;
        if (this.SignedinUser) {
          console.log("login subscribed", this.SignedinUser);
          localStorage.setItem(this.SignedinUser.username, this.SignedinUser.username);
          this.UserSignedIn.emit(this.SignedinUser);

        }
        else {
          console.log("failed", this.SignedinUser)
          localStorage.removeItem(this.SignedinUser.username);
        }
        //Message for login failed

      }
    );

  }


  ngOnInit(): void {
    var loginmodal = document.getElementById('loginmodal')
    loginmodal.addEventListener('show.bs.modal', function (event) {
      console.log("login model opening...");
    });
    loginmodal.addEventListener('hide.bs.modal', function (event) {
      console.log("login model closing...");
    });
  }

}
