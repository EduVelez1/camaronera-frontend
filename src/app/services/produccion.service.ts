import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class ProduccionService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }

    obtenerProducciones(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'produccion', { headers: headers });

    }

    obtenerDatosCalendario(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `produccion/calendario/${idProduccion}`, { headers: headers });

    }

    obtenerHistorialProducciones(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'produccion-historial', { headers: headers });

    }

    registrarProduccion(produccion): Observable<any> {

        let json = JSON.stringify(produccion);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.post(this.url + 'produccion', params, { headers: headers });

    }
    obtenerDatosReporte(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `produccion/reporte/${idProduccion}`, { headers: headers });

    }

    produccionActiva(idProduccion): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + `produccion/activa/${idProduccion}`, { headers: headers });

    }

    cerrarProduccion(id, produccion): Observable<any> {

        let json = JSON.stringify(produccion);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'produccion/'+id, params, { headers: headers });

    }

    obtenerProduccionPorId(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'produccion/'+id, { headers: headers });

    }

    obtenerCostos(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'produccion/costos/'+id, { headers: headers });

    }

    



}
