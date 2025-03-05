import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
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

      // Obtener el contenido de cada archivo y convertirlo a Base64
      const imagePromises = result.files.map(async (fileName) => {
        const file = await Filesystem.readFile({
          path: `photos/${fileName}`,
          directory: Directory.Data,
          encoding: Encoding.UTF8  // Usamos UTF8 para leer el archivo
        });
        return `data:image/jpeg;base64,${file.data}`;
      });

      // Esperar a que todas las imágenes se carguen
      this.images = await Promise.all(imagePromises);

    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
      // Si no existen imágenes todavía, inicializamos el array vacío
      this.images = [];
    }
  }

  // Abrir una imagen en tamaño completo
  openImage(image: string) {
    // Aquí puedes mostrar la imagen en una vista modal o similar
    console.log('Imagen seleccionada:', image);
  }

  // Método para regresar a la cámara
  goBack() {
    this.router.navigate(['/']); // Redirige a la página principal (componente cámara)
  }
}
