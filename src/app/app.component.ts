import {Component, computed, effect, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './auth/services/auth.service';
import {AuthStatus} from './auth/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public isAuthenticated = computed<boolean>(() => {
    return this.authService.authStatus() !== AuthStatus.CHECKING;
  });

  public authStatusChangedEffect = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.CHECKING:
        return;
      case AuthStatus.AUTHENTICATED:
        this.router.navigateByUrl('/dashboard');
        return;
      case AuthStatus.NOT_AUTHENTICATED:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
