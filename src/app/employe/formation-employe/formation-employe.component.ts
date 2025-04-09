import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ApiResponse } from '../../formation/model/ApiResponse';
import { FormationService } from '../../formation/service/formation.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';

type Severity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined;
type Size = "large" | "normal" | "xlarge" | undefined;

@Component({
  selector: 'app-formation-employe',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TooltipModule,
    CarouselModule,
    DropdownModule,
    TagModule,
    AvatarModule,
    ChartModule,
    ProgressSpinnerModule,
    FormsModule, 
  ],
  templateUrl: './formation-employe.component.html',
  styleUrls: ['./formation-employe.component.css'],
  providers: [DialogService]
})
export class FormationEmployeComponent implements OnInit {
  @Input() employeId!: number;
  @Output() formationsUpdated = new EventEmitter<void>();
  selectedFormation: ApiResponse | null = null;
displayDetailsDialog: boolean = false;
  formations: ApiResponse[] = [];
  loading = false;
  error: string | null = null;

  // Configuration des statistiques
  stats = [
    { type: 'total', value: 0, label: 'Total formations', icon: 'pi pi-book' },
    { type: 'success', value: 0, label: 'Réussies', icon: 'pi pi-check-circle' },
    { type: 'warning', value: 0, label: 'En cours', icon: 'pi pi-clock' },
    { type: 'danger', value: 0, label: 'Échecs', icon: 'pi pi-times-circle' },
    { type: 'info', value: 0, label: 'En attente', icon: 'pi pi-hourglass' }
  ];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  statusFilters = [
    { label: 'Tous les statuts', value: null },
    { label: 'Réussies', value: 'success' },
    { label: 'Échecs', value: 'failed' },
    { label: 'En cours', value: 'in-progress' },
    { label: 'En attente', value: 'pending' }
  ];

  typeFilters = [
    { label: 'Tous les types', value: null },
    { label: 'Interne', value: 'INTERNE' },
    { label: 'Externe', value: 'EXTERNE' },
    { label: 'Certification', value: 'CERTIFICATION' }
  ];

  chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(
    private formationService: FormationService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.employeId) {
      this.loadFormations();
    }
  }

  private mapApiDataToResponse(data: any[]): ApiResponse[] {
    return data.map(item => ({
      id: item.id,
      employe: item.employe,
      formation: {
        ...item.formation,
        responsableEvaluation: item.formation.responsable_evaluation || item.formation.responsableEvaluation,
        responsableEvaluationExterne: item.formation.responsable_evaluation_externe,
        sousTypeFormation: item.formation.sous_type_formation,
        typeFormation: item.formation.type_formation,
        dateDebutPrevue: item.formation.date_debut_prevue,
        dateFinPrevue: item.formation.date_fin_prevue,
        titrePoste: item.formation.titre_poste,
        valide: item.formation.valide,
        commentaire: item.formation.commentaire,
        commente: item.formation.commente,
        dateDebutReelle: item.formation.date_debut_reelle,
        dateFinReelle: item.formation.date_fin_reelle,
        emailEnvoye: item.formation.email_envoye,
        fichierPdfUrl: item.formation.fichier_pdf_url,
        employes: item.formation.employes,
        id: item.formation.id,
        titre: item.formation.titre,
        description: item.formation.description
      },
      document: item.document,
      evalue: item.evalue,
      resultat: item.resultat,
      res: item.res
    }));
  }

  loadFormations(): void {
    this.loading = true;
    this.error = null;
    
    this.formationService.getFormationsWithDetailsByEmploye(this.employeId).subscribe({
      next: (data) => {
        console.log('Données reçues:', data);
        this.formations = this.mapApiDataToResponse(data);
  
        this.updateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des formations';
        this.loading = false;
        console.error(err);
      }
    });
  }


  refreshFormations(): void {
    this.loadFormations();
    this.formationsUpdated.emit();
  }

  // Méthodes pour les statistiques
  getTotalCount(): number {
    return this.formations.length;
  }

  searchTerm: string = '';

