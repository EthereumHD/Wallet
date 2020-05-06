import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageTogglePage } from './language-toggle.page';

describe('LanguageTogglePage', () => {
  let component: LanguageTogglePage;
  let fixture: ComponentFixture<LanguageTogglePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageTogglePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageTogglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
