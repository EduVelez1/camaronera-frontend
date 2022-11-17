import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinasComponent } from './piscinas.component';

describe('PiscinasComponent', () => {
  let component: PiscinasComponent;
  let fixture: ComponentFixture<PiscinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiscinasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
