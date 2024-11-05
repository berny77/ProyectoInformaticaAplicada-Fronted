import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Document from '../../model/Document';
import { getFileType } from './fileGridFns';
import { getFileLogo } from './FileLogo';
import '../../styles/FileGrid.scss';

export const getFilePreview = (fileType: string, base64: string) => {
  if (fileType.includes('image')) {
    return <img src={`data:${fileType};base64,${base64}`} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />;
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
}

const File: React.FC = () => {
  const [sessionData, setSessionData] = useState(JSON.parse(sessionStorage.getItem('sessionData')!));
  const [files, setFiles] = useState<Array<Document>>([]);
  const [loading, setLoading] = useState(false);
  const fileLimit = 6;

  const setUserFiles = async () => {
    setLoading(true);
    if (sessionData) {
      const dataResponse = await getUserFiles(Number.parseInt(sessionData.userId), sessionData.token);
      if (dataResponse) {
        const { data } = dataResponse;
        setFiles(data);
        setLoading(false);
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
            doc_encode: base64String.split(',')[1]
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

  return (
    <div className='col-12'>
      <div
        {...getRootProps()}
        className='drop-zone'
        style={{ backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa' }}
      >
        <input {...getInputProps()} />
          <div className='d-flex justify-content-center'><a className="d-flex align-items-center justify-content-center"><span className="fa fa-file-arrow-up"></span></a></div>
        {isDragActive ? (
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
                <p><strong>Tamaño:</strong> {Math.trunc((Number.parseInt(fileData.size) / 1024))} kb</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='d-flex justify-content-center loading-div'>
        {loading && (
          <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default File;
