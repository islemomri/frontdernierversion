import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification/service/notification.service';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, BadgeModule, CommonModule, BadgeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent  implements OnInit{
  userRole: string | null = null;
  userId: number | null = null;
  notifications: any[] = [];

  constructor(private authService:AuthService, private notificationService: NotificationService){
    
  }
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.userId = Number(localStorage.getItem('userId'));

  }

  isRH(): boolean {
     
    return this.userRole === 'RH';
  }
  

  isAdmin(): boolean {
    
    return this.userRole === 'ADMIN';
  }

  isResponsable(): boolean {
    
    return this.userRole === 'RESPONSABLE';
  }

  isDirecteur(): boolean {
    return this.userRole === 'DIRECTEUR';
  }

  logout() {
    this.authService.logout();
  }



  markNotificationsAsRead() {
    if (this.userId) {
      this.notificationService.markAsRead(this.userId).subscribe(() => {
        this.notifications = []; 
      });
    }
  }

}
