import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onSelectedFile: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onSelectedFile }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const [file] = acceptedFiles;

      const fileUrl = URL.createObjectURL(file);

      onSelectedFile(file);
      setSelectedFileUrl(fileUrl);
    },
    [onSelectedFile]
  );
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 2097152,
    accept: 'image/jpeg, image/pjpeg, image/png, image/gif',
  });

  return (
    <div
      title="Imagem do estabelecimento"
      className="dropzone"
      {...getRootProps()}
    >
      <input
        {...getInputProps()}
        accept="image/jpeg, image/pjpeg, image/png, image/gif"
      />

      {!selectedFileUrl && isDragAccept && (
        <p>
          <FiUpload />
          Solte os arquivos aqui
        </p>
      )}

      {selectedFileUrl ? (
        <img
          src={selectedFileUrl}
          alt="Point thumbnail"
          title="Imagem do estabelecimento"
        />
      ) : (
        <p>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
