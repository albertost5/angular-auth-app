import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

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

  public myForm = this.fb.group({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  login(): void {
    const { email, password } = this.myForm.value
    this.authService.login(email!, password!).subscribe(res => {
      console.log('login => ', res)
    })
  }
}
