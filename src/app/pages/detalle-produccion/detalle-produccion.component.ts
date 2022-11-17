import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';
import { Biomasa } from 'src/app/models/biomasa';
import Swal from 'sweetalert2';
import { BiomasaService } from 'src/app/services/biomasa.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Gramaje } from 'src/app/models/gramaje';
import { GramajeService } from 'src/app/services/gramaje.service';
import { ProduccionService } from 'src/app/services/produccion.service';
import { Alimento } from 'src/app/models/alimento';
import { AlimentoService } from 'src/app/services/alimento.service';
import { ExportService } from 'src/app/services/export.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Produccion } from 'src/app/models/produccion';

@Component({
  selector: 'app-detalle-produccion',
  templateUrl: './detalle-produccion.component.html',
  styleUrls: ['./detalle-produccion.component.css'],
  providers: [
    BiomasaService,
    GramajeService,
    AlimentoService,
    ProduccionService,
    AuthService,
  ],
})
export class DetalleProduccionComponent implements OnInit {
  @ViewChild('modalDetalleGramaje') modalGramaje: ElementRef;
  @ViewChild('modalDetalleBiomasa') modalBiomasa: ElementRef;
  @ViewChild('modalDetalleAlimento') modalAlimento: ElementRef;

  public produccion: Produccion;
  public costo_larva: number;

  public detalleGramaje;
  public detalleBiomasa;
  public detalleAlimento;

  public idAconsultar;
  public accion = 'Registrar';

  public produccionActiva;
  public costos: {
    costo_gramaje: string;
    costo_biomasa: string;
    costo_alimento: string;
  } = { costo_gramaje: null, costo_biomasa: null, costo_alimento: null };

  public mostrarIngresoDatos: Boolean;

  // biomasa
  public cantidad = '';
  public fecha_actual;
  public biomasa: Biomasa;

  // gramaje
  public cantidadGramaje = '';
  public pesoGramaje = '';
  public gramaje: Gramaje;

  //alimento
  public alimento: Alimento;

  public identity;

  public currentEvents: EventApi[] = [];

