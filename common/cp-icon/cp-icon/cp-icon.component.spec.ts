import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpIconComponent } from './cp-icon.component';

describe('CpIconComponent', () => {
  let component: CpIconComponent;
  let fixture: ComponentFixture<CpIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
