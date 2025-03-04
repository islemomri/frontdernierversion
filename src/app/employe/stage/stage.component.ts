import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StageService } from '../service/stage.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage',
  imports: [ButtonModule, FormsModule, DialogModule,ReactiveFormsModule, CommonModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.css'
})
export class StageComponent implements OnInit{
  

  @Input() employeId!: number;
  @Output() stageUpdated = new EventEmitter<void>();
  stages: any[] = [];
  visible: boolean = false; 
  selectedStage: any = null; 
  addStageVisible: boolean = false;
  editStageVisible: boolean = false;
  stageForm = new FormGroup({
    societe: new FormControl('', Validators.required),
    dateDebut: new FormControl('', Validators.required),
    dateFin: new FormControl('', Validators.required)
  });

  editStageForm = new FormGroup({
    societe: new FormControl('', Validators.required),
    dateDebut: new FormControl('', Validators.required),
    dateFin: new FormControl('', Validators.required)
  });

  constructor(private stageService: StageService) {}

  ngOnInit(): void {
    if (this.employeId) {
      this.getStages();
    }
  }
  showAddStageDialog() {
    this.addStageVisible = true;  // Ouvre la boîte de dialogue pour ajouter un stage
  }

  showEditStageDialog(stage: any) {
    this.selectedStage = { ...stage };  // Copie du stage sélectionné
    this.editStageForm.patchValue(this.selectedStage);  // Charge les données dans le formulaire de modification
    this.editStageVisible = true;  // Ouvre la boîte de dialogue pour modifier un stage
  }
  getStages() {
    this.stageService.getStagesByEmployeId(this.employeId).subscribe(data => {
      this.stages = data;
    });
  }

  addStage() {
    if (this.stageForm.invalid) {
      console.log("Tous les champs du stage sont requis !");
      return;
    }
  
    const newStage = this.stageForm.value;
  
    if (newStage.dateDebut! >= newStage.dateFin!) {
      console.log("La date de fin doit être postérieure à la date de début !");
      return;
    }
  
    this.stageService.addStageToEmploye(this.employeId, newStage).subscribe(() => {
      console.log('Stage ajouté avec succès');
      this.getStages();
      this.stageForm.reset();
      this.stageForm.markAsUntouched();  // Permet de remettre les champs à l’état initial
      this.stageUpdated.emit();
    });
  }
  

  deleteStage(stageId: number) {
    this.stageService.removeStageFromEmploye(this.employeId, stageId).subscribe(() => {
      console.log('Stage supprimé avec succès');
      this.getStages();
      this.stageUpdated.emit();
    });
  }

  showDialog(stage: any) {
    this.selectedStage = { ...stage }; // Copie du stage sélectionné
    this.editStageForm.patchValue(this.selectedStage);
    this.visible = true;
  }

  updateStage() {
    if (!this.selectedStage) return;
    
    const updatedStage = this.editStageForm.value;
    this.stageService.updateStage(this.selectedStage.id, updatedStage).subscribe(() => {
      console.log('Stage mis à jour avec succès');
      this.getStages();
      this.visible = false;
    });
  }
}