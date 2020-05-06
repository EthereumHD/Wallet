import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueUnitPage } from './value-unit.page';

describe('ValueUnitPage', () => {
  let component: ValueUnitPage;
  let fixture: ComponentFixture<ValueUnitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueUnitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueUnitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
