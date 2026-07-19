import { useState, useRef, type ChangeEvent } from "react";
import csvIcon from "@/assets/icons/csv-icon.svg";
import styles from "./FileInput.module.css";

const FileInput = () => {
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={styles.container}
      onClick={onAreaClick}
      style={file ? { outlineColor: "var(--primary-color-green)" } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        className={styles.hiddenInput}
        accept=".csv, .xlsx"
        onChange={handleFileChange}
      />

      {file ? (
        <div className={styles.area}>
          <img src={csvIcon} alt="" className={styles.icon} />
          <span className={styles.fileName}>{file.name}</span>
          <span className={styles.fileSize}>
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
      ) : (
        <div className={styles.area}>
          <p className={styles.placeholderText}>
            Загрузить .csv или .xlsx файл
          </p>
        </div>
      )}
    </div>
  );
};

export default FileInput;
