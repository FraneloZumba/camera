import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  private async checkPermissions(): Promise<boolean> {  // Especificamos que retorna un booleano
    const check = async (permission: PermissionStatus): Promise<boolean> => {  // También se especifica que es un booleano
      if (permission.camera !== 'granted' || permission.photos !== 'granted') {
        const request = await Camera.requestPermissions();
        return request.camera === 'granted' && request.photos === 'granted';
      }
      return true;
    };
   
    const permissions = await Camera.checkPermissions();
    const hasPermissions = await check(permissions);

    if (!hasPermissions) {
      throw new Error('Permisos de cámara no otorgados');
    }

    return true;  // Aquí siempre se retorna true si los permisos son válidos
  }

  async takePicture(): Promise<string> {  // Especificamos que retorna una cadena (URL de la imagen)
    await this.checkPermissions();
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    var imageUrl = image.webPath;

    if (imageUrl != null) {
      return imageUrl;
    } else {
      throw new Error("Error al tomar la foto");
    }
  };
}
