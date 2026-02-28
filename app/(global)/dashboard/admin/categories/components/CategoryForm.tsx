"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import { useCategory } from "@/context/category";
import React from "react";

const CategoryForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();

  const onSubmit = async () => {
    try {
      await addCategory();
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async () => {
    try {
      await updateCategory();
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async () => {
    try {
      await deleteCategory();
    } catch (err) {
      console.log(err);
    }
  };

  const onClearInput = () => {
    setValue("name", "");
    setValue("id", "");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex space-x-6 items-end"
    >
      <Input
        label="Kategori"
        id="name"
        placeholder="Contoh: Pakaian;"
        required
        register={register}
        errors={errors}
        onClear={watch("id") && onClearInput}
      />
      {watch("id") ? (
        <div className="  flex space-x-3 w-full ">
          <Button
            onClick={() => onUpdate()}
            type="button"
            variant="info"
            className="w-full"
          >
            Ubah
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onDelete()}
            className="w-full"
          >
            Hapus
          </Button>
        </div>
      ) : (
        <Button type="submit" className="w-full">
          Buat
        </Button>
      )}
    </form>
  );
};

export default CategoryForm;
