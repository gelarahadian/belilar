"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import Select from "@/app/components/Input/Select";
import { useCategory } from "@/context/category";
import { useTag } from "@/context/tag";
import React, { useEffect } from "react";
import { FieldValues } from "react-hook-form";

const TagForm = () => {
  const { categories, fetchCategories } = useCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    addTag,
    updateTag,
    deleteTag,
  } = useTag();

  useEffect(() => {
    fetchCategories();
  }, []);

  const options = categories.map((category) => {
    return { value: category.id, label: category.name };
  });

  const selectedCategory = options.filter(
    (option) => option.value === watch("categoryId")
  );

  const onSubmit = async (data: FieldValues) => {
    try {
      await addTag();
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async () => {
    try {
      await updateTag();
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async () => {
    try {
      await deleteTag();
    } catch (err) {
      console.log(err);
    }
  };

  const onClearInput = () => {
    setValue("name", "");
    setValue("id", "");
    setValue("categoryId", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className=" ">
      <div className="flex space-x-6 items-end">
        <Input
          label="Tag"
          id="name"
          placeholder="Contoh: Kamera;"
          required="Tag Harus Diisi"
          register={register}
          errors={errors}
          onClear={watch("id") && onClearInput}
        />
        <Select
          label="Pilih Kategori"
          options={options}
          defaultValue={selectedCategory[0]}
          required="Kategori harus Di Pilih"
          setValue={setValue}
          errors={errors}
          id="categoryId"
        />
      </div>
      {watch("id") ? (
        <div className="  flex space-x-3 w-full justify-end">
          <Button onClick={() => onUpdate()} type="button" variant="info">
            Ubah
          </Button>
          <Button type="button" variant="danger" onClick={() => onDelete()}>
            Hapus
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button type="submit">Buat</Button>
        </div>
      )}
    </form>
  );
};

export default TagForm;
