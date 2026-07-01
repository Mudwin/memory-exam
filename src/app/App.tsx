import testPreview1 from "@/assets/images/44.jpg";
import testPreview2 from "@/assets/images/48.jpg";
import testPreview3 from "@/assets/images/50.jpg";
import ImageCard from "@/components/ImageCard";

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
    </div>
  );
}

export default App;
