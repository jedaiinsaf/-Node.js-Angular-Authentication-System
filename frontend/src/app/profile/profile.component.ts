import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'; // ✅ Importer le Router

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  error = '';

  constructor(private auth: AuthService, private router: Router) {} // ✅ Injecter Router

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de profil';
        console.error('Erreur profile:', err);
      }
    });
  }

  logout() {
    this.auth.logout();           // ✅ appel service logout
    this.router.navigate(['/login']); // ✅ redirection
  }
  goToChangePassword(): void {
  this.router.navigate(['/changepass']);
}

}
