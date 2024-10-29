import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.signupForm = this.formBuilder.group({
      nombre: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nombreRegex)],
      ],
      numeroContacto: [
        null,
        [
          Validators.required,
          Validators.pattern(GlobalConstants.numeroContactoRegex),
        ],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contrasena: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    this.ngxService.start();
    this.userService.signup(this.signupForm.value).subscribe(
      (response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, '');
        this.router.navigate(['/']);
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.error,
        );
      },
    );
  }
}
