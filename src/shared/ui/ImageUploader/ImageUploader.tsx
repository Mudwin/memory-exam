import { useState, useRef, type ChangeEvent } from "react";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  previewUrl?: string | null;
  error?: string;
}

const ImageUploader = ({
  onFileSelect,
  onRemove,
  previewUrl,
  error,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect(file);
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) onRemove();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      {preview ? (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Превью" className={styles.preview} />
          <div className={styles.overlay}>
            <button
              type="button"
              className={styles.changeButton}
              onClick={handleClick}
            >
              Сменить
            </button>
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemove}
            >
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.uploadArea} onClick={handleClick}>
          <div className={styles.icon}>🖼️</div>
          <p className={styles.text}>Нажмите, чтобы загрузить изображение</p>
          <p className={styles.subtext}>Поддерживаются JPG, PNG, WebP</p>
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default ImageUploader;
