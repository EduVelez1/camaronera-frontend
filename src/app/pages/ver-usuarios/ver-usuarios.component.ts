import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from 'src/app/services/export.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-ver-usuarios',
  templateUrl: './ver-usuarios.component.html',
  styleUrls: ['./ver-usuarios.component.css'],
  providers: [UsuarioService]
})
export class VerUsuariosComponent implements OnInit {
  public tipoUsuario;
  public paginaCargada: Boolean;

  displayedColumns: string[] = ['cedula', 'nombres', 'correo', 'telefono', 'role', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _usuarioService: UsuarioService,
    private _activateRoute: ActivatedRoute,
    private _exportService: ExportService


  ) { }

  ngOnInit(): void {
    this.obtenerParametro()

  }

  obtenerUsuarios(tipo) {
    this.paginaCargada = false;

    this._usuarioService.obtenerUsuarios(tipo).subscribe(
      resp => {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
        this.paginaCargada = true;

      });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }


  obtenerParametro() {
    this._activateRoute.params.subscribe(params => {
      let tipoUsuario = params['tipoUsuario'];
      this.obtenerUsuarios(tipoUsuario);

    });
  }

  dialogEliminar(id) {
    Swal.fire({
      title: '¿Continuar con esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habilitarDeshabilitarUsuario(id)

      }
    })
  }


  habilitarDeshabilitarUsuario(id) {
    this._usuarioService.habilitarDeshabilitarUsuario(id).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerParametro();
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

  export() {
    let data: any[] = []
    this.dataSource.filteredData.forEach((element: any) => {
      let dataJSON = {
        'Identificador': element.id,
        'Cedula': element.cedula,
        'Correo': element.correo,
        'Telefono': element.telefono,
        'Role': element.role.tipo,
        'Estado': element.estado.tipo


      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Usuarios');
  }
  
  
downloadPDF() {
  // Extraemos el
  const DATA = document.getElementById('htmlData') as HTMLElement;
  const doc = new jsPDF('l', 'pt', 'a4');
  doc.text('LISTA DE USUARIOS',330,40)
  const options = {
    background: 'white',
    scale: 3

  };

  html2canvas(DATA, options).then((canvas) => {

    const img = canvas.toDataURL('image/PNG');

    // Add image Canvas to PDF
    const bufferX = 15;
    const bufferY = 60;
    const imgProps = (doc as any).getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    return doc;
  }).then((docResult) => {
    docResult.save(`${new Date().toISOString()}_listaUsuarios.pdf`);
  });
}


}
