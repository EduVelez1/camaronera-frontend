import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers:[UsuarioService, ProduccionService]
})

export class InicioComponent implements OnInit {
  public title = 'Inicio'

  public cantidadUsuario;
  public producciones: [];
  public paginaCargada: Boolean;
  displayedColumns: string[] = ['fecha_apertura', 'fecha_cierre', 'piscina', 'camaronera', 'larva', 'cantidad', 'costo_larva', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _usuarioService: UsuarioService,
    private _produccionService: ProduccionService,
    private _exportService: ExportService
  ) { }

  ngOnInit(): void {
  this.totalUsuarios();
  this.obtenerProducciones()
  }

  totalUsuarios(){
    this._usuarioService.totalUsuarios().subscribe(
      resp=> {
        this.cantidadUsuario = resp;
        
      //  console.log(resp);
      }
    )}

    obtenerProducciones(){
      this._produccionService.obtenerProducciones().subscribe(
        resp=> {
          this.dataSource.data = resp;
          this.dataSource.paginator = this.paginator;
          this.paginaCargada = true;

        //  console.log(resp);
        })
      }

      
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
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
        'Estado': 'Abierta'      
        
      };
      data.push(dataJSON)
    });
    this._exportService.exportToExcel(data, 'Producciones Abiertas');
  }

  // tslint:disable-next-line:typedef

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