// Méthode pour filtrer les formations
get filteredFormations(): ApiResponse[] {
  if (!this.searchTerm) return this.formations;
  
  const term = this.searchTerm.toLowerCase();
  return this.formations.filter(f => 
    f.formation.titre.toLowerCase().includes(term) ||
    (f.formation.description && f.formation.description.toLowerCase().includes(term)) ||
    (f.formation.typeFormation && f.formation.typeFormation.toLowerCase().includes(term)) ||
    (f.resultat && f.resultat.toLowerCase().includes(term)) ||
    (f.formation.responsableEvaluation?.nom && f.formation.responsableEvaluation.nom.toLowerCase().includes(term)) ||
    (f.formation.responsableEvaluation?.prenom && f.formation.responsableEvaluation.prenom.toLowerCase().includes(term))
  );
}





  getInProgressCount(): number {
    const inProgress = this.formations.filter(f => {
      const debut = new Date(f.formation.dateDebutPrevue);
      const fin = new Date(f.formation.dateFinPrevue);
      const now = new Date();
      return debut <= now && fin >= now;
    });
    console.log('Formations en cours:', inProgress);
    return inProgress.length;
  }

  getStatusText(formation: ApiResponse): string {
    if (!formation.resultat) return 'En attente de validation';
    
    switch(formation.resultat.toUpperCase()) {
      case 'REUSSI':
        return 'Réussi';
      case 'ECHEC':
        return 'Échec';
      case 'PROGRAMME_COMPLEMENTAIRE':
        return 'Programme complémentaire';
      default:
        return 'En attente de validation';
    }
  }

  getStatusClass(formation: ApiResponse): string {
    if (!formation.resultat) return 'status-pending';
    
    switch(formation.resultat.toUpperCase()) {
      case 'REUSSI':
        return 'status-success';
      case 'ECHEC':
        return 'status-failed';
      case 'PROGRAMME COMPLEMENTAIRE':
        return 'status-warning';
      default:
        return 'status-pending';
    }
  }
  
  getStatusIcon(item: ApiResponse): string {
    if (!item.resultat) return 'pi pi-hourglass';
    
    switch(item.resultat.toUpperCase()) {
      case 'REUSSI':
        return 'pi pi-check-circle';
      case 'ECHEC':
        return 'pi pi-times-circle';
      case 'PROGRAMME COMPLEMENTAIRE':
        return 'pi pi-exclamation-circle';
      default:
        return 'pi pi-hourglass';
    }
  }
  getStatusSeverity(item: ApiResponse): Severity {
    if (!item.resultat) return 'info';
    
    switch(item.resultat.toUpperCase()) {
      case 'REUSSI':
        return 'success';
      case 'ECHEC':
        return 'danger';
      case 'PROGRAMME COMPLEMENTAIRE':
        return 'warn';
      default:
        return 'info';
    }
  }

  getResultText(item: ApiResponse): string {
    if (item.res === true) return 'Réussi';
    if (item.res === false) {
      return item.resultat?.includes('COMPLEMENT') 
        ? 'Programme complémentaire' 
        : 'Échec';
    }
    return 'Non évalué';
  }

  showProgressChart(item: ApiResponse): boolean {
    return item.formation.valide === true && item.res !== null;
  }

  getProgressChartData(item: ApiResponse): any {
    return {
      labels: ['Progression'],
      datasets: [
        {
          data: [100],
          backgroundColor: [this.getStatusColor(item)],
          borderWidth: 0
        }
      ]
    };
  }
  getStatusIconColor(item: ApiResponse): any {
    if (!item.resultat) return { color: '#F59E0B' }; // Orange pour en attente
    
    switch(item.resultat.toUpperCase()) {
      case 'REUSSI':
        return { color: '#10B981' }; // Vert pour réussi
      case 'ECHEC':
        return { color: '#EF4444' }; // Rouge pour échec
      case 'PROGRAMME COMPLEMENTAIRE':
        return { color: '#F59E0B' }; // Orange pour programme complémentaire
      default:
        return { color: '#F59E0B' }; // Orange par défaut
    }
  }

  getStatusColor(item: ApiResponse): string {
    if (item.formation.valide && item.res === true) return '#10B981';
    if (item.formation.valide && item.res === false) return '#EF4444';
    return '#3B82F6';
  }

  canEvaluate(item: ApiResponse): boolean {
    return item.formation.valide === true && item.res === null;
  }

  openEvaluationDialog(item: ApiResponse): void {
    console.log('Évaluation de la formation:', item);
    // Implémentez la logique d'évaluation ici
  }

  showDetails(item: ApiResponse): void {
    this.selectedFormation = item;
    this.displayDetailsDialog = true;
  }

  openDocument(documentUrl: string): void {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }

  getAvatarLabel(item: ApiResponse): string {
    const prenom = item.employe.prenom || '';
    const nom = item.employe.nom || '';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }








  getSuccessCount(): number {
    return this.formations.filter(f => 
      f.resultat && f.resultat.toUpperCase() === 'REUSSI'
    ).length;
  }
  
  getFailedCount(): number {
    return this.formations.filter(f => 
      f.resultat && f.resultat.toUpperCase() === 'ECHEC'
    ).length;
  }
  
  getComplementaryProgramCount(): number {
    return this.formations.filter(f => 
      f.resultat && f.resultat.toUpperCase() === 'PROGRAMME_COMPLEMENTAIRE'
    ).length;
  }
  
  getPendingValidationCount(): number {
    return this.formations.filter(f => 
      !f.resultat
    ).length;
  }
  private updateStats(): void {
    this.stats = [
      { type: 'total', value: this.getTotalCount(), label: 'Total formations', icon: 'pi pi-book' },
      { type: 'success', value: this.getSuccessCount(), label: 'Réussies', icon: 'pi pi-check-circle' },
      { type: 'danger', value: this.getFailedCount(), label: 'Échecs', icon: 'pi pi-times-circle' },
      { type: 'warning', value: this.getComplementaryProgramCount(), label: 'Programmes complementaire.', icon: 'pi pi-exclamation-circle' },
      { type: 'info', value: this.getPendingValidationCount(), label: 'En attente', icon: 'pi pi-hourglass' }
    ];
  } 


  getProgressValue(item: ApiResponse): number {
    if (!item.formation.valide) return 0;
    if (item.res === true) return 100;
    if (item.res === false) return 30; // Échec partiel
    return 70; // En cours
  }
  getStatusColorClass(item: ApiResponse): any {
    return {
      'background-color': this.getStatusColor(item),
      'color': 'white',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'width': '40px',
      'height': '40px',
      'border-radius': '50%',
      'font-size': '1.2rem'
    };
  }
  
  getProgressLabel(item: ApiResponse): string {
    const progress = this.getProgressValue(item);
    return `${progress}% complété`;
  }
  
  getFormationSkills(item: ApiResponse): string[] {
    // Implémentez cette méthode selon vos besoins
    return ['Compétence 1', 'Compétence 2'];
  }




}