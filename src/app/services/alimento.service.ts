import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class AlimentoService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    obtenerAlimento(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `alimento/produccion/${idProduccion}`, { headers: headers });

    }

    obtenerAlimentoPorId(id): Observable<any> {
        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `alimento/${id}`, { headers: headers });   

    }


    registrarAlimento(alimento): Observable<any> {

        let json = JSON.stringify(alimento);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', this.token);
        return this._http.post(this.url + 'alimento', params, { headers: headers });

    }

    
    editarAlimento(alimento, id): Observable<any> {

        let json = JSON.stringify(alimento);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', this.token);
        return this._http.put(this.url + 'alimento/'+id, params, { headers: headers });

    }


    eliminarAlimento(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + `alimento/${idProduccion}`, { headers: headers });

    }



}
