import { useParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSet } from "@/entities/set/model/useSet";
import { useObjects } from "@/entities/object/model/useObjects";
import ImageUploader from "@/shared/ui/ImageUploader";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { useToastContext } from "@/app/providers/ToastProvider";
import styles from "./NewObjectPage.module.css";

const NewObjectPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, isLoading: setLoading } = useSet(setId);
  const { createObject, isLoading: createLoading } = useObjects(
    setId || "",
    [],
  );
  const { showSuccess, showError } = useToastContext();

  const fieldDefinitions = set?.fields || [];

  const fieldShape: Record<string, z.ZodTypeAny> = {};
  fieldDefinitions.forEach((field) => {
    fieldShape[field.id] = z
      .string()
      .min(1, `Поле "${field.name}" обязательно`);
  });

  const schema = z.object({
    image: z.custom<File | null>((val) => val instanceof File || val === null),
    fieldValues: z.object(fieldShape),
  });

  type FormValues = z.infer<typeof schema>;

  const defaultFieldValues: Record<string, string> = {};
  fieldDefinitions.forEach((field) => {
    defaultFieldValues[field.id] = "";
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: null,
      fieldValues: defaultFieldValues,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    if (!setId) return;

    const fieldsArray = fieldDefinitions.map((field) => ({
      fieldId: field.id,
      fieldName: field.name,
      value: String(data.fieldValues[field.id] ?? ""),
    }));

    try {
      await createObject({
        fields: fieldsArray,
        image: data.image || undefined,
      });
      showSuccess("Объект добавлен");
      navigate(`/collections/${setId}`);
    } catch (err) {
      showError("Не удалось добавить объект");
    }
  };

  const handleCancel = () => {
    navigate(`/collections/${setId}`);
  };

  if (setLoading) {
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

  if (fieldDefinitions.length === 0) {
    return (
      <div className={styles.centerMessage}>
        <p>В этом наборе еще не определены поля.</p>
        <p className={styles.subMessage}>
          Сначала добавьте поля на странице набора.
        </p>
        <Button
          buttonType="save"
          onClick={() => navigate(`/collections/${setId}`)}
        >
          Вернуться к набору
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Добавление объекта</h1>
      <p className={styles.subtitle}>Набор: {set.title}</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.imageSection}>
          <label className={styles.label}>Изображение</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUploader
                onFileSelect={(file) => {
                  setValue("image", file, { shouldValidate: true });
                }}
                onRemove={() => {
                  setValue("image", null, { shouldValidate: true });
                }}
                previewUrl={
                  field.value ? URL.createObjectURL(field.value) : null
                }
                error={errors.image?.message as string}
              />
            )}
          />
        </div>

        <div className={styles.fieldsSection}>
          <label className={styles.label}>Значения полей</label>
          <div className={styles.fieldsGrid}>
            {fieldDefinitions.map((field) => (
              <div key={field.id} className={styles.fieldItem}>
                <label
                  htmlFor={`field-${field.id}`}
                  className={styles.fieldLabel}
                >
                  {field.name}
                </label>
                <Controller
                  name={`fieldValues.${field.id}` as const}
                  control={control}
                  render={({ field: inputField }) => (
                    <Input
                      id={`field-${field.id}`}
                      type="text"
                      value={String(inputField.value ?? "")}
                      onChange={(e) => {
                        inputField.onChange(e.target.value);
                      }}
                      error={errors.fieldValues?.[field.id]?.message as string}
                      placeholder={`Введите ${field.name}`}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            buttonType="save"
            type="submit"
            disabled={createLoading || !isValid}
          >
            Добавить объект
          </Button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewObjectPage;
