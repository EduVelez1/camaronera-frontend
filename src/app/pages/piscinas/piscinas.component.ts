import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Piscina } from 'src/app/models/piscina';
import { CamaroneraService } from 'src/app/services/camaronera.service';
import { ExportService } from 'src/app/services/export.service';
import { PiscinaService } from 'src/app/services/piscina.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-piscinas',
  templateUrl: './piscinas.component.html',
  styleUrls: ['./piscinas.component.css'],
  providers: [PiscinaService, CamaroneraService]
})
export class PiscinasComponent implements OnInit {
  public piscinaActual;
  public editar: Boolean;
  public paginaCargada: Boolean;
  public camaroneras: [];
  public piscina: Piscina;
  displayedColumns: string[] = ['nombre', 'area', 'camaronera', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _piscinaService: PiscinaService,
    private _camaroneraService: CamaroneraService,
    private _exportService: ExportService
  ) {
    this.piscina = new Piscina();
  }

  ngOnInit(): void {
    this.obtenerCamaroneras()
    this.obtenerPiscinas();
  }

  obtenerCamaroneras() {
    this._camaroneraService.obtenerCamaroneras().subscribe(
      resp => {
        this.camaroneras = resp;
        this.paginaCargada = true;
      }
    )
  }


  obtenerPiscinas() {
    this._piscinaService.obtenerPiscinas().subscribe(
      resp => {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;

      });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  onSubmit(form) {

    this._piscinaService.registrarPiscina(this.piscina).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.piscina = new Piscina(null, null, '1', null);
            this.obtenerPiscinas();
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      })

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
        this.habilitarDeshabilitarPiscina(id)

      }
    })
  }

  habilitarDeshabilitarPiscina(id) {
    this._piscinaService.habilitarDeshabilitarPiscina(id).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerPiscinas();
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      })
  }

  obtenerPiscinaPorId(id) {

    this._piscinaService.obtenerPiscinaPorId(id).subscribe(
      resp => {

        this.piscinaActual = resp;
        this.editar = true;
        this.piscina = resp

      },
      err => {

      }
    )
  }

  editarPiscina() {

    this._piscinaService.editarPiscina(this.piscina, this.piscinaActual.id).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerPiscinas();
            this.cancelar()
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        }
      },
      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      })
  }

  cancelar() {
    this.editar = false;
    this.piscina = new Piscina(null, null, '1', null);

  }

  export() {
    let data: any[] = []
    this.dataSource.filteredData.forEach((element: any) => {
      let dataJSON = {
        'Identificador': element.id,
        'Nombre': element.nombre,
        'Area': element.area,
        'Camaronera': element.camaronera,
        'Estado': element.estado
      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Piscina');
  }

  // tslint:disable-next-line:typedef

downloadPDF() {
  // Extraemos el
  const DATA = document.getElementById('htmlData') as HTMLElement;
  const doc = new jsPDF('l', 'pt', 'a4');
  doc.text('LISTA DE PISCINAS',330,40)
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
    docResult.save(`${new Date().toISOString()}_listaPiscinas.pdf`);
  });
}
  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }



}
