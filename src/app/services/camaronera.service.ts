import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class CamaroneraService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    obtenerPropietarios(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'usuario/4', { headers: headers });

    }

    registrarCamaronera(camaronera): Observable<any> {

        let json = JSON.stringify(camaronera);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'camaronera', params, { headers: headers });

    }

    obtenerCamaroneras(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'camaronera', { headers: headers });

    }

    habilitarDeshabilitarCamaronera(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + 'camaronera/'+id, { headers: headers });

    }


}
