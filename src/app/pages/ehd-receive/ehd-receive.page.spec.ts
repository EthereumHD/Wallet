import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EhdReceivePage } from './ehd-receive.page';

describe('EhdReceivePage', () => {
  let component: EhdReceivePage;
  let fixture: ComponentFixture<EhdReceivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EhdReceivePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EhdReceivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
