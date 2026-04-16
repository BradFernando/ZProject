import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Login, Logout, SetToken } from './auth.actions';
import { tap } from 'rxjs';

export interface AuthStateModel {
  token: string | null;
  user: string | null;
  role: string | null;
  clientId: number | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    token: null,
    user: null,
    role: null,
    clientId: null
  }
})
@Injectable()
export class AuthState {
  constructor(private readonly authService: AuthService) {}

  @Selector()
  static token(state: AuthStateModel) { return state.token; }

  @Selector()
  static user(state: AuthStateModel) { return state.user; }

  @Selector()
  static role(state: AuthStateModel) { return state.role; }

  @Selector()
  static clientId(state: AuthStateModel): number | null { return state.clientId; }

  @Selector()
  static isAuthenticated(state: AuthStateModel) { return !!state.token; }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap({
        next: (res) => {
          this.authService.setToken(res.token);

          // Usar el método centralizado del servicio para obtener el rol normalizado
          const role = this.authService.getRole();
          const decoded: any = this.authService.getDecodedToken();

          ctx.patchState({
            token: res.token,
            user: decoded?.sub || null,
            role: role,
            clientId: decoded?.clientId || null
          });
        },
        error: (err) => {
          console.error('[AuthState] Error en login:', err);
          // Opcional: limpiar estado en error
        }
      })
    );
  }

  @Action(SetToken)
  setToken(ctx: StateContext<AuthStateModel>, { token }: SetToken) {
    this.authService.setToken(token);

    const role = this.authService.getRole();
    const decoded: any = this.authService.getDecodedToken();

    ctx.patchState({
      token: token,
      user: decoded?.sub || null,
      role: role,
      clientId: decoded?.clientId || null
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    this.authService.logout();
    ctx.setState({
      token: null,
      user: null,
      role: null,
      clientId: null
    });
  }

  /**
   * NgxsOnInit se ejecuta automáticamente cuando el estado se inicializa.
   * Re-hidratamos el estado desde el token si existe y el estado actual está vacío.
   */
  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const state = ctx.getState();
    const token = state.token || this.authService.getToken();

    if (token && (!state.role || !state.user)) {
      const decoded: any = this.authService.getDecodedToken();
      const role = this.authService.getRole();

      ctx.patchState({
        token: token,
        user: decoded?.sub || null,
        role: role,
        clientId: decoded?.clientId || null
      });
    }
  }
}
