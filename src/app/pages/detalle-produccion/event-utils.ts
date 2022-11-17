import { ThisReceiver } from '@angular/compiler';
import { EventInput } from '@fullcalendar/angular';
import { BiomasaService } from 'src/app/services/biomasa.service';
import { GramajeService } from 'src/app/services/gramaje.service';
import { ProduccionService } from 'src/app/services/produccion.service';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today


class Eventos {
  public events: EventInput[];

  constructor(private _produccionService: ProduccionService) {

  }

  obtenerBiomasa() {
    this._produccionService.obtenerDatosCalendario(16).subscribe(
      resp => {
        this.events = resp      
      }

    )
    
  }

}


export const INITIAL_EVENTS: EventInput[] = [
  // {
  //   id: createEventId(),
  //   title: 'All-day event9`99',
  //   start: TODAY_STR
  // },
  // {
  //   id: createEventId(),
  //   title: 'Timed event',
  //   start: TODAY_STR + 'T12:00:00'
  // }

  {
    id: createEventId(),
    title: 'All-day event9`99',
    start: TODAY_STR,
    // backgroundColor: '#FFEF7E',
    textColor: 'black',
    color: '#FFEF7E'
  },
  {
    id: createEventId(),
    title: 'All-day event9`99',
    start: '2021-12-02 00:00:00',
    backgroundColor: '#8EE6FE',
    textColor: 'black',
    color: '#8EE6FE'
  },
  {
    id: createEventId(),
    title: 'All-day event9`99',
    start: '2021-12-10',
    backgroundColor: '#B2FB9B',
    textColor: 'black',
    color: '#B2FB9B'
  },
];

export function createEventId() {
  return String(eventGuid++);
}