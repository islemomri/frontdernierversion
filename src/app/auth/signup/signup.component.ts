import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-signup',
  standalone:true,
  imports: [ CommonModule,ReactiveFormsModule,CardModule, FloatLabelModule, InputTextModule, PasswordModule, RouterModule, ButtonModule, DropdownModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{

  registerForm : any;

  registerRequest: any = {};
  password2='';
  errorMessage: string | undefined;

  constructor(private authService:AuthService, private route:Router, private fb:FormBuilder) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [ Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: [''] // Ajouté pour éviter les erreurs dans le select
    }, { validator: this.passwordMatchValidator });
  
    console.log('Formulaire initialisé :', this.registerForm.value);
  }
  

  passwordMatchValidator(formGroup:FormGroup){
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password != confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  submitForm() {
    if (this.registerForm.invalid) {
      console.log('Formulaire invalide !', this.registerForm.errors);
      console.log('Détails des champs :', this.registerForm.controls);
      return;
    }
  
    const formValue = this.registerForm.value;
  
    if (this.isAdmin()) {
      if (formValue.role === 'RH') {
        this.authService.registerRH(formValue).subscribe(response => this.handleSuccess(response));
      } else if (formValue.role === 'DIRECTEUR') {
        this.authService.registerDirecteur(formValue).subscribe(response => this.handleSuccess(response));
      } else if (formValue.role === 'RESPONSABLE'){
        this.authService.registerResponsable(formValue).subscribe(response => this.handleSuccess(response));
      }
    } else {
      alert("Vous n'avez pas l'autorisation de créer un utilisateur !");
    }
  }
  
  
  handleSuccess(response: any) {
    alert(`Utilisateur ${response.nom} créé avec succès`);
    this.route.navigate(['/login']);
  }
  
  
  signupRDirecteur(){
    if (this.password2 !== this.registerRequest.password) {
      this.errorMessage = 'Passwords do not match';
      console.log(this.errorMessage);
      
    }
    else{
      console.log(this.registerRequest);
    this.authService.registerDirecteur(this.registerRequest).subscribe(
      response=>{
        console.log('Inscription Directeur:',response);
        this.route.navigate(['/login']);
       
      },
      error =>{
        console.error('Inscription failure:',error);
        
      }
    )
    }
  }

  
   
  isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMIN';
  }
  

  

}
