import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPrivatekeyPage } from './export-privatekey.page';

describe('ExportPrivatekeyPage', () => {
  let component: ExportPrivatekeyPage;
  let fixture: ComponentFixture<ExportPrivatekeyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPrivatekeyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPrivatekeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
