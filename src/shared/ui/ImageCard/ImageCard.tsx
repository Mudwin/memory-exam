import styles from "./ImageCard.module.css";

interface ImageCardProps {
  srcUrl: string;
  title: string;
  author: string;
}

const ImageCard = ({ srcUrl, title, author }: ImageCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src={srcUrl} alt="" />
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.author}>{author}</div>
      </div>
    </div>
  );
};

export default ImageCard;
