import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class BiomasaService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    obtenerBiomasa(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `biomasa/produccion/${idProduccion}`, { headers: headers });

    }
    obtenerBiomasaDetalle(idBiomasa): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `biomasa/detalle/${idBiomasa}`, { headers: headers });

    }

    // obtenerHistorialProducciones(): Observable<any> {

    //     let headers = new HttpHeaders().set('Authorization', this.token);
    //     return this._http.get(this.url + 'produccion-historial', { headers: headers });

    // }

    registrarBiomasa(biomasa): Observable<any> {

        let json = JSON.stringify(biomasa);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'biomasa', params, { headers: headers });

    }

    editarBiomasa(biomasa, id): Observable<any> {

        let json = JSON.stringify(biomasa);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'biomasa/'+id, params, { headers: headers });

    }

    eliminarBiomasa(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + `biomasa/${idProduccion}`, { headers: headers });

    }






}
