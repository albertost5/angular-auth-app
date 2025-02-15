import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../environments/enviroments';
import {HttpClient} from '@angular/common/http';
import {AuthStatus, LoginResponse, User} from '../interfaces';
import {catchError, map, Observable, of, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly basePath = environment.basePath;
  private http = inject(HttpClient)
  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.CHECKING);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  login(email: string, password: string): Observable<boolean> {
    const body = { email, password };

    return this.http.post<LoginResponse>(`${this.basePath}/auth/login`, body).pipe(
      tap( res => {
        this._currentUser.set(res.user);
        this._authStatus.set(AuthStatus.AUTHENTICATED)
      }),
      map( res => {
        localStorage.setItem('token', res.token);
        return true
      }),
      catchError( err => throwError( () => err.error.message ))
    );
  }
}
