import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[AuthService]
})
export class SidebarComponent implements OnInit {
public identity;
  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) { 
    this.identity = this._authService.getIdentity();
  }

  ngOnInit(): void {
  }

  
  salir(){
    localStorage.clear();
    this._router.navigate(['login']);

  }
  async alertContrasena(){
    const { value: pass } = await Swal.fire({
      input: 'text',
      inputLabel: 'Ingrese nueva contraseña',
      inputPlaceholder: '***********',
      confirmButtonText: 'Cambiar'
    })
    
    if (pass) {

      this.cambiarContrasena({contrasena: pass});
    }
  }
  cambiarContrasena(pass){
    this._authService.CambiarPass(pass).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
           
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      })
  }

  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }


}
