import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Camaronera } from 'src/app/models/camaronera';
import { CamaroneraService } from 'src/app/services/camaronera.service';
import { ExportService } from 'src/app/services/export.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-camaroneras',
  templateUrl: './camaroneras.component.html',
  styleUrls: ['./camaroneras.component.css'],
  providers: [CamaroneraService]
})
export class CamaronerasComponent implements OnInit {

  public propietarios: [];
  public camaronera: Camaronera;
  public paginaCargada: Boolean;

  displayedColumns: string[] = ['nombre', 'propietario', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _camaroneraService: CamaroneraService,
    private _exportService: ExportService
  ) {
    this.camaronera = new Camaronera();

  }

  ngOnInit(): void {
    this.obtenerPropietarios()
    this.obtenerCamaroneras();
  }

  obtenerCamaroneras() {

    this._camaroneraService.obtenerCamaroneras().subscribe( 
      resp => {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
        this.paginaCargada = true;


      })
  }

  obtenerPropietarios() {
    this._camaroneraService.obtenerPropietarios().subscribe(
      resp => {
        this.propietarios = resp;
      }
    )
  }

  onSubmit(form) {
    this._camaroneraService.registrarCamaronera(this.camaronera).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.camaronera = new Camaronera('0', null);
            this.obtenerCamaroneras();
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');

      }
    )
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
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
        this.habilitarDeshabilitarCamaronera(id)

      }
    })
  }

  habilitarDeshabilitarCamaronera(id) {
    this._camaroneraService.habilitarDeshabilitarCamaronera(id).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerCamaroneras();
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      })
  }

  export() {
    let data: any[] = []
    this.dataSource.filteredData.forEach((element: any) => {
      let dataJSON = {
        'Identificador': element.id,
        'Nombre': element.nombre,
        'Propietario': element.propietario.nombres,
        'Estado': element.estado.tipo
      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Camaroneras');
  }

  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }

}
