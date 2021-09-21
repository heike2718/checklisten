import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistenListeComponent } from './checklisten-liste.component';

describe('ChecklistenListeComponent', () => {
  let component: ChecklistenListeComponent;
  let fixture: ComponentFixture<ChecklistenListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistenListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistenListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
