import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-changepass',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private auth: AuthService, private router: Router) {}

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('❌ Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    this.auth.changePassword({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        alert('✅ Mot de passe modifié avec succès');
        this.oldPassword = this.newPassword = this.confirmPassword = '';
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        alert(`❌ ${err.error?.message || 'Erreur lors du changement de mot de passe'}`);
      }
    });
  }
}
