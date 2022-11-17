import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class UsuarioService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    registrarUsuario(usuario): Observable<any> {

        let json = JSON.stringify(usuario);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'usuario', params, { headers: headers });

    }

    
    obtenerUsuarioPorId(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'usuario/id/'+id, { headers: headers });

    }

    obtenerUsuarios(tipo): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'usuario/'+tipo, { headers: headers });

    }

    totalUsuarios(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'cantidad-usuario', { headers: headers });

    }

    habilitarDeshabilitarUsuario(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + 'usuario/'+id, { headers: headers });

    }

    editarUsuario(usuario, id): Observable<any> {

        let json = JSON.stringify(usuario);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'usuario/'+id, params, { headers: headers });

    }

    obtenerProveedores(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'proveedores', { headers: headers });

    }





}
