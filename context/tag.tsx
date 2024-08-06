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

interface Tag {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TagContextProps {
  tags: Tag[];
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors;
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  fetchTags: () => void;
  fetchTagsPublic: () => void;
  addTag: () => void;
  updateTag: () => void;
  deleteTag: () => void;
}

interface TagProviderProps {
  children: React.ReactNode;
}

export const TagContext = createContext<TagContextProps | null>(null);

const TagProvider: FC<TagProviderProps> = ({ children }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      categoryId: "",
      id: "",
    },
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/admin/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTags(await res.json());
      console.log(tags);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTagsPublic = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTags(await res.json());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addTag = async () => {
    try {
      const res = await fetch(`${process.env.API}/admin/tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: watch("name"),
          categoryId: watch("categoryId"),
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Tag Sudah Tersedia");
        } else if (res.status === 400) {
          toast.error("Category Harus Di Pilih");
        } else {
          toast.error("Terjadi Kesalahan Coba Lagi");
        }
        return;
      }
      const data = await res.json();
      const { tag } = data;

      setTags([tag, ...tags]);

      toast.success("Tag Berhasil Dibuat");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
    }
  };

  const updateTag = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/admin/tag/${watch("id")}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: watch("name"),
          categoryId: watch("categoryId"),
        }),
      });

      if (!res.ok) {
        toast.error(`Tag ${watch("name")} Sudah Tersedia`);
        return;
      }

      const data = await res.json();
      const { tagUpdated } = data;

      setTags(
        tags.map((tag) => {
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
      toast.error("Terjadi Kesalahan Coba Lagi");
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
      setValue("categoryId", "");
      setValue("id", "");
    }
  };

  const deleteTag = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/admin/tag/${watch("id")}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { tagDeleted } = data;

      setTags(
        tags.filter((tag) => {
          return tag.id !== tagDeleted.id;
        })
      );

      toast.success("Tag Berhasil Di Hapus");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setValue("name", "");
      setValue("categoryId", "");
      setValue("id", "");
    }
  };

  return (
    <TagContext.Provider
      value={{
        tags,
        register,
        handleSubmit,
        setValue,
        watch,
        errors,
        setTags,
        fetchTags,
        fetchTagsPublic,
        addTag,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = (): TagContextProps => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export default TagProvider;
