"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input/Input";
import Select from "@/app/components/Input/Select";
import TextArea from "@/app/components/Input/TextArea";
import { useCategory } from "@/context/category";
import { useProduct } from "@/context/product";
import { useTag } from "@/context/tag";
import Image from "next/image";
import React, { useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import FormImage from "./FormImage";
import Label from "@/app/components/Label";

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
    deleteImage,
    onClearField,
  } = useProduct();

  const { fetchCategories, categories } = useCategory();

  const { fetchTags, tags } = useTag();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const options = categories.map((category) => {
    return { value: category.id, label: category.name };
  });

  const selectedCategory = options.filter(
    (option) => option.value === watch("categoryId")
  );

  const colors = [
    {
      id: 1,
      name: "Merah",
      class: "bg-red-500",
    },
    {
      id: 2,
      name: "Biru",
      class: "bg-blue-500",
    },
    {
      id: 3,
      name: "Kuning",
      class: "bg-yellow-500",
    },
    {
      id: 4,
      name: "Orange",
      class: "bg-orange-500",
    },
    {
      id: 5,
      name: "Hijau",
      class: "bg-green-500",
    },
    {
      id: 6,
      name: "Ungu",
      class: "bg-purple-500",
    },
  ];

  return (
    <form onSubmit={handleSubmit(addProduct)} className="flex space-x-6">
      <section className="bg-white shadow-sidebar rounded-lg w-2/3 p-6">
        <div className="flex space-x-6">
          <Input
            label="Judul"
            id="title"
            placeholder="Masukan Judul"
            register={register}
            errors={errors}
          />
          <Input
            label="Brand"
            id="brand"
            placeholder="Masukan Brand"
            register={register}
            errors={errors}
          />
        </div>
        <TextArea
          label="Deskripsi"
          id="description"
          placeholder="Masukan Deskripsi Produk"
          register={register}
          rows={7}
          errors={errors}
        />
        <div className="flex space-x-6">
          <Input
            label="Harga"
            id="price"
            type="number"
            placeholder="Masukan Title"
            onChange={() => console.log(watch("price"))}
            register={register}
            errors={errors}
          />
          <Input
            label="Harga Awal"
            id="previousPrice"
            type="number"
            placeholder="Masukan Brand"
            register={register}
            errors={errors}
          />
        </div>
        <p>Warna</p>
        <div className="flex space-x-2 mt-3">
          {colors.map((color) => (
            <label
              htmlFor={color.name}
              key={color.id}
              className={`flex items-center w-8 h-8 space-x-2 ${color.class}  rounded-full`}
              style={{ backgroundColor: color.class }}
            >
              {watch("color").includes(color.name) && (
                <FaCheck className="text-white mx-auto" />
              )}
              <input
                type="checkbox"
                name="color"
                hidden
                id={color.name}
                value={color.name}
                className="checked:bg-red-500"
                onChange={(e) => {
                  const colors = watch("color");
                  if (colors.includes(color.name)) {
                    setValue(
                      "color",
                      colors.filter((c: string) => c !== color.name)
                    );
                  } else {
                    setValue("color", [...colors, color.name]);
                  }
                }}
              />
            </label>
          ))}
        </div>

        <div className="flex">
          <div className="flex-1">
            <Button variant="border" onClick={onClearField}>
              Batal
            </Button>
          </div>
          {watch("id") ? (
            <div className="flex-1 flex justify-end space-x-3">
              <Button type="button" variant="info" onClick={updateProduct}>
                Ubah
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex justify-end space-x-3">
              <Button variant="grey">Simpan Sebagai Draft</Button>
              <Button type="submit">Bagikan</Button>
            </div>
          )}
        </div>
      </section>

      <section className="w-1/3  ">
        <div className="bg-white p-6 shadow-sidebar rounded-lg">
          <Select
            id="categoryId"
            options={options}
            setValue={setValue}
            defaultValue={selectedCategory[0]}
            errors={errors}
            label="Category"
            onClear={() => setValue("tagIDs", [])}
          />

          {watch("categoryId") && (
            <ul className="flex justify-center flex-wrap space-x-3 mt-3 ">
              {tags
                .filter((tag) => tag.categoryId === watch("categoryId"))
                .map((tag) => (
                  <Label
                    onClick={() => {
                      if (watch("tagIDs").includes(tag.id)) {
                        setValue(
                          "tagIDs",
                          watch("tagIDs").filter((id: any) => id !== tag.id)
                        );
                      } else {
                        setValue("tagIDs", [tag.id, ...watch("tagIDs")]);
                      }
                    }}
                  >
                    {tag?.name}
                    {watch("tagIDs").includes(tag.id) && (
                      <FaCheck className="text-white mx-auto ml-1" />
                    )}
                  </Label>
                ))}
            </ul>
          )}

          <FormImage />
        </div>
      </section>
    </form>
  );
};

export default ProductForm;
