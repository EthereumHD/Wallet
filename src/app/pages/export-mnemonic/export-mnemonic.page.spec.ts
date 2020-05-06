import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportMnemonicPage } from './export-mnemonic.page';

describe('ExportMnemonicPage', () => {
  let component: ExportMnemonicPage;
  let fixture: ComponentFixture<ExportMnemonicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportMnemonicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportMnemonicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
