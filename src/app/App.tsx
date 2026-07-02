import testPreview1 from "@/assets/images/44.jpg";
import testPreview2 from "@/assets/images/48.jpg";
import testPreview3 from "@/assets/images/50.jpg";
import ImageCard from "@/components/ImageCard";
import TestButton from "@/components/TestButton";
import NextButton from "@/components/NextButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import NavButton from "@/components/NavButton";
import gridIcon from "@/assets/icons/grid-icon.svg";
import FileInput from "@/components/FileInput";

function App() {
  return (
    <div className="app-container">
      <ImageCard
        srcUrl={testPreview1}
        title="Апофеоз войны"
        author="Василий Верещагин"
      />
      <ImageCard
        srcUrl={testPreview2}
        title="После побоища Игоря Святославича с половцами"
        author="Виктор Васнецов"
      />
      <ImageCard
        srcUrl={testPreview3}
        title="Царевна-Лебедь"
        author="Михаил Врубель"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <TestButton answer="Тестовый ответ" />
        <TestButton answer="Правильный ответ" answerStatus="correct" />
        <TestButton answer="Неправильный ответ" answerStatus="error" />
      </div>
      <NextButton />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Button buttonType="save">Сохранить</Button>
        <Button buttonType="delete">Удалить</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Input
          id="test-input1"
          type="text"
          placeholder="Введите название поля..."
        />
        <Input
          id="test-input2"
          type="text"
          placeholder="Введите название поля..."
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <NavButton iconSrc={gridIcon} page="View cards" state="open">
          Просмотр
        </NavButton>
        <NavButton iconSrc={gridIcon} page="View cards" state="closed">
          Просмотр
        </NavButton>
      </div>
      <FileInput />
      <FileInput />
    </div>
  );
}

export default App;
