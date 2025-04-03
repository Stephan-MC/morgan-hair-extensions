import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendWigListComponent } from './recommend-wig-list.component';

describe('RecommendWigListComponent', () => {
  let component: RecommendWigListComponent;
  let fixture: ComponentFixture<RecommendWigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendWigListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendWigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
