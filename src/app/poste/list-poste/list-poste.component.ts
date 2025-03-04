import { Component, OnInit } from '@angular/core';
import { Poste } from '../model/poste';
import { PosteService } from '../service/poste.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DirectionService } from '../../direction/service/direction.service';
import { Direction } from '../../direction/model/Direction';
import { MultiSelectModule } from 'primeng/multiselect';
import { PosteDTO } from '../model/PosteDTO';

@Component({
  selector: 'app-list-poste',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DialogModule,MultiSelectModule
  ],
  templateUrl: './list-poste.component.html',
  styleUrl: './list-poste.component.css'
})
export class ListPosteComponent implements OnInit {

  postes: Poste[] = [];
  selectedPostes: Poste[] = [];
  searchText: string = '';
  visibleUpdateDialog: boolean = false;
  selectedPoste: Poste = new Poste();
  visible: boolean = false;
  visibleAddDialog: boolean = false;
  directions: Direction[] = [];
  selectedDirectionIds: number[] = []; // Stocke uniquement les ID des directions sélectionnées

  newPoste: any = {};  // Nouveau poste à ajouter

 
  // Méthode pour ouvrir le dialogue de modification
  

  constructor(private posteService: PosteService,private directionservice: DirectionService) {}


  ngOnInit(): void {
    this.loadPostes();
    this.getDirections();
  }

  ajouterPoste() {
    console.log("📌 Directions sélectionnées (IDs) :", this.selectedDirectionIds);
  
    const posteDTO: PosteDTO = new PosteDTO(
      this.newPoste.titre,
      this.newPoste.niveauExperience,
      this.newPoste.diplomeRequis,
      this.newPoste.competencesRequises,
      this.selectedDirectionIds // On envoie uniquement les ID
    );
  
    console.log("📌 Données envoyées à l'API :", posteDTO);
  
    this.posteService.ajouterPoste(posteDTO).subscribe(
      response => {
        console.log("✅ Poste ajouté avec succès :", response);
        this.visibleAddDialog = false;
        this.loadPostes(); // Rafraîchir la liste après l'ajout
      },
      error => {
        console.error("❌ Erreur lors de l'ajout :", error);
      }
    );
  }
  
  


  getDirections(): void {
    this.directionservice.getAllDirections().subscribe(
      (data) => {
        this.directions = data;
        console.log('Directions archivées récupérées avec succès', data);
      },
      (error) => {
        console.error('Erreur lors de la récupération des directions archivées', error);
      }
    );
  }
  openAddDialog() {
    this.newPoste = {};  // Réinitialise le nouveau poste
    this.visibleAddDialog = true;
}

  openEditDialog(poste: Poste): void {
    
    this.selectedPoste = { ...poste }; 
    this.posteService.getDirectionsByPosteId(poste.id!).subscribe(
      (data) => {
        this.selectedDirectionIds = data.map((direction: any) => direction.id); // Récupère uniquement les IDs
        this.visibleUpdateDialog = true; // Afficher la boîte de dialogue
      },
      (error) => {
        console.error('Erreur lors de la récupération des directions du poste', error);
      }
    );
  }



   
  
  
  

  loadPostes(): void {
    this.posteService.getAllPostesnonArchives().subscribe((data) => {
      this.postes = data;
    });
  }

  deletePoste(poste: Poste): void {
    if (confirm(`Voulez-vous vraiment supprimer le poste "${poste.titre}" ?`)) {
      this.posteService.archiverPoste(poste.id!).subscribe(() => {
        this.postes = this.postes.filter(p => p.id !== poste.id);
      });
    }
  }

  exportPostes(): void {
    if (this.selectedPostes.length > 0) {
      const csvData = this.convertToCSV(this.selectedPostes); 
      this.downloadCSV(csvData);
    } else {
      const csvData = this.convertToCSV(this.postes); 
      this.downloadCSV(csvData);
    }
  }
  
  
  convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
  
    const headers = Object.keys(data[0]); 
    const rows = data.map(row => headers.map(header => row[header]).join(','));
  
    return [headers.join(','), ...rows].join('\n');
  }
  
  downloadCSV(csvData: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Postes.csv';
    link.click();
  }

  editPoste(poste: Poste): void {
    this.selectedPoste = { ...poste };
    this.visibleUpdateDialog = true;
  }

  updatePoste(): void {
    if (!this.selectedPoste.id) {
      console.error("❌ Erreur : l'ID du poste sélectionné est manquant !");
      return;
    }
  
    const updatedPoste: PosteDTO = new PosteDTO(
      this.selectedPoste.titre,
      this.selectedPoste.niveauExperience,
      this.selectedPoste.diplomeRequis,
      this.selectedPoste.competencesRequises,
      this.selectedDirectionIds // Envoi des directions sélectionnées
    );
  
    this.posteService.updatePostee(this.selectedPoste.id, updatedPoste).subscribe(
      (response) => {
        console.log("✅ Poste mis à jour avec succès :", response);
  
        // Met à jour la liste des postes sans recharger toute la page
        this.postes = this.postes.map(p =>
          p.id === this.selectedPoste.id ? { ...p, ...updatedPoste, id: p.id } : p
        );
  
        this.visibleUpdateDialog = false; // Ferme la boîte de dialogue après la mise à jour
      },
      (error) => {
        console.error("❌ Erreur lors de la mise à jour :", error);
      }
    );
  }
  
  
  
  
}
