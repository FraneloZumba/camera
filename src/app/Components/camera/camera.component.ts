import { Component, ViewEncapsulation } from '@angular/core';
import { CameraService } from '../../camera/services/camera.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa Router para navegación

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
  encapsulation: ViewEncapsulation.None // Desactiva la encapsulación
})
export class CameraComponent {
  isDarkMode = false;
  currentDate: string = '';
  currentTime: string = '';

  constructor(
    private cameraService: CameraService,
    private router: Router // Inyecta el router
  ) { 
    setInterval(() => {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('es-EC', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      this.currentTime = now.toLocaleTimeString('es-EC', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }, 1000);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  async openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();
  
      document.body.appendChild(videoElement); 
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  // Método para navegar a la galería
  goToGallery() {
    this.router.navigate(['/gallery']); // Redirige al componente Galería
  }
}
