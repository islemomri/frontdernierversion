import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Diplome } from '../model/diplome';
import { TypeDiplome } from '../model/type-diplome';
import { TypeDiplomeService } from '../service/type-diplome.service';
import { DiplomeService } from '../service/diplome.service';
import { DiplomeRequest } from '../model/diplome-request';

@Component({
  selector: 'app-list-diplome',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, 
    InputTextModule, DropdownModule, PaginatorModule,ReactiveFormsModule, ToastModule, ConfirmDialogModule
  ],
  templateUrl: './list-diplome.component.html',
  styleUrl: './list-diplome.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ListDiplomeComponent implements OnInit {
  @Input() employeId!: number;

  diplomes: Diplome[] = [];
  typeDiplomes: TypeDiplome[] = [];
  diplomeForm!: FormGroup;
  isEditing = false;
  diplomeToEdit: Diplome | null = null;

  constructor(private diplomeService: DiplomeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDiplomes();
    this.loadTypeDiplomes();
  }

  initForm() {
    this.diplomeForm = this.fb.group({
      libelle: ['', Validators.required],
      typeDiplomeId: [null, Validators.required], 
    });
  }
  loadDiplomes() {
    this.diplomeService.getDiplomesByEmploye(this.employeId).subscribe((data) => {
      console.log("Diplômes récupérés :", data);
      this.diplomes = data;
    });
  }
  
  

  loadTypeDiplomes() {
    this.diplomeService.getTypeDiplomes().subscribe((data) => {
      this.typeDiplomes = data;
      console.log("Types de diplômes récupérés :", this.typeDiplomes);
    });
  }
  

  addOrUpdateDiplome() {
    if (!this.diplomeForm.valid) {
      console.error('Formulaire invalide');
      return;
    }
  
    const { libelle, typeDiplomeId } = this.diplomeForm.value;
  
    // Conversion de typeDiplomeId en nombre
    const typeDiplomeIdNumber = Number(typeDiplomeId);
    console.log("Données envoyées :", { libelle, typeDiplomeIdNumber });
  
    // Vérifie si l'ID du typeDiplome correspond bien à un élément existant
    const typeDiplome = this.typeDiplomes.find(t => t.id === typeDiplomeIdNumber);
  
    if (!typeDiplome) {
      console.error("Type de diplôme non trouvé", typeDiplomeIdNumber, this.typeDiplomes);
      return;
    }
  
    if (this.isEditing && this.diplomeToEdit && this.diplomeToEdit.id) {
      this.diplomeService.updateDiplome(this.diplomeToEdit.id, libelle, typeDiplomeIdNumber)
        .subscribe({
          next: () => {
            this.loadDiplomes();
            this.resetForm();
          },
          error: (err) => console.error('Erreur lors de la mise à jour du diplôme:', err)
        });
    } else {
      this.diplomeService.addDiplome(this.employeId, libelle, typeDiplomeIdNumber)
        .subscribe({
          next: () => {
            this.loadDiplomes();
            this.resetForm();
          },
          error: (err) => console.error('Erreur lors de l\'ajout du diplôme:', err)
        });
    }
  }
  
  

  editDiplome(diplome: Diplome) {
    this.diplomeToEdit = diplome;
    this.isEditing = true;
    this.diplomeForm.patchValue({
      libelle: diplome.libelle,
      typeDiplomeId: diplome.typeDiplome?.id,
    });
  }

  deleteDiplome(id: number) {
    this.diplomeService.deleteDiplome(id).subscribe(() => {
      this.loadDiplomes();
    });
  }

  resetForm() {
    this.isEditing = false;
    this.diplomeToEdit = null;
    this.diplomeForm.reset();
  }
}
