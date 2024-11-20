import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document } from '../../model/Document';
import { getFileType } from './fileGridFns';
import { getFileLogo } from './FileLogo';
import '../../styles/FileGrid.scss';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';





export const getFilePreview = (fileType: string, base64: string) => {
  if (fileType.includes('image')) {
    return <img src={`data:${fileType};base64,${base64}`} alt="preview" style={{ width: '100px', height: '50px', objectFit: 'cover' }} />;
  } else {
    return getFileLogo(fileType);
  }
};


const save = async (userId: number, files: Document[], token: string) => {
  try {
    await fetch(`https://localhost:7001/api/MemPoolDocument/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(files),
    });
  } catch (error) {
    console.error('Error de conexión:', error);
  }
};

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} bytes`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
};


const deleteFile = async (userId: number, fileId: number, token: string) => {
  try {
    await fetch(`https://localhost:7001/api/MemPoolDocument/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
  }
};

const getUserFiles = async (userId: number, token: string) => {
  try {
    const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (response.ok) return await response.json();
    return;
  } catch (error) {
    console.error('Error:', error);
  }
};

const File: React.FC = () => {
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('sessionData')!));
  const [files, setFiles] = useState<Array<Document>>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const fileLimit = 20;

  const setUserFiles = async () => {
    if (sessionData) {
      const dataResponse = await getUserFiles(Number.parseInt(sessionData.userId), sessionData.token);
      if (dataResponse) {
        const { data } = dataResponse;
        setFiles(data);
      }
    }
  };

  useEffect(() => {
    setUserFiles();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: Array<Document> = [];
    if (files.length + acceptedFiles.length > fileLimit) {
      alert(`Solo puedes cargar un máximo de ${fileLimit} archivos.`);
      return;
    }

    acceptedFiles.forEach(file => {
      if (getFileType(file.type.split('/')[1]) !== 'Tipo desconocido') {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = reader.result as string;

          const newFileData: Document = {
            id: files.length + newFiles.length,
            owner: sessionData.userName,
            fileType: file.type.split('/')[1],
            creationDate: new Date().toISOString(),
            size: file.size.toString(),
            doc_encode: base64String.split(',')[1],
            fileName: file.name
          };

          newFiles.push(newFileData);
          if (newFiles.length === acceptedFiles.length) {
            await save(sessionData.userId, newFiles, sessionData.token);
            await setUserFiles();
          }
        };
        reader.readAsDataURL(file);
      }
    });
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, [files, sessionData.userName, sessionData.userId, sessionData.token]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
    {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    multiple: true,
    maxFiles: 6
  });

  const handleSelectFile = (fileId: number | undefined) => {
    if (fileId === undefined) return;
    setSelectedFiles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(fileId)) newSelected.delete(fileId);
      else newSelected.add(fileId);
      return newSelected;
    });
  };


  const handleDownloadSelected = async () => {
    const zip = new JSZip();
  
    // Convierte selectedFiles (Set<number>) en un array antes de iterar
    const selectedFilesArray = Array.from(selectedFiles);
  
    for (const fileId of selectedFilesArray) {
      const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${sessionData.userId}/document/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.token}`,
        },
      });
  
      const fileData = await response.json();
  
      if (response.ok && fileData.success) {
        const content = fileData.data.doc_encode;
  
        // Verifica si los datos Base64 no están vacíos
        if (content) {
          try {
            const byteArray = Uint8Array.from(atob(content), c => c.charCodeAt(0));
  
            // Determina la extensión del archivo según su tipo MIME
            let fileExtension = '';
            switch (fileData.data.fileType) {
              case 'text/plain':
                fileExtension = 'txt';
                break;
              case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
                fileExtension = 'docx';
                break;
              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                fileExtension = 'xlsx';
                break;
              case 'application/vnd.ms-powerpoint':
              case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                fileExtension = 'pptx';
                break;
              case 'application/pdf':
                fileExtension = 'pdf';
                break;
              case 'image/jpeg':
                fileExtension = 'jpg';
                break;
              case 'image/png':
                fileExtension = 'png';
                break;
              default:
                fileExtension = 'bin'; // Usar una extensión genérica si no se conoce
                break;
            }
  
            // Asigna el archivo decodificado al ZIP
            zip.file(`${fileData.data.owner}_${fileData.data.id}.${fileExtension}`, byteArray);
          } catch (error) {
            console.error('Error al decodificar Base64 o generar el archivo:', error);
          }
        }
      } else {
        console.error('Error al obtener datos del archivo:', fileData.message);
      }
    }
  
    // Generar el ZIP y permitir la descarga
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'archivos_comprimidos.zip');
    });
  };
  
  
  
  
  
  




  //descragar un unico documento
  const handleDownload = async (fileId: number) => {
    try {
      const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${sessionData.userId}/document/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.token}`,
        },
      });
  
      if (response.ok) {
        const fileData = await response.json();
        if (fileData.success && fileData.data && fileData.data.doc_encode) {
          const encodedContent = fileData.data.doc_encode;
          
          // Verifica que la cadena Base64 esté completa
          if (encodedContent.length % 4 === 0) {
            // Decodifica el Base64 y convierte a Blob
            const content = atob(encodedContent);
            const byteArray = new Uint8Array(content.length);
            for (let i = 0; i < content.length; i++) {
              byteArray[i] = content.charCodeAt(i);
            }
  
            const fileType = getFileType(fileData.data.fileType);
            let fileExtension = '';
            switch (fileType) {
              case 'Documento de Texto':
                fileExtension = 'txt';
                break;
              case 'Documento Word':
                fileExtension = 'docx';
                break;
              case 'Excel':
                fileExtension = 'xlsx';
                break;
              case 'PowerPoint':
                fileExtension = 'pptx';
                break;
              case 'Documento PDF':
                fileExtension = 'pdf';
                break;
              case 'Imagen JPEG':
                fileExtension = 'jpeg';
                break;
              case 'Imagen PNG':
                fileExtension = 'png';
                break;
              default:
                fileExtension = 'file';
                break;
            }
  
            const blob = new Blob([byteArray], { type: fileData.data.fileType });
            saveAs(blob, `${fileData.data.fileName || `archivo_${fileData.data.id}`}.${fileExtension}`);
          } else {
            console.error('La cadena Base64 está incompleta o mal formada');
          }
        } else {
          console.error('No se encontró la cadena doc_encode');
        }
      } else {
        console.error('Error en la respuesta del servidor:', response.status);
      }
    } catch (error) {
      console.error('Error descargando archivo:', error);
    }
  };
  
  
  



  const handleDelete = async (fileId: number) => {
    if (sessionData) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Este archivo será eliminado permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteFile(sessionData.userId, fileId, sessionData.token);
            setFiles(files.filter(file => file.id !== fileId));
            Swal.fire('Eliminado!', 'El archivo ha sido eliminado.', 'success');
          } catch (error) {
            console.error('Error al eliminar el archivo:', error);
          }
        }
      });
    }
  };


  const handleMine = async () => {
    const selectedDocuments = files.filter(file => selectedFiles.has(file.id));
    const selectedCount = selectedDocuments.length;
  
    if (selectedCount < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'No hay suficientes documentos',
        text: 'Debes seleccionar al menos 3 documentos para minar.',
      });
    } else if (selectedCount > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Demasiados documentos seleccionados',
        text: 'No puedes seleccionar más de 5 documentos para minar.',
      });
    } else {
      try {
        const response = await fetch(`https://localhost:7001/api/Block/${sessionData.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionData.token}`,
          },
          body: JSON.stringify(selectedDocuments),
        });
  
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            Swal.fire({
              icon: 'success',
              title: 'Bloque minado con éxito',
              text: 'El bloque fue creado y los documentos fueron procesados.',
            });
            await setUserFiles();
            setSelectedFiles(new Set());
          } else {
            throw new Error(result.message);
          }
        } else {
          throw new Error('Error en el servidor al intentar minar el bloque.');
        }
      } catch (error) {
        console.error('Error durante el proceso de minado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo completar el proceso de minado. Revisa la consola para más detalles.',
        });
      }
    }
  };
  

  // Agregar esta función junto a las demás funciones de fetch existentes
  const bulkDelete = async (userId: number, documents: Document[], token: string) => {
    try {
      const response = await fetch('https://localhost:7001/api/MemPoolDocument/bulkdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documents)
      });

      if (!response.ok) {
        throw new Error('Error en eliminación masiva');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      throw error;
    }
  };

  // Reemplazar la función handleDeleteSelected existente con esta versión
  const handleDeleteSelected = async () => {
    if (sessionData) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Todos los archivos seleccionados serán eliminados permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar todos',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Filtrar los documentos seleccionados
            const documentsToDelete = files.filter(file => selectedFiles.has(file.id));

            // Llamar al endpoint de bulk delete
            await bulkDelete(sessionData.userId, documentsToDelete, sessionData.token);

            // Actualizar el estado local
            setFiles(files.filter(file => !selectedFiles.has(file.id)));
            setSelectedFiles(new Set());

            Swal.fire('Eliminados!', 'Los archivos seleccionados han sido eliminados.', 'success');
          } catch (error) {
            console.error('Error al eliminar los archivos seleccionados:', error);
            Swal.fire('Error!', 'Hubo un problema al eliminar los archivos.', 'error');
          }
        }
      });
    }
  };




  return (
    <div style={{ margin: '0 20px' }}>
      <div
        {...getRootProps()}
        className="drop-zone"
        style={{
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          marginBottom: '20px',
        }}
      >
        <input {...getInputProps()} />
        <img
          className="upload"
          src="https://img.icons8.com/pastel-glyph/100/upload-document--v2.png"
          alt="upload-document--v2"
        />
        {isDragActive ? (
          <p>Suelta los archivos aquí...</p>
        ) : (
          <p style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
            Arrastra y suelta los archivos aquí o haz clic para seleccionar
          </p>
        )}
      </div>


      {files.length > 0 && (
        <table className="file-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th colSpan={9} style={{ textAlign: 'right' }}>
                {selectedFiles.size > 1 && (
                  <>
                    <button className="minar-button" onClick={handleMine}>Minar</button>
                    <button className="download-button" onClick={handleDownloadSelected}>Descargar todo</button>
                    <button className="delete-button" onClick={handleDeleteSelected} disabled={selectedFiles.size < 1}>Eliminar Todo</button>
                  </>
                )}
              </th>
            </tr>
            <tr>
              <th>Seleccionar</th>
              <th>Vista previa</th>
              <th>Propietario</th>
              <th>Tipo de archivo</th>
              <th>Fecha y hora</th>
              <th>Tamaño</th>
              <th>Descargar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => handleSelectFile(file.id)}
                  />
                </td>
                <td>{getFilePreview(file.fileType, file.doc_encode ?? '')}</td>
                <td>{file.owner}</td>
                <td>{getFileType(file.fileType)}</td>
                <td>{new Date(file.creationDate).toLocaleString()}</td>
                <td>{formatFileSize(Number(file.size))}</td>
                <td>
                  <button className="download-button" onClick={() => handleDownload(file.id)}> Descargar </button>
                </td>
                <td>
                  <button className="delete-button" onClick={() => handleDelete(file.id)}> Eliminar </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default File;