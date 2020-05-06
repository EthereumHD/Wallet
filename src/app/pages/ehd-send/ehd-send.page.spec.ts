import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EhdSendPage } from './ehd-send.page';

describe('EhdSendPage', () => {
  let component: EhdSendPage;
  let fixture: ComponentFixture<EhdSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EhdSendPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EhdSendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
