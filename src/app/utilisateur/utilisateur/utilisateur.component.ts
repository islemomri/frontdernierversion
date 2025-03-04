import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../model/utilisateur';
import { UtilisateurService } from '../service/utilisateur.service';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../auth/service/auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [CommonModule, TagModule, TableModule, ButtonModule, DialogModule, ReactiveFormsModule, FormsModule, InputTextModule, ConfirmDialogModule, ToastModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.css',
  providers:[MessageService, ConfirmationService]
})
export class UtilisateurComponent implements OnInit{

  utilisateurs: Utilisateur[] = [];
  userRole: string | null = null;
  utilisateurSelectionne: Utilisateur = {} as Utilisateur;
  displayDialog: boolean = false;
  passwordDialogVisible: boolean = false;
  newPassword: string = '';


  constructor(
    private utilisateurService: UtilisateurService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  
  ngOnInit(): void {
    this.utilisateurService.getUtilisateurs().subscribe(data => {
      this.utilisateurs = data;
    });
  }

  getSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role) {
      case 'ADMIN':
        return 'danger';  
      case 'DIRECTEUR':
        return 'warn';    
      case 'RH':
        return 'info';    
      case 'RESPONSABLE':
        return 'success'; 
      default:
        return 'secondary'; 
    }
  }

  openEditDialog(utilisateur: Utilisateur): void {
    this.utilisateurSelectionne = { ...utilisateur }; 
    this.displayDialog = true;
  }

  updateUtilisateur(): void {
    if (this.utilisateurSelectionne) {
      this.utilisateurService.updateUtilisateur(this.utilisateurSelectionne.id, this.utilisateurSelectionne)
        .subscribe(updatedUser => {
          this.utilisateurs = this.utilisateurs.map(u =>
            u.id === updatedUser.id ? updatedUser : u
          );
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour' });
        });
    }
  }

  
  
  deleteUtilisateur(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUtilisateur(id).subscribe(() => {
        this.utilisateurs = this.utilisateurs.filter(utilisateur => utilisateur.id !== id);
      });
    }
  }

  resetPassword(userId: number, nom: string): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      message: `Voulez-vous vraiment réinitialiser le mot de passe de ${nom} ?`,
      icon: 'pi pi-exclamation-circle',
      acceptLabel: 'Oui',  
      rejectLabel: 'Non',  
      acceptButtonProps: {
        severity: 'success',
      },
      rejectButtonProps: {
        severity: 'danger',  
      },
      accept: () => {
        this.utilisateurService.resetPassword(userId).subscribe(response => {
          this.newPassword = response.newPassword;
          this.passwordDialogVisible = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Le mot de passe de ${nom} a été réinitialisé.`,
            life: 3000
          });
        }, error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de réinitialiser le mot de passe',
            life: 3000
          });
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Annulé',
          detail: 'Réinitialisation annulée',
          life: 3000
        });
      }
    });
  }

  capitalizeFirstLetter(role: string): string {
    if (!role) return role;
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }
}