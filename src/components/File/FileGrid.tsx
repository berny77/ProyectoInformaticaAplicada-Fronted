import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Document from '../../model/Document';
import { getFileLogo, getFileType } from './fileGridFns';
import '../../styles/FileGrid.css';

const useAuth = () => {
  return { userId: 1, userName: 'Usuario Ejemplo' };
};

export const getFilePreview = (fileType: string, base64: string) => {
  if (fileType.includes('image')) {
    return <img src={`data:${fileType};base64,${base64}`} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />;
  } else {
    return <img src={getFileLogo(fileType)} alt="preview" />;
  }
};

const save = async (files: Document[], userId: number) => {
  try {
    const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(files),
    });
  } catch (error) {
    console.error('Error de conexión:', error);
  }
};

const File: React.FC = () => {
  const { userId, userName } = useAuth();
  const [files, setFiles] = useState<Array<Document>>([]);
  const [owner, setOwner] = useState<string>(userName || '');
  const fileLimit = 6;

  useEffect(() => {
    console.log('ID del usuario logueado:', userId);
  }, [userId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: Array<Document> = [];
    if (files.length + acceptedFiles.length > fileLimit) {
      alert(`Solo puedes cargar un máximo de ${fileLimit} archivos.`);
      return;
    }

    acceptedFiles.forEach(file => {
      if (getFileType(file.type.split('/')[1]) !== 'Tipo desconocido') {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;

          const newFileData: Document = {
            id: files.length + newFiles.length,
            owner: owner || 'Propietario desconocido',
            fileType: file.type.split('/')[1],
            creationDate: new Date().toISOString(),
            size: file.size.toString(),
            doc_encode: base64String.split(',')[1]
          };

          newFiles.push(newFileData);
          if (newFiles.length === acceptedFiles.length) {
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
            save([...files, ...newFiles], userId);
          }
        };
        reader.readAsDataURL(file);
      }
    });

  }, [files, owner, userId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className='drop-zone'
        style={{backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa'}}
      >
        <input {...getInputProps()} />
        <img width="32" height="32" src="https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/external-download-ui-dreamstale-lineal-dreamstale.png" alt="external-download-ui-dreamstale-lineal-dreamstale"/>                {isDragActive ? (
          <p>Suelta los archivos aquí...</p>
        ) : (
          <p>Arrastra y suelta los archivos aquí o haz clic para seleccionar</p>
        )}
      </div>

      {files.length > 0 && (
        <div className='file-grid'>
          {files.map(fileData => (
            <div key={fileData.id} className='file-item'>
              <div style={{ flex: '1' }}>
                {getFilePreview(fileData.fileType, fileData.doc_encode)}
              </div>
              <div style={{ flex: '2', overflowY: 'auto', paddingTop: '10px' }}>
                <p><strong>Propietario:</strong> {fileData.owner}</p>
                <p><strong>Tipo de archivo:</strong> {getFileType(fileData.fileType)}</p>
                <p><strong>Fecha de creación:</strong> {new Date(fileData.creationDate).toLocaleString()}</p>
                <p><strong>Tamaño:</strong> {fileData.size} bytes</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default File;
