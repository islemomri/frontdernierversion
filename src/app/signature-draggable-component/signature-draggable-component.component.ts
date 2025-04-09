import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-signature-draggable',
  templateUrl: './signature-draggable.component.html',
  styleUrls: ['./signature-draggable.component.css']
})
export class SignatureDraggableComponent {
  @Input() signatureDataUrl: string = ''; // URL de la signature (base64)
  @Output() positionChanged = new EventEmitter<{ x: number, y: number }>(); // Émet les nouvelles coordonnées

  isDragging = false; // Indique si la signature est en train d'être déplacée
  offset = { x: 0, y: 0 }; // Décalage entre le curseur et la position de la signature
  signaturePosition = { x: 0, y: 0 }; // Position actuelle de la signature

  // Détecte le début du déplacement
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offset.x = event.clientX - this.signaturePosition.x;
    this.offset.y = event.clientY - this.signaturePosition.y;
  }

  // Détecte le mouvement de la souris pendant le déplacement
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    // Calcule la nouvelle position de la signature
    this.signaturePosition.x = event.clientX - this.offset.x;
    this.signaturePosition.y = event.clientY - this.offset.y;

    // Émet les nouvelles coordonnées
    this.positionChanged.emit(this.signaturePosition);
  }

  // Détecte la fin du déplacement
  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }
}