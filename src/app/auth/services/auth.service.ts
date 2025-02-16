import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../environments/enviroments';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthStatus, CheckTokenResponse, LoginResponse, User} from '../interfaces';
import {catchError, map, Observable, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private readonly basePath = environment.basePath;
  private http = inject(HttpClient)
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.CHECKING);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  login(email: string, password: string): Observable<boolean> {
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.basePath}/auth/login`, body).pipe(
      map(({user, token}) => this.setAuthParams(AuthStatus.AUTHENTICATED, user, token)),
      catchError( err => throwError( () => err.error.message ))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(`${this.basePath}/auth/check-token`, { headers }).pipe(
      map(({user, token}) => this.setAuthParams(AuthStatus.AUTHENTICATED, user, token)),
      catchError((err) => {
        this._authStatus.set(AuthStatus.NOT_AUTHENTICATED);
        return of(false);
      })
    );
  }

  private setAuthParams(authStatus: AuthStatus, user: User, token: string): boolean {
    this._authStatus.set(authStatus);
    this._currentUser.set(user);
    localStorage.setItem('token', token);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.NOT_AUTHENTICATED);
    localStorage.removeItem('token');
  }
}
