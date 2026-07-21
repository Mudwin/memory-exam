import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/shared/ui/Modal/Modal";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import styles from "./CreateSetModal.module.css";

const createSetSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"]).default("private"),
});

type CreateSetFormValues = z.infer<typeof createSetSchema>;

interface CreateSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSetFormValues) => void;
  isLoading?: boolean;
}

const CreateSetModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateSetModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateSetFormValues>({
    resolver: zodResolver(createSetSchema),
    mode: "onChange",
    defaultValues: {
      visibility: "private",
    },
  });

  const onFormSubmit = (data: CreateSetFormValues) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать набор">
      <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
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
              <input
                type="radio"
                value="private"
                {...register("visibility")}
                defaultChecked
              />
              Приватный
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" value="public" {...register("visibility")} />
              Публичный
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            buttonType="save"
            type="submit"
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Создание..." : "Создать"}
          </Button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            Отмена
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSetModal;
