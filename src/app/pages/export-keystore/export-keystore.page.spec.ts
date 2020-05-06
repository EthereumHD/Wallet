import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportKeystorePage } from './export-keystore.page';

describe('ExportKeystorePage', () => {
  let component: ExportKeystorePage;
  let fixture: ComponentFixture<ExportKeystorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportKeystorePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportKeystorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
