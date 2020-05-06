import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletNamePage } from './wallet-name.page';

describe('WalletNamePage', () => {
  let component: WalletNamePage;
  let fixture: ComponentFixture<WalletNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
