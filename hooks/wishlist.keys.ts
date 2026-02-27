export const wishlistKeys = {
  all: ["wishlist"] as const,
  list: () => [...wishlistKeys.all, "list"] as const,
};
