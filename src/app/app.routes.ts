import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddEmployeComponent } from './employe/add-employe/add-employe.component';
import { EmployeListComponent } from './employe/getall-employeexistant/getall-employeexistant.component';
import { ListSiteComponent } from './site/list-site/list-site.component';
import { ListDirectionComponent } from './direction/list-direction/list-direction.component';
import { ArchiveListDirectionComponent } from './Archive/archive-list-direction/archive-list-direction.component';
import { ListeArchiveComponent } from './Archive/liste-archive/liste-archive.component';
import { ArchiveListSiteComponent } from './Archive/archive-list-site/archive-list-site.component';
import { ListPosteComponent } from './poste/list-poste/list-poste.component';
import { NavbarexmplComponent } from './navbarexmpl/navbarexmpl.component';
import { ExperienceComponent } from './employe/experience/experience.component';
import { CarteComponent } from './carte/carte.component';
import { TypeDiplomeComponent } from './diplome/type-diplome/type-diplome.component';
import { ListDiplomeComponent } from './diplome/list-diplome/list-diplome.component';
import { ArchiveListeTypediplomeComponent } from './Archive/archive-liste-typediplome/archive-liste-typediplome.component';
import { ArchiveListPosteComponent } from './Archive/archive-list-poste/archive-list-poste.component';
import { adminGuard } from './auth/guard/admin.guard';
import { ListeEmployeComponent } from './employe/liste-employe/liste-employe.component';
import { ProfileComponent } from './employe/profile/profile.component';
import { PosteComponent } from './employe/poste/poste.component';
import { UtilisateurComponent } from './utilisateur/utilisateur/utilisateur.component';
import { RecrutementComponent } from './compatibilte/recrutement/recrutement.component';
import { ListNotificationsComponent } from './notification/list-notifications/list-notifications.component';
import { guardGuard } from './auth/guard/guard.guard';
import { FormationComponent } from './formation/formation.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component : SignupComponent, canActivate:[adminGuard]},
  { path: 'sidebar', component : SidebarComponent},
  { path: 'add-employe', component: AddEmployeComponent },
  { path: 'list-employe-existants', component: EmployeListComponent },
  { path: 'list-site', component: ListSiteComponent },
  { path: 'list-directions', component: ListDirectionComponent },
  { path: 'list-directions-archives', component: ArchiveListDirectionComponent },
  { path: 'archive', component: ListeArchiveComponent },
  { path: 'liste-sites-archives', component: ArchiveListSiteComponent },
  { path: 'navbarexp', component: NavbarexmplComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'carte', component: CarteComponent },
  { path: 'list-types', component: TypeDiplomeComponent, canActivate:[guardGuard] },
  { path: 'diplomes', component: ListDiplomeComponent },
  { path: 'archive-liste-typediplome', component: ArchiveListeTypediplomeComponent },
  { path: 'list-Poste', component: ListPosteComponent },
  { path: 'archive-liste-Poste', component: ArchiveListPosteComponent },
  { path: 'ListeEmploye', component: ListeEmployeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'poste', component: PosteComponent},
  { path: 'list-utilisateurs', component:UtilisateurComponent},
  { path: 'register/:role',component:SignupComponent},
  { path: 'compatibilite/:posteId', component: RecrutementComponent },
  { path: 'chart', component: RecrutementComponent },
  { path: 'notifications', component:ListNotificationsComponent},
  { path: 'Formation', component:FormationComponent},

];
