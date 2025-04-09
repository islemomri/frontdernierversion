import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.css']
})
export class SignaturePadComponent implements AfterViewInit {
  @ViewChild('signaturePad', { static: true }) signaturePadElement!: ElementRef;
  @Output() signatureSaved = new EventEmitter<string>();

  private signaturePad!: SignaturePad;

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  clear() {
    this.signaturePad.clear();
  }

  save() {
    if (this.signaturePad.isEmpty()) {
      console.warn("La signature est vide !");
      return;
    }
    const signatureData = this.signaturePad.toDataURL(); // Convertir en base64
    this.signatureSaved.emit(signatureData);
  }
}