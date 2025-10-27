import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  
  constructor(private auth: AuthService, private router: Router) {}

  login() {
  console.log('🟡 login() appelé avec :', this.email, this.password);

  // ✅ Vérifier que les champs ne sont pas vides avant d’envoyer la requête
  if (!this.email || !this.password) {
    alert('❌ Veuillez remplir tous les champs');
    return;
  }

  this.auth.login({ email: this.email, password: this.password }).subscribe({
    next: (res) => {
      console.log('✅ Connexion réussie');
      alert('✅ Connexion réussie !');
      this.auth.saveToken(res.token);
      this.router.navigate(['/profile']);
    },
    error: (err) => {
      console.error('❌ Erreur lors de la connexion:', err.error?.message || err.message);
      alert('❌ Email ou mot de passe incorrect.');
    }
  });
}
}