import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { setApi } from "@/entities/set/api/setApi";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useToastContext } from "@/app/providers/ToastProvider";
import styles from "./EditSetPage.module.css";

const editSetSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"]),
});

type EditSetFormValues = z.infer<typeof editSetSchema>;

const EditSetPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, isLoading, refresh } = useSet(setId);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<EditSetFormValues>({
    resolver: zodResolver(editSetSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  });

  const visibility = watch("visibility");

  useEffect(() => {
    if (set) {
      setValue("title", set.title);
      setValue("description", set.description || "");
      setValue("visibility", set.visibility);

      if (set.visibility === "public" && set.shareId) {
        setShareLink(`${window.location.origin}/s/${set.shareId}`);
      } else {
        setShareLink(null);
      }
    }
  }, [set, setValue]);

  const onSubmit = async (data: EditSetFormValues) => {
    if (!setId) return;
    setIsSaving(true);
    try {
      await setApi.updateSet(setId, {
        title: data.title,
        description: data.description,
        visibility: data.visibility,
      });

      showSuccess("Изменения сохранены");
      await refresh();

      if (data.visibility === "public" && set?.shareId) {
        setShareLink(`${window.location.origin}/s/${set.shareId}`);
      } else {
        setShareLink(null);
      }
      navigate(`/collections/${setId}`);
    } catch (err) {
      console.error("Ошибка обновления набора", err);
      showError("Не удалось сохранить изменения");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!setId) return;

    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот набор? Все объекты и изображения будут удалены безвозвратно.",
    );

    if (!confirmed) return;

    try {
      await setApi.deleteSet(setId);
      showSuccess("Набор удалён");
      navigate("/collections");
    } catch (err) {
      console.error("Ошибка удаления набора", err);
      showError("Не удалось удалить набор");
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const handleCancel = () => {
    navigate(`/collections/${setId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p>Загрузка набора...</p>
      </div>
    );
  }

  if (!set) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>Набор не найден</p>
        <Button buttonType="save" onClick={() => navigate("/collections")}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Редактирование набора</h1>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            Название
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Введите название набора"
            {...register("title")}
            error={errors.title?.message}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Описание (необязательно)
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Краткое описание"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Доступ</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" value="private" {...register("visibility")} />
              Приватный
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" value="public" {...register("visibility")} />
              Публичный
            </label>
          </div>
        </div>

        {visibility === "public" && shareLink && (
          <div className={styles.shareSection}>
            <label className={styles.label}>Публичная ссылка</label>
            <div className={styles.linkContainer}>
              <Input
                type="text"
                value={shareLink}
                readOnly
                className={styles.linkInput}
              />
              <Button buttonType="save" type="button" onClick={handleCopyLink}>
                {copySuccess ? "Скопировано" : "Копировать"}
              </Button>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            buttonType="save"
            type="submit"
            disabled={isSaving || !isValid || !isDirty}
          >
            Сохранить
          </Button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Отмена
          </button>
          <Button buttonType="delete" type="button" onClick={handleDelete}>
            Удалить набор
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSetPage;
