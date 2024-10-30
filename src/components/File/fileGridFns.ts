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
  
  //get png icon
  export const getFileLogo = (fileType: string) => {
    switch (fileType) {
      case 'text/plain':
        return 'reshot-icon-txt-FW2S37HCGN.svg';
      case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'reshot-icon-doc-HDFMVY6BE8.svg';
      case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'reshot-icon-xlsx-3BZY7UNQDW.svg';
      case 'vnd.openxmlformats-officedocument.presentationml.presentation':
        return 'reshot-icon-ppt-EYFDAUSVPT.svg';
      case 'pdf':
        return 'reshot-icon-pdf-WFAVXEYNPZ.svg';
      default:
        return 'Tipo desconocido';
    }
  }
  