"use client";
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product } from "./product";
import toast from "react-hot-toast";

interface CartProviderProps {
  children: React.ReactNode;
}

interface CartContext {
  cartItems: Product[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (product: Product, quantity: number) => void;
  couponCode: string;
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  handleCoupon: (coupon: string) => void;
  percentOff: number;
  validCoupon: boolean;
  clearCart: () => void;
}
export const CartContext = createContext<CartContext | null>(null);

const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[] | []>([]);
  // coupons
  const [couponCode, setCouponCode] = useState<string>("");
  const [percentOff, setPercentOff] = useState<number>(0);
  const [validCoupon, setValidCoupon] = useState<boolean>(false);

  // load cart items from local storage on compoent mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // add item to cart
  const addToCart = (product: Product, quantity: number) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCartItems = cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity ? item.quantity + 1 : 1 }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  };
  //   remove item from cart
  const removeFromCart = (productId: string) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCartItems);

    // update localstorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  //   update item quantity in cart
  const updateCartQuantity = (product: Product, quantity: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === product.id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };

  const handleCoupon = async (coupon: string) => {
    try {
      const response = await fetch(`${process.env.API}/stripe/coupon`, {
        method: "POST",
        body: JSON.stringify({ couponCode: coupon }),
      });

      if (!response.ok) {
        setPercentOff(0);
        setValidCoupon(false);
        toast.error("Kupon tidak Valid");
        return;
      } else {
        const data = await response.json();
        setPercentOff(data.percent_off);
        setValidCoupon(true);
        toast.success(`Kupon ${data?.name} Berhasil DiGunakan`);
      }
    } catch (err) {
      console.log(err);
      setPercentOff(0);
      setValidCoupon(false);
      toast.error("Kupon Tidak Valid");
    }
  };

  const clearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        couponCode,
        setCouponCode,
        handleCoupon,
        percentOff,
        validCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
