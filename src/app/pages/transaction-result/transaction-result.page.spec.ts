import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionResultPage } from './transaction-result.page';

describe('TransactionResultPage', () => {
  let component: TransactionResultPage;
  let fixture: ComponentFixture<TransactionResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionResultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
