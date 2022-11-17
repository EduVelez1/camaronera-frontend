import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProduccionService } from 'src/app/services/produccion.service';
import { PiscinaService } from 'src/app/services/piscina.service';
import { Produccion } from 'src/app/models/produccion';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ExportService } from 'src/app/services/export.service';
import { LarvaService } from 'src/app/services/larva.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-producciones-activas',
  templateUrl: './producciones-activas.component.html',
  styleUrls: ['./producciones-activas.component.css'],
  providers: [ProduccionService, PiscinaService, LarvaService],


})
export class ProduccionesActivasComponent implements OnInit {
  public piscinas = [];
  public produccion: Produccion;
  public fecha_actual;
  public paginaCargada: Boolean;
  public larvas = [];
  public larva;

  public cantidadDisponiblesLarvas: number;

  displayedColumns: string[] = ['fecha_apertura', 'fecha_cierre', 'piscina', 'camaronera', 'larva', 'cantidad', 'costo_larva', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _piscinaService: PiscinaService,
    private _produccionService: ProduccionService,
    private _larvaService: LarvaService,
    private _exportService: ExportService,
    private _activateRoute: ActivatedRoute,


  ) {
    this.produccion = new Produccion();

    this.produccion.costo_larva = this.produccion.cantidad;
  }

  ngOnInit(): void {
    this.obtenerProducciones();
    this.obtenerPiscina();
    this.obtenerLarvas();
    this.produccion.fecha_apertura = moment().format('YYYY-MM-DD');
    this.fecha_actual = moment().format('YYYY-MM-DD');

  }

  obtenerProducciones() {
    this._produccionService.obtenerProducciones().subscribe(
      resp => {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
        this.paginaCargada = true;

      })
  }

  obtenerPiscina() {
    this._piscinaService.obtenerPiscinasActivas().subscribe(
      resp => {
        this.piscinas = resp;

        //  console.log(resp);
      })
  }

  obtenerLarvas() {
    this._larvaService.obtenerLarvas().subscribe(
      resp => {
        this.larvas = resp;


     //  console.log(this.larvas);
      })
  }


  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  calcularCostos(event: Event) {

    if (this.larva) {
      
      
      const cantidad = (event.target as HTMLInputElement).value;
      this.produccion.costo_larva = ((parseInt(cantidad) * this.larva.precio )/this.larva.cantidad).toFixed(2).toString() 
    }
    
  }

  selectTipoLarva(id){
    if (id != 0) {      

    this._larvaService.obtenerLarvaPorId(id).subscribe(
      resp => {
        this.larva = resp;

        this.cantidadDisponiblesLarvas = +this.larva.disponibles;
      },
      err => {

      }
    )
  } 



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
        this.cerrarProduccion(id)

      }
    })
  }



  cerrarProduccion(idProduccion){
      this._produccionService.cerrarProduccion(idProduccion, {'fecha_cierre': this.fecha_actual}).subscribe(
        resp => {
          this.obtenerProducciones();
    
    })
  }

  onSubmit(form) {
    this._produccionService.registrarProduccion(this.produccion).subscribe(
      resp => {
        if (resp) {
          if (resp.icono == 'success') {
            this.produccion = new Produccion('0', this.fecha_actual, null, '0', null, null);
            this.obtenerProducciones();
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },

      err => {
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

  export(){
    let data: any[] = []
    this.dataSource.filteredData.forEach((element: any) => {
      let dataJSON = {
        'Identificador':element.id, 
        'Camaronera':element.camaronera, 
        'Propietario': element.propietario,
        'Piscina': element.piscina,
        'Fecha apertura': element.fecha_apertura, 
        'Larva': element.larva, 
        'Cantidad': element.cantidad, 
        'Estado': 'Abierta'       
      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Producciones Abiertas');
  }

  downloadPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData') as HTMLElement;
    const doc = new jsPDF('l', 'pt', 'a4');
    doc.text('PRODUCCIONES ACTIVAS',330,40)
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
      docResult.save(`${new Date().toISOString()}_produccionesActivas.pdf`);
    });
  }


}
