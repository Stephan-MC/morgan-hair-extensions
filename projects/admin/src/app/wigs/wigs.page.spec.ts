import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WigsPage } from './wigs.page';

describe('WigsPage', () => {
  let component: WigsPage;
  let fixture: ComponentFixture<WigsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WigsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WigsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
