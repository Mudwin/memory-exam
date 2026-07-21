import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useSets } from "@/entities/set/model/useSets";
import SetCard from "@/entities/set/ui/SetCard/SetCard";
import CreateSetModal from "@/features/create-set/ui/CreateSetModal/CreateSetModal";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import styles from "./CollectionsPage.module.css";

type FilterType = "all" | "public" | "private";

const CollectionsPage = () => {
  const { sets, isLoading, error, createSet } = useSets();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSets = useMemo(() => {
    let result = sets;

    if (filter === "public") {
      result = result.filter((s) => s.visibility === "public");
    } else if (filter === "private") {
      result = result.filter((s) => s.visibility === "private");
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((s) => s.title.toLowerCase().includes(query));
    }

    return result;
  }, [sets, filter, searchQuery]);

  const handleCreateSet = async (data: {
    title: string;
    description?: string;
    visibility: "private" | "public";
  }) => {
    try {
      const newSet = await createSet(data);
      setIsModalOpen(false);

      navigate(`/collections/${newSet.id}`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p>Загрузка наборов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>{error}</p>
        <Button buttonType="save" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Мои наборы</h1>
          <span className={styles.count}>
            {sets.length} {sets.length === 1 ? "набор" : "наборов"}
          </span>
        </div>
        <Button buttonType="save" onClick={() => setIsModalOpen(true)}>
          + Создать набор
        </Button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            Все
          </button>
          <button
            className={`${styles.filterButton} ${filter === "public" ? styles.active : ""}`}
            onClick={() => setFilter("public")}
          >
            Публичные
          </button>
          <button
            className={`${styles.filterButton} ${filter === "private" ? styles.active : ""}`}
            onClick={() => setFilter("private")}
          >
            Приватные
          </button>
        </div>
      </div>

      {filteredSets.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>
            {sets.length === 0 ? "У вас пока нет наборов" : "Наборы не найдены"}
          </p>
          <p className={styles.emptyDescription}>
            {sets.length === 0
              ? "Создайте первый набор, чтобы начать обучение"
              : "Попробуйте изменить фильтр или поисковый запрос"}
          </p>
          {sets.length === 0 && (
            <Button buttonType="save" onClick={() => setIsModalOpen(true)}>
              Создать набор
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      )}

      <CreateSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSet}
        isLoading={false}
      />
    </div>
  );
};

export default CollectionsPage;
