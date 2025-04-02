import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWigLengthDialogComponent } from './new-wig-length-dialog.component';

describe('NewWigLengthDialogComponent', () => {
  let component: NewWigLengthDialogComponent;
  let fixture: ComponentFixture<NewWigLengthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWigLengthDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWigLengthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
