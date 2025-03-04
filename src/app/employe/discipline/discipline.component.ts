import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DisciplineService } from '../service/discipline.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Discipline } from '../model/Discipline';

@Component({
  selector: 'app-discipline',
  imports: [CommonModule,FormsModule, ReactiveFormsModule, DialogModule, ButtonModule, CommonModule, FormsModule,  DialogModule, ButtonModule],
  templateUrl: './discipline.component.html',
  styleUrl: './discipline.component.css'
})
export class DisciplineComponent implements OnInit{
  @Input() employeId!: number;
  @Input() disciplines: Discipline[] = [];
  @Output() disciplineUpdated = new EventEmitter<void>();

  constructor(private disciplineService: DisciplineService) {}
  ngOnInit(): void {
    if (this.employeId) {
      this.loadDisciplines();
    }
  }
  
  disciplineForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    dateDebut: new FormControl('', Validators.required),
    dateFin: new FormControl('', Validators.required)
  });

  editDisciplineForm = new FormGroup({
    nom: new FormControl('', Validators.required),
    dateDebut: new FormControl('', Validators.required),
    dateFin: new FormControl('', Validators.required)
  });
  addDisciplineVisible = false; // Nouvelle propriété pour la boîte de dialogue d'ajout
  editDisciplineVisible = false;
  visible = false; 
  selectedDiscipline: Discipline | null = null; 
  showAddDisciplineDialog() {
    this.addDisciplineVisible = true; // Affiche la boîte de dialogue
    this.disciplineForm.reset(); // Réinitialise le formulaire
  }

  // Méthode pour afficher la boîte de dialogue de modification de discipline
  showEditDisciplineDialog(discipline: Discipline) {
    this.selectedDiscipline = discipline;
    this.editDisciplineForm.patchValue(this.selectedDiscipline);
    this.editDisciplineVisible = true;
  }
 

  updateDiscipline() {
    if (!this.selectedDiscipline || this.editDisciplineForm.invalid) {
      return;
    }

    const updatedDiscipline: Discipline = {
      id: this.selectedDiscipline.id,
      nom: this.editDisciplineForm.value.nom!,
      dateDebut: this.editDisciplineForm.value.dateDebut!,
      dateFin: this.editDisciplineForm.value.dateFin!
    };

    this.disciplineService.updateDiscipline(updatedDiscipline.id!, updatedDiscipline).subscribe(
      response => {
        console.log('Discipline mise à jour avec succès:', response);
        const index = this.disciplines.findIndex(d => d.id === updatedDiscipline.id);
        if (index !== -1) {
          this.disciplines[index] = response;
        }
        this.visible = false;
        this.disciplineUpdated.emit();
      },
      error => {
        console.error('Erreur lors de la mise à jour de la discipline:', error);
      }
    );
  }

  addDiscipline() {
    if (this.disciplineForm.invalid) {
      console.log("Tous les champs de la discipline sont requis !");
      return;
    }
  
    // Convertir l'objet Partial<Discipline> en Discipline
    const newDiscipline: Discipline = {
      nom: this.disciplineForm.value.nom!, // Utilisation de l'opérateur "!" pour indiquer que la valeur n'est pas null
      dateDebut: this.disciplineForm.value.dateDebut!,
      dateFin: this.disciplineForm.value.dateFin!
    };
  
    this.disciplineService.addDisciplineToEmploye(this.employeId, newDiscipline).subscribe(
      response => {
        console.log('Discipline ajoutée avec succès:', response);
        this.disciplines.push(response);
        this.disciplineForm.reset();
        this.disciplineUpdated.emit();
      },
      error => {
        console.error('Erreur lors de l\'ajout de la discipline:', error);
      }
    );
  }

  deleteDiscipline(disciplineId: number) {
    this.disciplineService.removeDisciplineFromEmploye(this.employeId, disciplineId).subscribe(
      () => {
        this.disciplines = this.disciplines.filter((d: Discipline) => d.id !== disciplineId); // Définir le type de 'd'
        console.log('Discipline supprimée avec succès');
        this.disciplineUpdated.emit();
      },
      error => {
        console.error('Erreur lors de la suppression de la discipline:', error);
      }
    );
  }

  loadDisciplines() {
    this.disciplineService.getDisciplinesByEmployeId(this.employeId).subscribe(
      data => {
        this.disciplines = data;
      },
      error => {
        console.error('Erreur lors du chargement des disciplines:', error);
      }
    );
  }

}