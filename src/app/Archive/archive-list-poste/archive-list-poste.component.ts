import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Poste } from '../../poste/model/poste';
import { PosteService } from '../../poste/service/poste.service';

@Component({
  selector: 'app-archive-list-poste',
  imports: [  CommonModule,
      TableModule,
      ButtonModule,
      InputTextModule,
      FormsModule,
      DialogModule],
  templateUrl: './archive-list-poste.component.html',
  styleUrl: './archive-list-poste.component.css'
})
export class ArchiveListPosteComponent implements OnInit {
   postes: Poste[] = [];
    selectedPostes: Poste[] = [];
    searchText: string = '';
    visibleUpdateDialog: boolean = false;
    selectedPoste: Poste = new Poste();
    visible: boolean = false;
  
  
    constructor(private posteService: PosteService) {}
  
    ngOnInit(): void {
      this.loadPostes();
    }
    openEditDialog(poste: Poste): void {
      this.selectedPoste = { ...poste }; // Clonage pour éviter la modification directe dans la liste
      this.visibleUpdateDialog = true; // Affichage du dialogue d'édition
    }
    
  
    loadPostes(): void {
      this.posteService.getAllPostesArchives().subscribe((data: Poste[]) => {
        this.postes = data;
      });
    }
  
    deletePoste(poste: Poste): void {
      if (confirm(`Voulez-vous vraiment supprimer le poste "${poste.titre}" ?`)) {
        this.posteService.desarchiverPoste(poste.id!).subscribe(() => {
          this.postes = this.postes.filter(p => p.id !== poste.id);
        });
      }
    }
  
    exportPostes(): void {
      console.log('Exporting postes...');
    }
  
    editPoste(poste: Poste): void {
      this.selectedPoste = { ...poste };
      this.visibleUpdateDialog = true;
    }
  
    updatePoste(): void {
      if (!this.selectedPoste.id) {
        console.error("L'ID du poste est manquant !");
        return;
      }
      
      this.posteService.updatePoste(this.selectedPoste.id, this.selectedPoste).subscribe(() => {
        const index = this.postes.findIndex(p => p.id === this.selectedPoste.id);
        if (index !== -1) {
          this.postes[index] = { ...this.selectedPoste };
        }
        this.visibleUpdateDialog = false;
      }, (error: any) => {
        console.error('Erreur lors de la mise à jour du poste', error);
      });
    }

}
