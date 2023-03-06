import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  authForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  letsdoit() {

    const { email, password } = this.authForm.value;

    this.authService.login(email, password)
      .subscribe(resp => {
        if (resp === 200) this.router.navigateByUrl('/app');
        else Swal.fire('Credentials', 'error');
      });
  }
}
