import testPreview1 from "@/assets/images/44.jpg";
import testPreview2 from "@/assets/images/48.jpg";
import testPreview3 from "@/assets/images/50.jpg";
import ImageCard from "@/components/ImageCard";
import TestButton from "@/components/TestButton";

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
        <TestButton answer="Тестовый ответ" answerStatus="correct" />
        <TestButton answer="Тестовый ответ" answerStatus="error" />
      </div>
    </div>
  );
}

export default App;
