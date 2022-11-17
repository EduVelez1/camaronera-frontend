import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialProduccionesComponent } from './historial-producciones.component';

describe('HistorialProduccionesComponent', () => {
  let component: HistorialProduccionesComponent;
  let fixture: ComponentFixture<HistorialProduccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialProduccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialProduccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
