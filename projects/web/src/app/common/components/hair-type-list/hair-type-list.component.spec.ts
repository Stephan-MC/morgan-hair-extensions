import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairTypeListComponent } from './hair-type-list.component';

describe('HairTypeListComponent', () => {
  let component: HairTypeListComponent;
  let fixture: ComponentFixture<HairTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
