import {Component, computed, inject} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {JsonPipe} from '@angular/common';

@Component({
  imports: [
    JsonPipe
  ],
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
    private authService = inject(AuthService);

    public user = computed(() => this.authService.currentUser());

    onLogout(): void {
      this.authService.logout();
    }
}
