import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureDraggableComponentComponent } from './signature-draggable-component.component';

describe('SignatureDraggableComponentComponent', () => {
  let component: SignatureDraggableComponentComponent;
  let fixture: ComponentFixture<SignatureDraggableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureDraggableComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureDraggableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
