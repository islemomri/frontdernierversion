import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Site } from '../model/site';
import { SiteService } from '../service/site.service';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { DialogModule } from 'primeng/dialog';
import { DirectionService } from '../../direction/service/direction.service';
import { Direction } from '../../direction/model/Direction';
import { PickListModule } from 'primeng/picklist';
import { MultiSelectModule } from 'primeng/multiselect';

import { Poste } from '../../poste/model/poste';


@Component({
  selector: 'app-list-site',
  imports: [
    TableModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    SpeedDialModule,
    PickListModule,
    MultiSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './list-site.component.html',
  styleUrl: './list-site.component.css'
})
export class ListSiteComponent implements OnInit {
  sites: Site[] = [];
  selectedSites: Site[] = [];
  visible: boolean = false;
  showDialog: boolean = false;  
  selectedSite: Site = { id: 0, nom_site: '', archive: false };
  directions: Direction[] = [];
  newSite: Site = { id: 0, nom_site: '' , archive: false};  
  selectedDirections: Direction[] = [];
  postes: Poste[] = [];
  selectedPostes: Poste[] = [];

  @ViewChild('dt') dt!: Table;
  mapHeight: string = '300px'; // Valeur initiale de la carte

  constructor(private siteService: SiteService, private directionservice: DirectionService) {}

  ngOnInit(): void {
    this.getSites();
    
  }
  onDirectionsListShow() {
    this.mapHeight = '500px'; // Augmenter la taille de la carte lorsque la liste des directions est ouverte
  }

  // Fonction appelée lorsque la liste des directions est fermée
  onDirectionsListHide() {
    this.mapHeight = '300px'; // Rétablir la taille initiale de la carte lorsque la liste des directions est fermée
  }

 


  openEditDialog(site: Site): void {
    this.selectedSite = { ...site };  // Cloner l'objet pour éviter les modifications directes
    this.visible = true;
  
    // Vérifier si selectedSite.id est un nombre valide
    const siteId = this.selectedSite.id;
  
    
       
  }
  
  
  



  getSites(): void {
    this.siteService.getAllSites().subscribe((data: Site[]) => {
      this.sites = data;
      console.log('Sites chargés:', this.sites);
    });
  }

  getItems(site: Site): MenuItem[] {
    return [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteSite(site) // Passer l'objet complet
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.openEditDialog(site)
      }
    ];
  }


 deleteSite(site: Site): void {
   if (site.id === undefined) {
     console.error("Impossible de archiver : l'ID du site est indéfini.");
     return;
   }
 
   if (confirm(`Voulez-vous vraiment archiver la direction ${site.nom_site} ?`)) {
     // Appel du service pour archiver la direction
     this.siteService.archiverSite(site.id).subscribe({
       next: (response) => {
         // Une fois archivée, mettez à jour localement la direction
         site.archive = true;
         console.log('Direction archivée avec succès', response);
       },
       error: (err) => {
         console.error('Erreur lors de l\'archivage de la direction', err);
       }
     });
   }
 }

 // Méthode pour archiver un site
// Méthode pour archiver un site
archiveSite(site: Site): void {
  if (site.id !== undefined) {
    if (confirm(`Voulez-vous vraiment archiver le site ${site.nom_site} ?`)) {
      this.siteService.archiverSite(site.id).subscribe({
        next: (response) => {
          site.archive = true;
          console.log('Site archivé avec succès', response);
        },
        error: (err) => {
          console.error('Erreur lors de l\'archivage du site', err);
        }
      });
    }
  } else {
    console.error('L\'ID du site est indéfini');
  }
}


// Méthode pour éditer un site
editSite(site: Site): void {
  this.openEditDialog(site);
}


  // Afficher la boîte de dialogue pour ajouter un site
  showAddSiteDialog(): void {
    this.showDialog = true; // Ouvrir la boîte de dialogue d'ajout
    this.newSite = { id: 0, nom_site: '', archive: false }; // Réinitialiser le modèle
    this.selectedDirections = [];
  }
 /* updateSite(): void {
    if (!this.selectedSite || this.selectedSite.id === undefined) {
      console.error("Impossible de mettre à jour : l'ID du site est indéfini.");
      return;
    }
  
    // Créer un objet SiteRequest avec les données nécessaires
    const updatedSiteRequest: SiteRequest = {
      nom_site: this.selectedSite.nom_site,
      // Filtrer les éléments undefined dans selectedDirections avant de récupérer les ids
      directionIds: this.selectedDirections
        .map(direction => direction.id)  // Extraire les IDs
        .filter((id): id is number => id !== undefined),  // Filtrer uniquement les IDs définis
      postesIds: this.selectedPostes
        .map(poste => poste.id)  // Extraire les IDs des postes
        .filter(id => id !== undefined)  // Filtrer les IDs définis
    };
  
    this.siteService.updateSite(this.selectedSite.id, updatedSiteRequest).subscribe({
      next: updatedSite => {
        const index = this.sites.findIndex(s => s.id === updatedSite.id);
        if (index !== -1) {
          this.sites[index] = updatedSite; // Met à jour le site dans la liste
        }
        console.log('Mise à jour réussie:', updatedSite);
        this.visible = false; // Ferme le dialogue après la mise à jour
      },
      error: err => console.error('Erreur lors de la mise à jour du site:', err)
    });
  }*/
  

  

 
  addSite(): void {
    if (this.newSite.nom_site.trim() !== '') {
      // Créer l'objet site avec uniquement les IDs des directions et des postes sélectionnés
      const siteSansId = { 
        nom_site: this.newSite.nom_site, 
        archive: false,
        directionIds: this.selectedDirections.map(direction => direction.id), // Extraire uniquement les IDs des directions
        postesIds: this.selectedPostes.map(poste => poste.id) // Extraire uniquement les IDs des postes
      };
  
      // Affichage de l'objet site dans la console avant l'envoi au backend
      console.log('Objet site envoyé au backend (avec les IDs des directions et postes seulement):', siteSansId);
  
      // Appel du service pour ajouter le site
      this.siteService.ajouterSite(siteSansId).subscribe({
        next: (siteAjoute) => {
          this.sites.push(siteAjoute); // Ajouter le site à la liste locale
          console.log('Site ajouté avec succès:', siteAjoute);
          this.showDialog = false; // Fermer la boîte de dialogue après l'ajout
          this.newSite = { id: 0, nom_site: '', archive: false }; // Réinitialiser le formulaire
          this.selectedDirections = []; // Réinitialiser la sélection des directions
          this.selectedPostes = []; // Réinitialiser la sélection des postes
        },
        error: (err) => console.error('Erreur lors de l\'ajout du site:', err)
      });
    } else {
      alert('Le nom du site ne peut pas être vide.');
    }
  }
  
  
  
  exportSites(): void {
    if (this.selectedSites.length > 0) {
      const csvData = this.convertToCSV(this.selectedSites); // Utiliser les éléments sélectionnés
      this.downloadCSV(csvData);
    } else {
    const csvData = this.convertToCSV(this.sites); // Sites peut être ton tableau de données
    this.downloadCSV(csvData);}
  }
  
  convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]); // Prendre les noms de propriétés des objets
    const rows = data.map(row =>
      headers.map(header => row[header]).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }
  
  downloadCSV(csvData: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sites.csv'; // Nom du fichier exporté
    link.click();
  }
  
  
  
  
  
}
