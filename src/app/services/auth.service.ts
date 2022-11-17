import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class AuthService {

    public url: string;
    public identidad;
    public token;

    constructor(
        private _http: HttpClient) {
        this.url = global.url;



    }


    login(usuario, gettoken = null): Observable<any> {
        // comprobar si llega el gettoken
        if (gettoken != null) {
            usuario.gettoken = 'true';
        }

        let json = JSON.stringify(usuario);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.url + 'login', params, { headers: headers });

    }



       recuperarContrasena(correo): Observable<any> {

        let json = JSON.stringify(correo);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'recuperar-contrasena', params, { headers: headers });


    }

    InsertarCodigo(datos): Observable<any> {

        let json = JSON.stringify(datos);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'insertar-codigo', params, { headers: headers });


    }
    CambiarPass(datos): Observable<any> {

        let json = JSON.stringify(datos);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', this.getToken());
        return this._http.post(this.url + 'cambiar-contrasena', params, { headers: headers });


    }


    getIdentity() {
        let identidad = JSON.parse(localStorage.getItem('identity'));

        if (identidad && identidad != null && identidad != undefined && identidad != "undefined") {
            this.identidad = identidad;
        } else {
            this.identidad = null;
        }
        return this.identidad;

    }
    getToken() {
        let token = localStorage.getItem('token');

        if (token && token != null && token != undefined && token != "undefined") {
            this.token = token;

        } else {
            this.token = null;
        }
        return this.token;


    }


    }
