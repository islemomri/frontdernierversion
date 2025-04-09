import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-esign-pdf-viewer',
  imports: [],
  templateUrl: './esign-pdf-viewer.component.html',
  styleUrl: './esign-pdf-viewer.component.css'
})
export class EsignPdfViewerComponent  implements OnInit{
  @Input() pdfUrl: SafeUrl | null = null;
  @ViewChild('pdfCanvas') pdfCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;

  pdfDoc: any = null;
  pageNum: number = 1;
  scale: number = 1.5;
  signaturePad: SignaturePad | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.pdfUrl) {
      this.loadPdf(this.pdfUrl);
    }
  }

  async loadPdf(pdfUrl: SafeUrl) {
    const url = this.sanitizer.sanitize(4, pdfUrl);
    if (!url) {
      console.error('URL invalide.');
      return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    const loadingTask = pdfjsLib.getDocument(url);
    this.pdfDoc = await loadingTask.promise;
    this.renderPage(this.pageNum);
  }

  async renderPage(num: number) {
    const page = await this.pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: this.scale });
    const canvas = this.pdfCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement);
  }

  clearSignature(): void {
    this.signaturePad?.clear();
  }

  async saveSignedPdf(): Promise<Blob> {
    const signatureDataUrl = this.signaturePad?.toDataURL();
    if (!signatureDataUrl) {
      throw new Error('Aucune signature trouvée.');
    }
  
    const img = new Image();
    img.src = signatureDataUrl;
    await new Promise((resolve) => (img.onload = resolve));
  
    const canvas = this.pdfCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 50, 50, 100, 50); // Position de la signature
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob); // Résoudre la promesse avec le Blob
        } else {
          reject(new Error('Impossible de créer un Blob à partir du canvas.')); // Rejeter la promesse en cas d'erreur
        }
      }, 'application/pdf');
    });
  }
}
