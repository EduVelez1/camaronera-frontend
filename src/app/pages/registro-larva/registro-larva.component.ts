import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Larva } from 'src/app/models/larva';
import { ExportService } from 'src/app/services/export.service';
import { LarvaService } from 'src/app/services/larva.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-registro-larva',
  templateUrl: './registro-larva.component.html',
  styleUrls: ['./registro-larva.component.css'],
  providers:[UsuarioService, LarvaService]
})
export class RegistroLarvaComponent implements OnInit {
  public larva: Larva;
  public proveedores = [];
  public editar: Boolean;
  public larvaActual;

  public paginaCargada: Boolean;
  public camaroneras: [];
  displayedColumns: string[] = ['proveedor', 'larva', 'cantidad','usadas', 'disponibles', 'precio', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private _usuarioService: UsuarioService, private _larvaService: LarvaService, private _exportService: ExportService
    ) {

    this.larva = new Larva();
   }

  ngOnInit(): void {
    this.obtenerProveedores();
    this.obtenerLarvas();
  }

  obtenerProveedores(){
    this._usuarioService.obtenerProveedores().subscribe(
      resp => {
        this.proveedores = resp;
      }
    )
  }

  obtenerLarvas(){
    this._larvaService.obtenerLarvas().subscribe(
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

  onSubmit(form){
    this._larvaService.registrarLarva(this.larva).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.larva = new Larva('0', null, null, null);
            this.obtenerLarvas()
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },

      err => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');

      })

  }

  obtenerLarvaPorId(id) {

    this._larvaService.obtenerLarvaPorId(id).subscribe(
      resp => {

        this.larvaActual = resp;
        this.editar = true;
        this.larva = resp

      },
      err => {

      })
  }
  eliminarLarva(id){
    this._larvaService.eliminarLarvar(id).subscribe(
      resp=>{
        if (resp) {
          if (resp.icono == 'success') {
            this.larva = new Larva('0', null, null, null);
            this.obtenerLarvas()
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
        this.eliminarLarva(id)

      }
    })
  }

  editarLarva() {

    this._larvaService.editarLarva(this.larva, this.larvaActual.id).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerLarvas();
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
    this.larva = new Larva('0', null, null, null);

  }
  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });

  }
    export(){
    let data: any[] = []
    this.dataSource.filteredData.forEach((element: any) => {
      let dataJSON = {
        'Identificador':element.id, 
        'Proveedor':element.proveedor.nombres, 
        'Larva': element.tipo,  
        'Cantidad': element.cantidad, 
        'Precio': element.precio        
      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Piscina');
  }

  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData') as HTMLElement;
    const doc = new jsPDF('l', 'pt', 'a4');
    doc.text('LISTA DE LARVAS',330,40)
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
      docResult.save(`${new Date().toISOString()}_listaLarvas.pdf`);
    });
  }

}
