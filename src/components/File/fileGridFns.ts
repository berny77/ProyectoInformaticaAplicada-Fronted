export const getFileType = (fileType: string) => {
    switch (fileType) {
      case 'text/plain':
        return 'Documento de Texto';
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Documento Word';
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'Excel';
      case 'vnd.openxmlformats-officedocument.presentationml.presentation':
        return 'PowerPoint';
      case 'pdf':
        return 'Documento PDF';
      case 'image/jpeg':
        return 'Imagen JPEG';
      case 'image/png':
        return 'Imagen PNG';
      default:
        return 'Tipo desconocido';
    }
  }
