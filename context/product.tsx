"use client";
import {
  Category,
  Image,
  Product as PrismaProduct,
  Rating,
  Tag,
} from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { useRouter } from "next/navigation";
import React, {
  FC,
  FormEvent,
  FormEventHandler,
  createContext,
  useContext,
  useState,
} from "react";
import {
  Field,
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import FileResizer from "react-image-file-resizer";

interface ProductImage {
  public_id: string;
  secure_url: string;
}

export interface Product extends PrismaProduct {
  quantity?: number;
  tags?: Tag[];
  category?: Category;
  ratings?: Rating[];
  images: Image[];
}

interface ProductContext {
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  brands: { brand: string }[];
  setBrands: React.Dispatch<React.SetStateAction<{ brand: string }[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  imageModal: ProductImage | null;
  setImageModal: React.Dispatch<React.SetStateAction<ProductImage | null>>;
  showRatingModal: boolean;
  setShowRatingModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentRating: number;
  setCurrentRating: React.Dispatch<React.SetStateAction<number>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  productSearchQuery: string;
  setProductSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  productSearchResults: Product[];
  setProductSearchResults: React.Dispatch<React.SetStateAction<Product[]>>;
  onClearField: () => void;
  fetchProducts: () => void;
  fetchBrands: () => void;
  addProduct: () => void;
  updateProduct: () => void;
  deleteProduct: () => void;
  uploadImages: (e: any) => void;
  deleteImage: (public_id: string) => void;
  openImageModal: (image: ProductImage) => void;
  closeImageModal: () => void;
  fetchProductSearchResults: (e?: FormEvent<HTMLFormElement>) => void;
}

interface ProductProviderContext {
  children: React.ReactNode;
}

export const productContext = createContext<ProductContext | null>(null);

const ProductProvider: FC<ProductProviderContext> = ({ children }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      id: "",
      title: "",
      description: "",
      price: 0,
      previousPrice: 0,
      images: [],
      color: [],
      brand: "",
      categoryId: "",
      tagIDs: [],
    },
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ brand: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  // image preview modal
  const [imageModal, setImageModal] = useState<ProductImage | null>(null);
  // rating system
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  // text based search
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [productSearchResults, setProductSearchResults] = useState<
    Product[] | []
  >([]);
  // const submitRating = async () => {
  //   if(status !== 'authenticated')
  // }

  const uploadImages = (e: any) => {
    const files = e.target.files;
    console.log(files);

    const allUploadedFiles = watch("images") || [];

    if (files) {
      const totalFiles = files.length + allUploadedFiles.length;
      if (totalFiles > 4) {
        alert("Jumlah gambar tidak boleh lebih dari 4");
        return;
      }
    }

    setUploading(true);
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const promise = new Promise<void>((resolve) => {
        FileResizer.imageFileResizer(
          file,
          1280,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            fetch(`${process.env.API}/admin/upload/image`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ image: uri }),
            })
              .then((response) => response.json())
              .then((data) => {
                allUploadedFiles.unshift(data);
                resolve();
              })
              .catch((err) => {
                console.log("CLOUDINARY UPLOAD ERR", err);
                resolve();
              });
          },
          "base64"
        );
      });
      uploadPromises.push(promise);
    }

    Promise.all(uploadPromises).then(() => {
      watch("images", allUploadedFiles);
      setUploading(false);
    });
  };

  const deleteImage = async (public_id: string) => {
    setUploading(true);
    try {
      const res = await fetch(`${process.env.API}/admin/upload/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id }),
      });

      if (!res.ok) {
        toast.error("Gagal Menhapus Gambar");
        return;
      }

      const filteredImage = watch("images").filter((image: any) => {
        return image.public_id !== public_id;
      });
      setValue("images", filteredImage);
      toast.success("Hapus Photo Produk Berhasil");
    } catch (e) {
      toast.error("Image delete failed");
      console.log("CLOUDINARY DELETE ERR", e);
    } finally {
      setUploading(false);
    }
  };

  const onClearField = () => {
    setValue("id", "");
    setValue("title", "");
    setValue("description", "");
    setValue("price", 0);
    setValue("previousPrice", 0);
    setValue("images", []);
    setValue("color", []);
    setValue("brand", "");
    setValue("categoryId", "");
    setValue("tagIDs", []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.API}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      const { products } = data;

      setProducts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.API}/product/brands`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    setLoading(true);
    console.log(watch("title"));
    try {
      const res = await fetch(`${process.env.API}/admin/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: watch("title"),
          description: watch("description"),
          price: watch("price"),
          previousPrice: watch("previousPrice"),
          images: watch("images"),
          color: watch("color"),
          brand: watch("brand"),
          shipping: watch("shipping"),
          categoryId: watch("categoryId"),
          tagIDs: watch("tagIDs"),
        }),
      });

      if (!res.ok) {
        toast.error("Product Gagal Dibuat");
        return;
      }
      console.log(watch());

      const data = await res.json();
      const { newProduct } = data;
      setProducts([newProduct, ...products]);
      toast.success("Berhasil Membuat Product");
    } catch (e) {
      console.log(e);
      toast.error("Gagal Membuat Product");
    } finally {
      setLoading(false);
      onClearField();
    }
  };

  const updateProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.API}/admin/product/${watch("id")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: watch("title"),
            slug: watch("slug"),
            description: watch("description"),
            price: watch("price"),
            previousPrice: watch("previousPrice"),
            images: watch("images"),
            color: watch("color"),
            brand: watch("brand"),
            shipping: watch("shipping"),
            categoryId: watch("categoryId"),
            tagIDs: watch("tagIDs"),
          }),
        }
      );

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { productUpdated } = data;

      console.log(productUpdated);
      console.log(watch());

      setProducts(
        products.map((product) => {
          if (product.id === productUpdated.id) {
            return productUpdated;
          }
          return product;
        })
      );
      toast.success("Berhasil Memperbarui Product");
      router.push("/dashboard/admin/products");
    } catch (e) {
      console.log(e);
      toast.error("Gagal Memperbarui Product");
    } finally {
      setLoading(false);
      onClearField();
    }
  };

  const deleteProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.API}/admin/product/${watch("id")}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        toast.error("Terjadi Kesalahan Coba Lagi");
        return;
      }

      const data = await res.json();
      const { productDeleted } = data;
      setProducts(
        products.filter((product) => {
          return product.id !== productDeleted.id;
        })
      );
      toast.success("Product Berhasil Di Hapus");
    } catch (e) {
      console.log(e);
      toast.error("Gagal Menghapus Product");
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (image: ProductImage) => {
    setImageModal(image);
  };

  const fetchProductSearchResults = async (e?: FormEvent<HTMLFormElement>) => {
    e && e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.API}/search/products?productSearchQuery=${productSearchQuery}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching product search results");
      }

      const data = await response.json();
      setProductSearchResults(data.products);
      router.push(`/search/products?productSearchQuery=${productSearchQuery}`);
    } catch (err) {
      console.log(err);
    }
  };
  const closeImageModal = () => {
    setImageModal(null);
  };
  return (
    <productContext.Provider
      value={{
        register,
        handleSubmit,
        setValue,
        watch,
        errors,
        products,
        setProducts,
        brands,
        setBrands,
        loading,
        setLoading,
        imageModal,
        setImageModal,
        showRatingModal,
        setShowRatingModal,
        currentRating,
        setCurrentRating,
        comment,
        productSearchQuery,
        setProductSearchQuery,
        productSearchResults,
        setProductSearchResults,
        setComment,
        onClearField,
        fetchProducts,
        fetchBrands,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadImages,
        deleteImage,
        openImageModal,
        closeImageModal,
        fetchProductSearchResults,
      }}
    >
      {children}
    </productContext.Provider>
  );
};

export const useProduct = (): ProductContext => {
  const context = useContext(productContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
};

export default ProductProvider;
