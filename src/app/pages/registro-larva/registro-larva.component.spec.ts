import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroLarvaComponent } from './registro-larva.component';

describe('RegistroLarvaComponent', () => {
  let component: RegistroLarvaComponent;
  let fixture: ComponentFixture<RegistroLarvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroLarvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroLarvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
