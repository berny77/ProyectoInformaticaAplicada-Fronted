import React, { useState } from 'react';

const File: React.FC = () => {
  const [files, setFiles] = useState<Array<{
    id: number;
    owner: string;
    fileType: string;
    creationDate: string;
    size: number;
    base64: string;
  }>>([]);
  const [owner, setOwner] = useState<string>('');
  const fileLimit = 6; // Límite de archivos por bloque

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles: Array<{
        id: number;
        owner: string;
        fileType: string;
        creationDate: string;
        size: number;
        base64: string;
      }> = [];
      
      
      // Validar el número de archivos seleccionados
      if (files.length + selectedFiles.length > fileLimit) {
        alert(`Solo puedes cargar un máximo de ${fileLimit} archivos.`);
        return;
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Validar el tipo de archivo
        const validTypes = [
          'text/plain',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/pdf',
          'image/jpeg',
          'image/png'
        ];
        if (!validTypes.includes(file.type)) {
          alert('Tipo de archivo no permitido. Selecciona un archivo de texto, Excel, PowerPoint, PDF o imagen.');
          continue;
        }

        // Leer el archivo como Base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const newFileData = {
            id: files.length + newFiles.length, // Asignar ID según la cantidad actual de archivos
            owner: owner || 'Propietario desconocido', // Usar el estado del propietario
            fileType: file.type,
            creationDate: new Date().toISOString(),
            size: file.size,
            base64: base64String.split(',')[1] // Extraer la parte Base64
          };

          newFiles.push(newFileData);

          // Actualizar el estado con todos los nuevos archivos
          if (newFiles.length === selectedFiles.length) {
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const getFilePreview = (fileType: string, base64: string) => {
    if (fileType.includes('image')) {
      return <img src={`data:${fileType};base64,${base64}`} alt="preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />;
    } else {
      return <div style={{ fontSize: '2em', textAlign: 'center', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>📄</div>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input type="file" accept=".txt,.docx,.xlsx,.pptx,.pdf,.jpg,.png" onChange={handleFileChange} multiple style={{ marginBottom: '10px', padding: '5px' }} />

      {files.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '10px',
          marginTop: '20px',
          maxWidth: '900px',
          width: '100%',
        }}>
          {files.map(fileData => (
            <div key={fileData.id} style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              width: '220px',
              height: '350px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ flex: '1' }}>
                {getFilePreview(fileData.fileType, fileData.base64)}
              </div>
              <div style={{ flex: '2', overflowY: 'auto', paddingTop: '10px' }}>
                <p><strong>Propietario:</strong> {fileData.owner}</p>
                <p><strong>Tipo de archivo:</strong> {fileData.fileType}</p>
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
