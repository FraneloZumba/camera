import { Routes } from '@angular/router';
import { CameraComponent } from './Components/camera/camera.component';
import { GalleryComponent } from './Components/gallery/gallery.component'; // Asegúrate de importar GalleryComponent

export const routes: Routes = [
  { path: '', component: CameraComponent },  // Ruta principal
  { path: 'gallery', component: GalleryComponent },  // Ruta para la galería
];
