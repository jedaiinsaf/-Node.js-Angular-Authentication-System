import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    // ✅ Vérification des champs vides
    if (!this.name || !this.email || !this.password) {
      alert('❌ Veuillez remplir tous les champs.');
      return;
    }

    console.log('🟡 Tentative d’inscription :', this.name, this.email, this.password);

    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('✅ Inscription réussie');
        alert('✅ Compte créé avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l’inscription :', err.error?.message || err.message);
        alert('❌ Erreur lors de la création du compte.');
      }
    });
  }
}
