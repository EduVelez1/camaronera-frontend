import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  providers:[UsuarioService]
})
export class RegistrarUsuarioComponent implements OnInit {
  public usuario: Usuario;

  constructor(
    private _usuarioService: UsuarioService,
  ) { 

this.usuario = new Usuario();

  }

  ngOnInit(): void {
  }

  onSubmit(form) {
if (this.usuario.role_id == '3') {
  this.usuario.contrasena = 'nulo';
  
}

    this._usuarioService.registrarUsuario(this.usuario).subscribe(
      resp => {
        if(resp){
          if (resp.icono == 'success') {
            // form.reset();
            this.usuario = new Usuario(null,null,null,null,null,null,null,'2','1',null);
          }    
         
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
        
      },
      err =>{
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');

      }
    )
  }

  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }

  soloNumeros(event){
    const pattern = /^[0-9]*$/;   
      let inputChar = String.fromCharCode(event.charCode);
  
      if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
      }
  }

  soloLetras(event){
    const pattern = /^[a-zA-Z ]*$/;   
      let inputChar = String.fromCharCode(event.charCode);
  
      if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
      }
  }

  soloEmail(event){
    
    const pattern = /[a-zA-Z@_0-9-.]/;   
    let inputChar = String.fromCharCode(event.charCode);



    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }



}
