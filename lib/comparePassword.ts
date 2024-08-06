import bcrypt from "bcrypt";

export const comparePassword = async (
  password: string,
  hashPassword: string
) => {
  return await bcrypt.compare(password, hashPassword);
};
