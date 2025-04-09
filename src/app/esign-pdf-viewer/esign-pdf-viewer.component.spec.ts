import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignPdfViewerComponent } from './esign-pdf-viewer.component';

describe('EsignPdfViewerComponent', () => {
  let component: EsignPdfViewerComponent;
  let fixture: ComponentFixture<EsignPdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsignPdfViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsignPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
