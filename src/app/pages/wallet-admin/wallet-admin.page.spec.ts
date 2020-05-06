import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAdminPage } from './wallet-admin.page';

describe('WalletAdminPage', () => {
  let component: WalletAdminPage;
  let fixture: ComponentFixture<WalletAdminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletAdminPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
