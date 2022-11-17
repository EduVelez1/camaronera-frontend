import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertarCodigoComponent } from './insertar-codigo.component';

describe('InsertarCodigoComponent', () => {
  let component: InsertarCodigoComponent;
  let fixture: ComponentFixture<InsertarCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertarCodigoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertarCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
