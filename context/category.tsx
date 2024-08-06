"use client";
import React, { FC, createContext, useContext, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryContext {
  categories: Category[];
  loading: boolean;
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchCategories: () => void;
  fetchCategoriesPublic: () => void;
  addCategory: () => void;
  updateCategory: () => void;
  deleteCategory: () => void;
}

interface CategoryProviderProps {
  children: React.ReactNode;
}

export const categoryContext = createContext<CategoryContext | null>(null);

const CategoryProvider: FC<CategoryProviderProps> = ({ children }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      id: "",
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/admin/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { categories } = data;

      setCategories(categories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesPublic = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { categories } = data;

      setCategories(categories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.API}/admin/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: watch("name"),
        }),
      });

      if (!res.ok && res.status === 409) {
        toast.error(`Category ${watch("name")} Sudah Tersedia`);
        return;
      }
      const data = await res.json();
      const { newCategory } = data;

      toast.success("Tag Berhasil Dibuat");
      setCategories([newCategory, ...categories]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
    }
  };

  const updateCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.API}/admin/category/${watch("id")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: watch("name"),
          }),
        }
      );

      if (!res.ok) {
        toast.error(`Category ${watch("name")} Sudah Tersedia`);
        return;
      }

      const data = await res.json();
      const { tagUpdated } = data;

      setCategories(
        categories.map((tag) => {
          if (tag.id === tagUpdated.id) {
            return {
              ...tagUpdated,
            };
          }
          return tag;
        })
      );

      toast.success("Tag Berhasil Di Ubah");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
      setValue("id", "");
    }
  };

  const deleteCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.API}/admin/category/${watch("id")}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { tagDeleted } = data;

      setCategories(
        categories.filter((tag) => {
          return tag.id !== tagDeleted.id;
        })
      );

      toast.success("Tag Berhasil Di Hapus");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
      setValue("id", "");
    }
  };

  return (
    <categoryContext.Provider
      value={{
        categories,
        loading,
        register,
        handleSubmit,
        setValue,
        watch,
        errors,
        setCategories,
        setLoading,
        fetchCategories,
        fetchCategoriesPublic,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </categoryContext.Provider>
  );
};

export const useCategory = (): CategoryContext => {
  const context = useContext(categoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export default CategoryProvider;
