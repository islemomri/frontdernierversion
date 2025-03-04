import { Component, OnInit } from '@angular/core';
import { TypeDiplomeService } from '../../diplome/service/type-diplome.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-archive-liste-typediplome',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, ToastModule, ReactiveFormsModule, FormsModule, InputTextModule],
  templateUrl: './archive-liste-typediplome.component.html',
  styleUrl: './archive-liste-typediplome.component.css'
})
export class ArchiveListeTypediplomeComponent implements OnInit {
  typeDiplomes: any[] = [];
  selectedTypeDiplome: any | null = null;
  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  typeDiplomeForm!: FormGroup;
  editTypeDiplomeForm!: FormGroup;

  ngOnInit(): void {
    this.getTypeDiplomes(); 
    this.initializeForms();  // Initialize the form group
  }

  constructor(private typeDiplomeService: TypeDiplomeService) {}

  getTypeDiplomes(): void {
    this.typeDiplomeService.getAllTypeDiplomeArchives().subscribe(
      (data) => {
        this.typeDiplomes = data;
      },
      (err) => {
        // Handle error here if needed
      }
    );
  }

  deleteTypeDiplome(id: number): void {
    this.typeDiplomeService.desarchiverTypeDiplome(id).subscribe(() => {
      console.log('Type de diplôme desarchiver avec succès');
      this.getTypeDiplomes();
    });
  }

  showEditDialog(typeDiplome: any): void {
    this.selectedTypeDiplome = { ...typeDiplome };
    this.editTypeDiplomeForm.patchValue(this.selectedTypeDiplome);
    this.visibleEdit = true;
  }

  updateTypeDiplome(): void {
    if (!this.selectedTypeDiplome) return;

    const updatedTypeDiplome = this.editTypeDiplomeForm.value;
    this.typeDiplomeService.updateTypeDiplome(this.selectedTypeDiplome.id, updatedTypeDiplome).subscribe(() => {
      console.log('Type de diplôme mis à jour avec succès');
      
      this.visibleEdit = false;
    });
  }

  // Initialize forms here
  private initializeForms(): void {
    this.editTypeDiplomeForm = new FormGroup({
      libelleTypeDiplome: new FormControl('')  // Make sure to initialize the form controls
    });
  }
}
