import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';
import { AuthService } from './auth.service';

@Injectable()
export class LarvaService {

    public url: string;
    public token;
    constructor(
        private _authService: AuthService,
        private _http: HttpClient) {

        this.url = global.url;
        this.token = this._authService.getToken();

    }


    registrarLarva(larva): Observable<any> {

        let json = JSON.stringify(larva);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                       .set('Authorization', this.token);
        return this._http.post(this.url + 'larva', params, { headers: headers });

    }

    obtenerLarvas(): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'larva', { headers: headers });

    }

    obtenerLarvaPorId(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.get(this.url + 'larva/'+id, { headers: headers });

    }


    editarLarva(larva, id): Observable<any> {

        let json = JSON.stringify(larva);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', this.token);
        return this._http.put(this.url + 'larva/'+id, params, { headers: headers });

    }

    eliminarLarvar(id): Observable<any> {

        let headers = new HttpHeaders().set('Authorization', this.token);
        return this._http.delete(this.url + 'larva/'+id, { headers: headers });

    }

}
