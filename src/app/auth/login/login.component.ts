import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TooltipModule } from 'primeng/tooltip';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RecaptchaModule, RecaptchaFormsModule, ReactiveFormsModule,TooltipModule, FloatLabelModule, ButtonModule, ToastModule, DatePickerModule, FormsModule, InputIconModule, IconFieldModule, IftaLabelModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService] 
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  date2: Date | undefined;
  recaptchaToken: string | null = null;
  @ViewChild('recaptcha') recaptcha: RecaptchaComponent | undefined;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  onCaptchaResolved(token: string) {
    this.recaptchaToken = token;
    this.loginForm.patchValue({ recaptcha: token });
  }
  

  resetCaptcha() {
    this.recaptchaToken = null;
    this.loginForm.patchValue({ recaptcha: '' });
  
    // Réinitialiser le widget reCAPTCHA
    if (this.recaptcha) {
      this.recaptcha.reset();  // Cette ligne efface le captcha
    }
  }
  

  login() {
    if (this.loginForm.valid) {
      const loginData = {
        ...this.loginForm.value,
        captchaToken: this.recaptchaToken, // Ajouter le token reCAPTCHA
      };

      this.authService.login(loginData).subscribe(
        response => {
          console.log('Login successful:', response);
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('userId', response.utilisateurId);

          const userRole = localStorage.getItem('userRole');
          const userId = localStorage.getItem('userId');

          console.log('User ID:', userId);
          console.log('User role:', userRole);

          if (this.authService.getUserRole() === 'RH') {
            this.router.navigate(['/sidebar']);
            localStorage.setItem('RHID', response.utilisateurId); // Stocker l'ID seulement si c'est un RH
            console.log('RH ID stocké:', response.utilisateurId);

            
          } else if (this.authService.getUserRole() === 'DIRECTEUR') {
            this.router.navigate(['/sidebar']);
          } else {
            this.router.navigate(['/sidebar']);
          }
          this.messageService.add({ severity: 'success', summary: 'Succès',detail: 'Authentification réussie' });
          
        },
        error => {
          console.error('Login error:', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Email ou mot de passe incorrect' });
          this.resetCaptcha();
        }
      );
    }
  }
}