import { Component, OnInit } from '@angular/core';
import { FormationDto } from './model/FormationDto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeFormation } from './model/type-formation.model';
import { SousTypeFormation } from './model/SousTypeFormation.model';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';  // Importer ReactiveFormsModule
import { EmoloyeService } from '../employe/service/emoloye.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Utilisateur } from '../utilisateur/model/utilisateur';
import { UtilisateurService } from '../utilisateur/service/utilisateur.service';
import { CommonModule } from '@angular/common';
import { FormationService } from './service/formation.service';
import { TableModule } from 'primeng/table';  // Import de la table PrimeNG
import { CardModule } from 'primeng/card';    // Import de la Card PrimeNG
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-formation',
  imports: [CalendarModule,
    DropdownModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule, ReactiveFormsModule,
    CommonModule,TableModule,CardModule,TagModule

  ],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.css'
})
export class FormationComponent implements OnInit{
  employes: any[] = [];  // Liste des employés
  cities: any[] = [];  // Liste des employés pour le multiselect
  formationForm: FormGroup;
  dialogVisible: boolean = false; 
  responsables: Utilisateur[] = [];
  selectedResponsableType: string = '';
  typeFormations = Object.values(TypeFormation); // ['INTERNE', 'EXTERNE']
  sousTypeFormations = Object.values(SousTypeFormation); // ['INTEGRATION', 'POLYVALENCE', ...]
  loading: boolean = false;
  formations: FormationDto[] = [];
  selectedFormation: any;
  displayDialog: boolean = false;
  globalFilter: string = '';
 
  constructor(private fb: FormBuilder,private employeService: EmoloyeService,private utilisateurService: UtilisateurService,private formationservice : FormationService) {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      typeFormation: [null, Validators.required],
      sousTypeFormation: [null, Validators.required],
      dateDebutPrevue: [null, Validators.required],
      dateFinPrevue: [null, Validators.required],
      responsableEvaluationId: [null],
      responsableEvaluationExterne: [''],
      employeIds: [[]] // Liste des employés (tableau de nombres)
    });
  }

  ngOnInit(): void {
    const rhId = localStorage.getItem('RHID'); // Récupérer l'ID de l'utilisateur connecté
  
  if (!rhId) {
    console.error("Impossible de récupérer l'ID du RH !");
    return;
  }else{
    this.loading = true;
      this.formationservice.getFormationsParRH(Number(rhId)).subscribe(
        (data) => {
          console.log("hiiiiii",data );
          this.formations = data;
          this.loading = false;
          
        },
        (error) => {
          console.error('Erreur lors de la récupération des formations', error);
          this.loading = false;
        }
      );
    
  }

  console.log("RH ID récupéré:", rhId);



  this.formationForm = this.fb.group({
    titre: ['', Validators.required],
    description: ['', Validators.required],
    typeFormation: [null, Validators.required],
    sousTypeFormation: [null, Validators.required],
    dateDebutPrevue: [null, Validators.required],
    dateFinPrevue: [null, Validators.required],
    responsableEvaluationId: [null],
    responsableEvaluationExterne: [''],
    employeIds: [[]], // Liste des employés
    selectedCities: []  // Ajout du contrôle pour le multiselect
  });
   

  this.utilisateurService.getResponsables().subscribe(
    (data) => {
      console.log(data); 
      this.responsables = data;
    },
    (error) => {
      console.error('Erreur lors de la récupération des responsables', error);
    }
  );


  // Récupérer la liste des employés
  this.employeService.getEmployesWithDirectionAndSite().subscribe((data) => {
    this.employes = data;
    this.cities = this.employes.map((employe) => ({
      name: `${employe.nom} ${employe.prenom}`,  // Nom complet
      matricule: employe.matricule,  // Matricule de l'employé
      code: employe.id  // ID de l'employé (qui peut être utilisé pour l'identification)
    }));
    
  });


  }
  showParticipants(formation: FormationDto) {
    if (formation && formation.employes) {
      this.selectedFormation = formation;
      this.displayDialog = true;
    } else {
      console.error('Aucun employé trouvé pour cette formation');
    }
  }
  

  // Fermer le dialogue
  hideDialog() {
    this.displayDialog = false;
  }

  onResponsableTypeChange(value: string) {
    this.selectedResponsableType = value;
  }

 




  // Ouvrir la boîte de dialogue
  openDialog() {
    this.dialogVisible = true;
  }

  // Fermer la boîte de dialogue
  closeDialog() {
    this.dialogVisible = false;
  }

  // Soumission du formulaire
  submitFormation() {
    if (this.formationForm.valid) {
      const formationData: FormationDto = this.formationForm.value;
      const rhId = localStorage.getItem('RHID'); // Récupérer l'ID du RH

      if (rhId) {
        formationData.employeIds = this.formationForm.get('selectedCities')?.value.map((id: number) => id);
        // Appeler la méthode du service pour envoyer les données au backend
        this.formationservice.creerFormation(Number(rhId), formationData).subscribe(
          (response) => {
            console.log('Formation créée avec succès:', response);
            this.dialogVisible = false; // Fermer la boîte de dialogue
          },
          (error) => {
            console.error('Erreur lors de la création de la formation:', error);
          }
        );
      } else {
        console.error('ID RH non trouvé');
      }
    } else {
      console.log('Formulaire invalide');
    }
  }
  
 // Fonction pour afficher nom et matricule
 customFilter(event: any, option: any): boolean {
  const searchValue = event.query.toLowerCase();
  const name = option.name.toLowerCase();
  const matricule = option.matricule.toString().toLowerCase();

  // Rechercher dans le nom et le matricule
  return name.includes(searchValue) || matricule.includes(searchValue);
}
getFormationStatus(dateFinPrevue: Date): string {
  const currentDate = new Date();
  
  // Si la date de fin est dans le futur, afficher "En cours"
  if (new Date(dateFinPrevue) > currentDate) {
    return 'En cours';  // premier tag
  } else {
    return 'Terminé'; // deuxième tag
  }
}

getStatusSeverity(dateFinPrevue: Date): 'success' | 'info' {
  const currentDate = new Date();

  // Si la date de fin est dans le futur, retourner 'info'
  if (new Date(dateFinPrevue) > currentDate) {
    return 'info'; // bleu clair (en cours)
  } else {
    return 'success'; // vert (terminé)
  }
}


}
