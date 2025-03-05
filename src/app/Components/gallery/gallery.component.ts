import { Component } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  // Importamos Router para la navegación

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  images: string[] = []; // Array para almacenar las rutas de las imágenes

  constructor(private router: Router) {
    this.loadImages(); // Cargar las imágenes al iniciar el componente
  }

  // Cargar imágenes desde el almacenamiento local
  async loadImages() {
    try {
      // Lee el directorio donde guardamos las fotos
      const result = await Filesystem.readdir({
        path: 'photos',
        directory: Directory.Data
      });

      // Si tiene imágenes, las cargamos
      this.images = result.files.map(file => `data:image/jpeg;base64,${file}`);
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
      // Si no existen imágenes todavía, inicializamos el array vacío
      this.images = [];
    }
  }

  // Abrir una imagen en tamaño completo
  openImage(image: string) {
    // Puedes hacer algo aquí para abrir la imagen, como mostrarla en una vista modal
    console.log('Imagen seleccionada:', image);
  }

  // Método para regresar a la cámara
  goBack() {
    this.router.navigate(['/']); // Redirige a la página principal (componente cámara)
  }
}
