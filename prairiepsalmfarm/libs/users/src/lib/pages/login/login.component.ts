import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'prairiepsalmfarm-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  isSubmitted: boolean = false;
  authError: boolean = false;
  authMessage: string = 'Email or password is invalid';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private localStorageService: LocalstorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;

    if(this.loginFormGroup.invalid) return;

    this.authService.login(this.loginForm['email'].value, this.loginForm['password'].value).subscribe(user => {
      this.authError = false;
      this.localStorageService.setToken(user.token);
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      this.authError = true;
      if(error.status !== 400) {
        this.authMessage = 'Server error';
      }
    });
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }

}
