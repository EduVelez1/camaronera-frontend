import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class GramajeService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    obtenerGramaje(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `gramaje/produccion/${idProduccion}`, { headers: headers });

    }

    obtenerGramajeDetalle(idGramaje): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `gramaje/detalle/${idGramaje}`, { headers: headers });

    }




    registrarGramaje(gramaje): Observable<any> {

        let json = JSON.stringify(gramaje);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'gramaje', params, { headers: headers });

    }

    
    editarGramaje(gramaje, id): Observable<any> {
        let json = JSON.stringify(gramaje);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'gramaje/'+id, params, { headers: headers });

    }

    eliminarGramaje(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + `gramaje/${idProduccion}`, { headers: headers });

    }




}
