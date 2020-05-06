import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupMnemonicPage } from './backup-mnemonic.page';

describe('BackupMnemonicPage', () => {
  let component: BackupMnemonicPage;
  let fixture: ComponentFixture<BackupMnemonicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupMnemonicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackupMnemonicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
