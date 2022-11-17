import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent {
  title = 'frontend-camaronera';
  public token;
  public identity;
  public fecha;
  constructor(
    private _authService: AuthService,
    private _router: Router,

  ) {

    this.token = this._authService.getToken();
    this.identity = this._authService.getIdentity();
    this.fecha = moment().format('YYYY-MM-DD');

    if (this.token == null && this.identity == null) {
      this._router.navigate(['login']);
    } else {

      if (this.identity.expirado > this.fecha) {
        //   console.log('token activo');

        if (this.identity.role == 'Administrador') {
          this._router.navigate(['inicio']);
        } else {
          this._router.navigate(['producciones']);
        }
      } else {
        //   console.log('token caducado');
        this._router.navigate(['login']);
        localStorage.clear();

      }

    }

  }
}