  public cantidadPromedioCamarones: number = 0;

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    locale: esLocale,
    initialView: 'dayGridMonth',
    weekends: true,
    events: this.currentEvents, // alternatively, use the `events` setting to fetch from a feed
    // editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // eventClick: () => { console.log(`dsd ${clickInfo.event.title}`) },
    eventClick: this.MostrarDetalleCalendario.bind(this),
  };

  constructor(
    private _produccionService: ProduccionService,
    private _biomasaService: BiomasaService,
    private _gramajeService: GramajeService,
    private _alimentoService: AlimentoService,
    private _activateRoute: ActivatedRoute,
    private _exportService: ExportService,
    private _authService: AuthService,
    private modalService: NgbModal
  ) {
    // this.obtenerCalendario();
    this.identity = this._authService.getIdentity();
    this.biomasa = new Biomasa(
      this.identity.nombre,
      moment().format('YYYY-MM-DD')
    );
    this.gramaje = new Gramaje(
      this.identity.nombre,
      moment().format('YYYY-MM-DD')
    );
    this.alimento = new Alimento(
      this.identity.nombre,
      moment().format('YYYY-MM-DD')
    );
    this.fecha_actual = moment().format('YYYY-MM-DD');
  }
  ngOnInit(): void {
    this.comprobarProduccion();
    this.obtenerProduccionPorId();
    this.obtenerCalendario();
    this.obtenerCostos();
  }

  obtenerProduccionPorId() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._produccionService.obtenerProduccionPorId(idProduccion).subscribe(
        (resp) => {
          this.produccion = resp;
          this.costo_larva = +this.produccion.costo_larva;
          //    console.log(this.produccion);
        },
        (err) => {}
      );
    });
  }

  ObtenerAlimentoParaEditar() {
    this._alimentoService.obtenerAlimentoPorId(this.idAconsultar).subscribe(
      (resp) => {
        this.accion = 'Editar';
        this.modalService.dismissAll();
        this.alimento = resp;
      },
      (err) => {}
    );
  }
  ObtenerBiomasaParaEditar() {
    this._biomasaService.obtenerBiomasaDetalle(this.idAconsultar).subscribe(
      (resp) => {
        this.accion = 'Editar';
        this.modalService.dismissAll();
        this.biomasa = resp[0];
        this.biomasa.datos = resp[1];
      },
      (err) => {}
    );
  }

  ObtenerGramajeParaEditar() {
    this._gramajeService.obtenerGramajeDetalle(this.idAconsultar).subscribe(
      (resp) => {
        this.accion = 'Editar';
        this.modalService.dismissAll();
        this.gramaje = resp[0];
        this.gramaje.datos = resp[1];
      },
      (err) => {}
    );
  }

  // obtener la biomasa por produccion
  obtenerCalendario() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._produccionService.obtenerDatosCalendario(idProduccion).subscribe(
        (resp) => {
          // console.log(resp);
          // this.currentEvents = resp;
          this.calendarOptions.events = resp;
          // events: this.currentEvents, // alternatively, use the `events` setting to fetch from a feed
        },
        (err) => {}
      );
    });
  }

  comprobarProduccion() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._produccionService.produccionActiva(idProduccion).subscribe(
        (resp) => {
          this.produccionActiva = resp;
          // console.log(resp);
        },
        (err) => {}
      );
    });
  }

  obtenerCostos() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._produccionService.obtenerCostos(idProduccion).subscribe(
        (resp) => {
          this.costos = resp;
          // console.log(resp);
          console.log(this.produccion);
          this.cantidadPromedioCamarones =
            (parseInt(this.produccion.cantidad) * 8000) / 1000000;
        },
        (err) => {}
      );
    });
  }

  MostrarDetalleCalendario(clickInfo: EventClickArg) {
    this.idAconsultar = clickInfo.event.id;

    if (clickInfo.event.title == 'Alimento') {
      this.obtenerDetalleAlimento(clickInfo.event.id);
    } else if (clickInfo.event.title == 'Biomasa') {
      this.obtenerDetalleBiomasa(clickInfo.event.id);
    } else {
      this.obtenerDetalleGramaje(clickInfo.event.id);
    }
  }

  obtenerDetalleGramaje(idGramaje) {
    this._gramajeService.obtenerGramajeDetalle(idGramaje).subscribe(
      (resp) => {
        this.detalleGramaje = resp;
        this.modalService.open(this.modalGramaje);
      },
      (err) => {}
    );
  }

  obtenerDetalleBiomasa(idBiomasa) {
    this._biomasaService.obtenerBiomasaDetalle(idBiomasa).subscribe(
      (resp) => {
        this.detalleBiomasa = resp;
        this.modalService.open(this.modalBiomasa);
      },
      (err) => {}
    );
  }

  obtenerDetalleAlimento(idAlimento) {
    this._alimentoService.obtenerAlimentoPorId(idAlimento).subscribe(
      (resp) => {
        this.detalleAlimento = resp;
        this.modalService.open(this.modalAlimento);
      },
      (err) => {}
    );
  }

  guardarBiomasa() {
    this.accion = 'Registrar';
    // if (this.biomasa.datos.length <= 0) {
    //   this.alerta('error', 'Datos faltantes', 'Ingrese los datos de Biomasa');
    // } else {
    this.biomasa.cantidad_camarones = this.produccion.cantidad;

    this._activateRoute.params.subscribe((params) => {
      this.biomasa.produccion_id = params['id'];
      this._biomasaService.registrarBiomasa(this.biomasa).subscribe(
        (resp) => {
          if (resp) {
            if (resp.icono == 'success') {
              // form.reset();
              this.obtenerCalendario();
              this.obtenerCostos();
              this.biomasa = new Biomasa(
                this.identity.nombre,
                this.fecha_actual,
                null,
                null,
                null,
                null,
                null,
                null,
                [],
                null
              );
            }
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        },
        (err) => {
          this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
        }
      );
    });
    //  }
  }

  editarBiomasa() {
    this.accion = 'Editar';

    this._activateRoute.params.subscribe((params) => {
      this.biomasa.produccion_id = params['id'];
      this._biomasaService
        .editarBiomasa(this.biomasa, this.idAconsultar)
        .subscribe(
          (resp) => {
            if (resp) {
              if (resp.icono == 'success') {
                // form.reset();
                this.obtenerCalendario();
                this.obtenerCostos();
                this.biomasa = new Biomasa(
                  this.identity.nombre,
                  this.fecha_actual,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  [],
                  null
                );
              }
              this.alerta(resp.icono, resp.title, resp.mensaje);
            }
          },
          (err) => {
            this.alerta(
              'error',
              'Algo salió mal',
              'Intente de nuevo por favor'
            );
          }
        );
    });
  }

  eliminarBiomasa() {
    this._biomasaService.eliminarBiomasa(this.idAconsultar).subscribe(
      (resp) => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerCalendario();
            this.modalService.dismissAll();
            this.obtenerCostos();
            // form.reset();
            this.gramaje = new Gramaje(
              this.identity.nombre,
              this.fecha_actual,
              null,
              null,
              null,
              null,
              [],
              null
            );
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      (err) => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      }
    );
  }

  alertEliminarBiomasa() {
    Swal.fire({
      title: '¿Continuar con esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarBiomasa();
      }
    });
  }

  obtenerCosto(newValue) {
    this.alimento.costo = (parseInt(this.alimento.cantidad) * 30).toString();
  }
  guardarGramaje() {
    this.accion = 'Registrar';
    // if (this.gramaje.datos.length <= 0) {
    //   this.alerta('error', 'Datos faltantes', 'Ingrese los datos de Gramaje');

    // } else {

    this._activateRoute.params.subscribe((params) => {
      this.gramaje.produccion_id = params['id'];
      this._gramajeService.registrarGramaje(this.gramaje).subscribe(
        (resp) => {
          if (resp) {
            if (resp.icono == 'success') {
              // form.reset();
              this.obtenerCalendario();
              this.obtenerCostos();

              this.gramaje = new Gramaje(
                this.identity.nombre,
                this.fecha_actual,
                null,
                null,
                null,
                null,
                [],
                null
              );
            }
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        },
        (err) => {
          this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
        }
      );
    });
    //}
  }

  editarGramaje() {
    this.accion = 'Editar';

    this._activateRoute.params.subscribe((params) => {
      this.gramaje.produccion_id = params['id'];
      this._gramajeService
        .editarGramaje(this.gramaje, this.idAconsultar)
        .subscribe(
          (resp) => {
            if (resp) {
              if (resp.icono == 'success') {
                // form.reset();
                this.obtenerCalendario();
                this.obtenerCostos();

                this.gramaje = new Gramaje(
                  this.identity.nombre,
                  this.fecha_actual,
                  null,
                  null,
                  null,
                  null,
                  [],
                  null
                );
              }
              this.alerta(resp.icono, resp.title, resp.mensaje);
            }
          },
          (err) => {
            this.alerta(
              'error',
              'Algo salió mal',
              'Intente de nuevo por favor'
            );
          }
        );
    });
  }

  eliminarGramaje() {
    this._gramajeService.eliminarGramaje(this.idAconsultar).subscribe(
      (resp) => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerCalendario();
            this.obtenerCostos();

            this.modalService.dismissAll();
            // form.reset();
            this.gramaje = new Gramaje(
              this.identity.nombre,
              this.fecha_actual,
              null,
              null,
              null,
              null,
              [],
              null
            );
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      (err) => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      }
    );
  }

  alertEliminarGramaje() {
    Swal.fire({
      title: '¿Continuar con esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarGramaje();
      }
    });
  }

  guardarAlimento() {
    this.accion = 'Registrar';

    this._activateRoute.params.subscribe((params) => {
      this.alimento.produccion_id = params['id'];
      this._alimentoService.registrarAlimento(this.alimento).subscribe(
        (resp) => {
          if (resp) {
            if (resp.icono == 'success') {
              this.obtenerCalendario();
              this.obtenerCostos();

              // form.reset();
              this.alimento = new Alimento(
                this.identity.nombre,
                this.fecha_actual,
                null,
                null,
                null,
                null,
                null
              );
            }
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        },
        (err) => {
          this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
        }
      );
    });
  }

  editarAlimento() {
    this.accion = 'Editar';
    this._alimentoService
      .editarAlimento(this.alimento, this.idAconsultar)
      .subscribe(
        (resp) => {
          if (resp) {
            if (resp.icono == 'success') {
              this.obtenerCalendario();
              this.obtenerCostos();

              // form.reset();
              this.alimento = new Alimento(
                this.identity.nombre,
                this.fecha_actual,
                null,
                null,
                null,
                null,
                null
              );
            }
            this.alerta(resp.icono, resp.title, resp.mensaje);
          }
        },
        (err) => {
          this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
        }
      );
  }

  eliminarAlimento() {
    this._alimentoService.eliminarAlimento(this.idAconsultar).subscribe(
      (resp) => {
        if (resp) {
          if (resp.icono == 'success') {
            this.obtenerCalendario();
            this.obtenerCostos();

            this.modalService.dismissAll();
            // form.reset();
            this.alimento = new Alimento(
              this.identity.nombre,
              this.fecha_actual,
              null,
              null,
              null,
              null,
              null
            );
          }
          this.alerta(resp.icono, resp.title, resp.mensaje);
        }
      },
      (err) => {
        this.alerta('error', 'Algo salió mal', 'Intente de nuevo por favor');
      }
    );
  }

  alertEliminarAlimento() {
    Swal.fire({
      title: '¿Continuar con esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarAlimento();
      }
    });
  }

  // obtener dato

  obtenerDato() {
    this.biomasa.datos.push({ cantidad: this.cantidad });
    this.cantidad = '';
  }

  obtenerDatoGramaje() {
    this.gramaje.datos.push({
      cantidad: this.cantidadGramaje,
      peso: this.pesoGramaje,
    });
    this.cantidadGramaje = '';
    this.pesoGramaje = '';
  }

  mostrar() {
    this.mostrarIngresoDatos = !this.mostrarIngresoDatos;
  }

  alerta(icono, title, mensaje) {
    Swal.fire({
      icon: icono,
      title: title,
      text: mensaje,
    });
  }

  exportAlimento() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._alimentoService.obtenerAlimento(idProduccion).subscribe(
        (resp) => {
          let data: any[] = [];

          resp.forEach((element: any) => {
            let dataJSON = {
              ID: element.id,
              Responsable: element.responsable,
              'Fecha Alimento': element.fecha,
              Tipo: element.tipo,
              Cantidad: element.cantidad,
              Costo: element.costo,
              Detalle: element.detalle,
            };
            data.push(dataJSON);
          });

          this._exportService.exportToExcel(data, 'Reporte Alimento');
        },
        (err) => {}
      );
    });
  }

  exportGramaje() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._gramajeService.obtenerGramaje(idProduccion).subscribe(
        (resp) => {
          let data: any[] = [];

          resp.forEach((element: any) => {
            let dataJSON = {
              ID: element.id,
              Responsable: element.responsable,
              'Fecha Gramaje': element.fecha,
              'Peso promedio': element.peso_promedio,
              Incremento: element.incremento,
              'Dias siembra': element.dias_siembra,
              Detalle: element.detalle,
              Costo: element.costo,
            };
            data.push(dataJSON);
          });

          this._exportService.exportToExcel(data, 'Reporte Gramaje');
        },
        (err) => {}
      );
    });
  }

  exportBiomasa() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._biomasaService.obtenerBiomasa(idProduccion).subscribe(
        (resp) => {
          let data: any[] = [];

          resp.forEach((element: any) => {
            let dataJSON = {
              ID: element.id,
              Responsable: element.responsable,
              'Fecha biomasa': element.fecha,
              'Area de red': element.area_red,
              'Cantidad camarones': element.cantidad_camarones,
              'Dias siembra': element.dias_siembra,
              'Cantidad total': element.cantidad_total,
              Detalle: element.detalle,
              Costo: element.costo,
            };
            data.push(dataJSON);
          });

          this._exportService.exportToExcel(data, 'Reporte Biomasa');
        },
        (err) => {}
      );
    });
  }

  exportResumen() {
    this._activateRoute.params.subscribe((params) => {
      let idProduccion = params['id'];
      this._produccionService.obtenerDatosReporte(idProduccion).subscribe(
        (resp) => {
          let data: any[] = [];

          resp[0].forEach((element: any) => {
            let dataJSON = {
              Piscina: element.piscina,
              'Inicio producción': element.fecha_apertura_produccion,
              'Fin producción': element.fecha_cierre_produccion,
              'Responsable Biomasa': element.responsable_biomasa,
              'Fecha Reg. Biomasa': element.fecha_biomasa,
              'Area de Red': element.area_red,
              'Cant. Total': element.cantidad_total,
              'Cant. Camarones': element.cantidad_camarones,
              'Dias Siembra Bio.': element.dias_siembra,
              'Detalle Biomasa': element.detalle_biomasa,
            };
            data.push(dataJSON);
          });

          resp[1].forEach((element: any) => {
            let dataJSON = {
              'Responsable Gramaje': element.responsable_gramaje,
              'Fecha Reg. Gramaje': element.fecha_gramaje,
              'Peso Promedio': element.peso_promedio,
              Incremento: element.incremento,
              'Dias Siembra Gram.': element.dias_siembra,
              'Detalle Gramaje': element.detalle_gramaje,
            };
            data.push(dataJSON);
          });

          resp[2].forEach((element: any) => {
            let dataJSON = {
              'Responsable Alimento': element.responsable_alimento,
              'Tipo alimento': element.tipo,
              'Cantidad alimento': element.cantidad_alimento,
              'Detalle alimento': element.alimento_detalle,
            };
            data.push(dataJSON);
          });

          this._exportService.exportToExcel(data, 'Reporte producción');
        },
        (err) => {}
      );
    });
  }
}
