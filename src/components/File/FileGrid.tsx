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
    await fetch(`https://localhost:7001/api/MemPoolDocument/${userId}/${fileId}`, {
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
  const fileLimit = 6;

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
  
    selectedFiles.forEach((fileId) => {
      const fileData = files.find(file => file.id === fileId);
      if (fileData) {
        const content = fileData.doc_encode ? atob(fileData.doc_encode) : '';
        
        const fileName = fileData.name || fileData.fileType;
        zip.file(fileName, content, { binary: true });
      }
    });
  
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'selected_files.zip');
  };

  const handleDownload = async (fileId: number) => {
    try {
      const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${sessionData.userId}/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionData.token}`,
        },
      });
  
      if (response.ok) {
        const fileData = await response.json();
        if (fileData && fileData.doc_encode) {
          const content = atob(fileData.doc_encode);
    
          // Convertir la cadena base64 en un ArrayBuffer
          const byteArray = new Uint8Array(content.length);
          for (let i = 0; i < content.length; i++) {
            byteArray[i] = content.charCodeAt(i);
          }
          
          // Obtener el tipo de archivo y asignar una extensión
          const fileType = getFileType(fileData.fileType);
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
  
          const blob = new Blob([byteArray], { type: fileData.fileType });
          saveAs(blob, `${fileData.fileName || `archivo_${fileData.id}`}.${fileExtension}`);
        }
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
            const fileIds = Array.from(selectedFiles);
            for (const fileId of fileIds) {
              await deleteFile(sessionData.userId, fileId, sessionData.token);
            }
            setFiles(files.filter(file => !selectedFiles.has(file.id)));
            setSelectedFiles(new Set());
            Swal.fire('Eliminados!', 'Los archivos seleccionados han sido eliminados.', 'success');
          } catch (error) {
            console.error('Error al eliminar los archivos seleccionados:', error);
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
                    <button onClick={handleDownloadSelected}>Descargar todo</button>
                    <button onClick={handleDeleteSelected} disabled={selectedFiles.size < 1}>
                      Eliminar Todo
                    </button>
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
                  <button onClick={() => handleDownload(file.id)}>Descargar</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(file.id)}>Eliminar</button>
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