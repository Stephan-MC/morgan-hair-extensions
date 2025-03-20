import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WigCardComponent } from './wig-card.component';

describe('WigCardComponent', () => {
  let component: WigCardComponent;
  let fixture: ComponentFixture<WigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WigCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
