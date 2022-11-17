import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamaronerasComponent } from './camaroneras.component';

describe('CamaronerasComponent', () => {
  let component: CamaronerasComponent;
  let fixture: ComponentFixture<CamaronerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CamaronerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamaronerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
