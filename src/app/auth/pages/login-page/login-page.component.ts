import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private fb:FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService)
  private router = inject(Router)

  public myForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  login(): void {
    const { email, password } = this.myForm.value
    this.authService.login(email!, password!).subscribe({
      next: (res) => this.router.navigateByUrl('/dashboard'),
      error: (message) => {
        Swal.fire({
          title: 'Error:',
          text: message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
  }
}
