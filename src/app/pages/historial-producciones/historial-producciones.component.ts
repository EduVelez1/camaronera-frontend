import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-historial-producciones',
  templateUrl: './historial-producciones.component.html',
  styleUrls: ['./historial-producciones.component.css'],
  providers:[ProduccionService]
})
export class HistorialProduccionesComponent implements OnInit {
  public paginaCargada: Boolean;

  displayedColumns: string[] = ['fecha_apertura', 'fecha_cierre', 'piscina', 'camaronera', 'larva', 'cantidad', 'costo_larva', 'estado', 'acciones'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private _produccionService: ProduccionService,
    private _exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.obtenerProducciones()
  }

  obtenerProducciones(){
    this._produccionService.obtenerHistorialProducciones().subscribe(
      resp=> {
        this.dataSource.data = resp;
        this.dataSource.paginator = this.paginator;
        this.paginaCargada = true;
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
          'Fecha cierre': element.fecha_cierre,
          'Larva': element.larva, 
          'Cantidad': element.cantidad, 
          'Estado': 'Cerrada'       
          
        };
        data.push(dataJSON)
      });
      this._exportService.exportToExcel(data, 'Producciones Cerradas');
    }

    downloadPDF() {
      // Extraemos el
      const DATA = document.getElementById('htmlData') as HTMLElement;
      const doc = new jsPDF('l', 'pt', 'a4');
      doc.text('PRODUCCIONES CERRADAS',330,40)
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
        docResult.save(`${new Date().toISOString()}_produccionesCerradas.pdf`);
      });
    }

}
