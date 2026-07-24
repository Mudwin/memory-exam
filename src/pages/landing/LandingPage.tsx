import { useNavigate } from "react-router";
import Button from "@/shared/ui/Button";
import monaLisaImage from "@/assets/images/mona-lisa.jpg";
import starryNightImage from "@/assets/images/starry-night.webp";
import screamImage from "@/assets/images/the-scream.jpg";
import heroImage from "@/assets/images/hero.png";
import setCreationImage from "@/assets/screenshots/set-creation.png";
import imagesImportImage from "@/assets/screenshots/images-import.png";
import examResultsImage from "@/assets/screenshots/exam-results.png";
import flashcardsIcon from "@/assets/icons/flashcards-icon.svg";
import testIcon from "@/assets/icons/test-icon.svg";
import examIcon from "@/assets/icons/exam-icon.svg";
import importIcon from "@/assets/icons/import-icon.svg";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>MemoryExam</span>
        </div>
        <Button buttonType="save" onClick={() => navigate("/login")}>
          Войти
        </Button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Создавайте <span className={styles.highlight}>учебные наборы</span>{" "}
            по изображениям
          </h1>
          <p className={styles.heroSubtitle}>
            Загружайте картинки, задавайте поля и изучайте материал в удобных
            режимах: карточки, тесты, экзамены и многое другое.
          </p>
          <Button buttonType="save" onClick={() => navigate("/register")}>
            Начать бесплатно
          </Button>
        </div>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="Пример работы приложения" />
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Почему MemoryExam?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src={flashcardsIcon} alt="Карточки" />
            </div>
            <h3>Карточки</h3>
            <p>
              Изучайте объекты с помощью флеш-карточек. Отмечайте, что
              запомнили, и возвращайтесь к сложным.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src={testIcon} alt="Тесты" />
            </div>
            <h3>Тесты</h3>
            <p>
              Проверяйте знания с вопросами на выбор. Сразу видите правильные
              ответы и ошибки.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src={examIcon} alt="Экзамены" />
            </div>
            <h3>Экзамен</h3>
            <p>
              Настраивайте параметры и сдавайте полноценный экзамен с
              результатами и анализом ошибок.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <img src={importIcon} alt="Импорт" />
            </div>
            <h3>Массовый импорт</h3>
            <p>
              Загружайте данные из CSV/Excel и изображения — наполняйте наборы
              за минуты.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Как это работает</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepImage}>
              <img src={setCreationImage} alt="Создание набора" />
            </div>
            <div className={styles.stepText}>
              <h3>Создайте набор</h3>
              <p>
                Задайте название, описание и тип доступа (приватный или
                публичный).
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepImage}>
              <img src={imagesImportImage} alt="Добавление объектов" />
            </div>
            <div className={styles.stepText}>
              <h3>Наполните контентом</h3>
              <p>
                Загружайте изображения, создавайте поля (автор, год, стиль, и
                т.д.) и заполняйте значения.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepImage}>
              <img src={examResultsImage} alt="Результаты обучения" />
            </div>
            <div className={styles.stepText}>
              <h3>Изучайте в любом режиме</h3>
              <p>
                Карточки, тесты, экзамен — выбирайте то, что подходит вам в
                данный момент.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.preview}>
        <h2 className={styles.sectionTitle}>Примеры карточек из набора </h2>
        <div className={styles.previewGrid}>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              <img src={monaLisaImage} id="mona-lisa" alt="Карточека набора" />
            </div>
            <div className={styles.previewFields}>
              <span>
                <strong>Название:</strong> Мона Лиза
              </span>
              <span>
                <strong>Автор:</strong> Леонардо да Винчи
              </span>
              <span>
                <strong>Год:</strong> 1503
              </span>
            </div>
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              <img
                src={starryNightImage}
                id="starry-night"
                alt="Карточека набора"
              />
            </div>
            <div className={styles.previewFields}>
              <span>
                <strong>Название:</strong> Звёздная ночь
              </span>
              <span>
                <strong>Автор:</strong> Винсент Ван Гог
              </span>
              <span>
                <strong>Год:</strong> 1889
              </span>
            </div>
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              <img src={screamImage} id="scream" alt="Карточка набора" />
            </div>
            <div className={styles.previewFields}>
              <span>
                <strong>Название:</strong> Крик
              </span>
              <span>
                <strong>Автор:</strong> Эдвард Мунк
              </span>
              <span>
                <strong>Год:</strong> 1893
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Готовы начать?</h2>
          <p>Создайте свой первый учебный набор уже сегодня</p>
          <Button buttonType="save" onClick={() => navigate("/register")}>
            Зарегистрироваться
          </Button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.logoText}>MemoryExam</span>
            <p>Платформа для визуального обучения</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="/">О проекте</a>
            <a href="/">Контакты</a>
            <a href="/">Политика конфиденциальности</a>
          </div>
          <div className={styles.footerCopy}>
            &copy; {new Date().getFullYear()} MemoryExam. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
