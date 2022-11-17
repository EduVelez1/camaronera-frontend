import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionesActivasComponent } from './producciones-activas.component';

describe('ProduccionesActivasComponent', () => {
  let component: ProduccionesActivasComponent;
  let fixture: ComponentFixture<ProduccionesActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionesActivasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
