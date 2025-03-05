import { Component, ViewEncapsulation } from '@angular/core';
import { CameraService } from '../../camera/services/camera.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importa Router para navegación
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

      // Mostrar el video en la pantalla para tomar la foto
      document.body.appendChild(videoElement); 

      // Esperar un poco y luego capturar la imagen
      setTimeout(async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convertir la imagen a base64
        const imageBase64 = canvas.toDataURL('image/jpeg');

        // Guardar la imagen en el almacenamiento local
        await this.saveImage(imageBase64);

        // Detener el flujo de video
        stream.getTracks().forEach(track => track.stop());

        // Redirigir a la galería
        this.router.navigate(['/gallery']);
      }, 1000); // Espera 1 segundo para capturar la imagen
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  // Método para guardar la imagen en el almacenamiento local
  async saveImage(imageBase64: string) {
    try {
      const fileName = `photo_${new Date().getTime()}.jpg`;

      // Guardar la imagen en el almacenamiento local
      await Filesystem.writeFile({
        path: `photos/${fileName}`,
        data: imageBase64.split(',')[1], // Extrae solo la parte base64
        directory: Directory.Data,
        encoding: Encoding.UTF8  // Usa Encoding.UTF8 ya que el contenido es texto
      });

      console.log('Imagen guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  }

  // Método para navegar a la galería
  goToGallery() {
    this.router.navigate(['/gallery']); // Redirige al componente Galería
  }
}
