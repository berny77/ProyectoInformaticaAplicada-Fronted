import React, { useState, useEffect } from 'react';


const useAuth = () => {
  return { userId: 1, userName: 'Usuario Ejemplo' }; 
};

const File: React.FC = () => {
  const { userId, userName } = useAuth(); 
  const [files, setFiles] = useState<Array<{
    id: number;
    owner: string;
    fileType: string;
    creationDate: string;
    size: number;
    base64: string;
  }>>([]);
  const [owner, setOwner] = useState<string>(userName || ''); 
  const fileLimit = 6;

  useEffect(() => {
    console.log('ID del usuario logueado:', userId);
  }, [userId]);

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
      
      if (files.length + selectedFiles.length > fileLimit) {
        alert(`Solo puedes cargar un máximo de ${fileLimit} archivos.`);
        return;
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
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

        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = reader.result as string;
          const newFileData = {
            id: files.length + newFiles.length,
            owner: owner || 'Propietario desconocido',
            fileType: file.type.split('/')[1].toUpperCase(), 
            creationDate: new Date().toISOString(),
            size: file.size,
            base64: base64String.split(',')[1] 
          };

          newFiles.push(newFileData);
          if (newFiles.length === selectedFiles.length) {
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);

            const formattedFiles = updatedFiles.map(fileData => ({
              Owner: fileData.owner,
              FileType: fileData.fileType,
              CreationDate: fileData.creationDate,
              Size: fileData.size,
              Doc_encode: fileData.base64 
            }));

            try {
              const response = await fetch(`https://localhost:7001/api/MemPoolDocument/${userId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedFiles),
              });

              if (response.ok) {
                console.log('Documentos guardados exitosamente en la base de datos.');
              } else {
                console.error('Error al guardar los documentos:', response.statusText);
              }
            } catch (error) {
              console.error('Error de conexión:', error);
            }
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
