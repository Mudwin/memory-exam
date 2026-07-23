import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSet } from "@/entities/set/model/useSet";
import { useObjects } from "@/entities/object/model/useObjects";
import ImageUploader from "@/shared/ui/ImageUploader";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import type { ObjectType, FieldValue } from "@/entities/object/model/types";
import styles from "./EditObjectPage.module.css";

const EditObjectPage = () => {
  const { setId, objectId } = useParams<{ setId: string; objectId: string }>();
  const navigate = useNavigate();

  const { set, objects, isLoading: setLoading } = useSet(setId);

  const { updateObject, deleteObject, loadObjectImage } = useObjects(
    setId || "",
    [],
  );

  const [object, setObject] = useState<ObjectType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!objectId || objects.length === 0) return;

    const found = objects.find((obj) => obj.id === objectId);

    if (found) {
      setObject(found);

      if (found.imageUrl) {
        setImagePreview(found.imageUrl);
      } else {
        loadObjectImage(objectId).then((url) => {
          if (url) setImagePreview(url);
        });
      }
    } else {
      setObject(null);
    }
  }, [objects, objectId, loadObjectImage]);

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
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: null,
      fieldValues: defaultFieldValues,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (object) {
      const values: Record<string, string> = {};
      object.fields.forEach((f) => {
        values[f.fieldId] = f.value;
      });

      reset({
        image: null,
        fieldValues: values,
      });
    }
  }, [object, reset]);

  const onSubmit = async (data: FormValues) => {
    if (!setId || !objectId || !object) return;

    const fieldsArray: FieldValue[] = fieldDefinitions.map((field) => ({
      fieldId: field.id,
      fieldName: field.name,
      value: String(data.fieldValues[field.id] ?? ""),
    }));

    try {
      await updateObject(objectId, {
        fields: fieldsArray,
        image: data.image || undefined,
      });
      navigate(`/collections/${setId}`);
    } catch (err) {}
  };

  const handleDelete = async () => {
    if (!objectId) return;
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.",
    );
    if (!confirmed) return;

    try {
      await deleteObject(objectId);
      navigate(`/collections/${setId}`);
    } catch (err) {}
  };

  const handleCancel = () => {
    navigate(`/collections/${setId}`);
  };

  if (setLoading) {
    return (
      <div className={styles.centerMessage}>
        <p>Загрузка...</p>
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

  if (!object) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>Объект не найден</p>
        <Button
          buttonType="save"
          onClick={() => navigate(`/collections/${setId}`)}
        >
          Вернуться к набору
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
      <h1 className={styles.title}>Редактирование объекта</h1>
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

                  if (object.imageUrl) {
                    setImagePreview(object.imageUrl);
                  } else {
                    setImagePreview(null);
                  }
                }}
                previewUrl={imagePreview}
                error={errors.image?.message as string}
              />
            )}
          />
          <p className={styles.hint}>
            Загрузите новое изображение, чтобы заменить текущее
          </p>
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
            disabled={!isDirty || !isValid}
          >
            Сохранить изменения
          </Button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Отмена
          </button>
          <Button buttonType="delete" type="button" onClick={handleDelete}>
            Удалить объект
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditObjectPage;
