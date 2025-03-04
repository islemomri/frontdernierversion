import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TypeDiplome } from '../model/type-diplome';
import { TypeDiplomeService } from '../service/type-diplome.service';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Toast, ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-type-diplome',
  imports: [CommonModule,DialogModule,ButtonModule ,TableModule,ToastModule,ReactiveFormsModule,FormsModule, InputTextModule],
  templateUrl: './type-diplome.component.html',
  styleUrl: './type-diplome.component.css',
  providers: [MessageService]
})
export class TypeDiplomeComponent implements OnInit {
  typeDiplomes: any[] = [];
  selectedTypeDiplome: any | null = null;
  visibleAdd: boolean = false;
  visibleEdit: boolean = false;
  typeDiplomeForm: FormGroup;
  editTypeDiplomeForm: FormGroup;

  constructor(
    private typeDiplomeService: TypeDiplomeService,
    private messageService: MessageService
  ) {
    this.typeDiplomeForm = new FormGroup({
      libelleTypeDiplome: new FormControl('', Validators.required),
    });

    this.editTypeDiplomeForm = new FormGroup({
      libelleTypeDiplome: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getTypeDiplomes();
  }

  getTypeDiplomes(): void {
    this.typeDiplomeService.getAllTypeDiplomeNonArchives().subscribe(
      (data) => {
        this.typeDiplomes = data;
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de chargement des types de diplômes' });
      }
    );
  }

  showAddDialog(): void {
    this.visibleAdd = true;
  }

  addTypeDiplome(): void {
    if (this.typeDiplomeForm.invalid) {
      console.log('Le libellé est requis');
      return;
    }

    const newTypeDiplome = this.typeDiplomeForm.value;

    this.typeDiplomeService.addTypeDiplome(newTypeDiplome).subscribe(() => {
      console.log('Type de diplôme ajouté avec succès');
      this.getTypeDiplomes();
      this.typeDiplomeForm.reset();
      this.visibleAdd = false; // Ferme la boîte de dialogue après l'ajout
    });
  }
  archiver(id: number): void {
    this.typeDiplomeService.archiverTypeDiplome(id).subscribe(
      (response) => {
        console.log('TypeDiplome archivé:', response);
      },
      (error) => {
        console.error('Erreur lors de l\'archivage:', error);
      }
    );
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
      this.getTypeDiplomes();
      this.visibleEdit = false;
    });
  }
}