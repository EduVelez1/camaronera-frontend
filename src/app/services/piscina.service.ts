import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class PiscinaService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    
    obtenerPiscinaPorId(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'piscina/'+id, { headers: headers });

    }
    obtenerPiscinas(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'piscina', { headers: headers });

    }

    obtenerPiscinasActivas(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'piscina-activas', { headers: headers });

    }

    registrarPiscina(piscina): Observable<any> {

        let json = JSON.stringify(piscina);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'piscina', params, { headers: headers });

    }

    obtenerCamaroneras(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'camaronera', { headers: headers });

    }

    habilitarDeshabilitarPiscina(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + 'piscina/'+id, { headers: headers });

    }


    editarPiscina(piscina, id): Observable<any> {

        let json = JSON.stringify(piscina);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'piscina/'+id, params, { headers: headers });

    }

}
