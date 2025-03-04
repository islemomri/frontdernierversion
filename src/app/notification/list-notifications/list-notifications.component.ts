import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-list-notifications',
  imports: [CommonModule, ButtonModule],
  templateUrl: './list-notifications.component.html',
  styleUrl: './list-notifications.component.css'
})
export class ListNotificationsComponent implements OnInit{
  notifications: any[] = [];
  userId: number | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadNotifications();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications(this.userId!).subscribe((data) => {
      this.notifications = data; 
    });
  }
  

  markAsRead(notificationId: number) {
    this.notificationService.markOneAsRead(notificationId).subscribe(() => {
      const notif = this.notifications.find(n => n.id === notificationId);
      if (notif) {
        notif.lue = true;  // Met à jour l'état sans supprimer la notification
      }
    });
  }
  
  

  markAllAsRead() {
    if (this.userId) {
      this.notificationService.markAsRead(this.userId).subscribe(() => {
        this.notifications.forEach(n => n.lue = true); // Ne pas supprimer
      });
    }
  }
  
  

}
