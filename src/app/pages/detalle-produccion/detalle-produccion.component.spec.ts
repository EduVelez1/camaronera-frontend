import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProduccionComponent } from './detalle-produccion.component';

describe('DetalleProduccionComponent', () => {
  let component: DetalleProduccionComponent;
  let fixture: ComponentFixture<DetalleProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleProduccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
