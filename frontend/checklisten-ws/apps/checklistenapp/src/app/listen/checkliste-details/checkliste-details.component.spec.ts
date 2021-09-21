import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklisteDetailsComponent } from './checkliste-details.component';

describe('ChecklisteDetailsComponent', () => {
  let component: ChecklisteDetailsComponent;
  let fixture: ComponentFixture<ChecklisteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklisteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklisteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
