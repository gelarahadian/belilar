import { useProduct } from "@/context/product";
import Image from "next/image";
import React from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const FormImage = () => {
  const { watch, uploadImages, deleteImage } = useProduct();
  return (
    <div className="space-y-3">
      <div className="flex w-full h-60  space-x-3 mt-6 ">
        <div className="flex-1 flex justify-center flex-col  items-center border relative">
          {watch("images")[3] ? (
            <>
              <Image
                src={watch("images")[3].secure_url}
                alt="image-product"
                fill
                className="object-cover object-center"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white "
                onClick={() => deleteImage(watch("images")[3].public_id)}
                type="button"
              >
                <MdDelete className="text-xl" />
              </button>
            </>
          ) : (
            <label className="text-secondaryText text-center cursor-pointer">
              <CiImageOn className="w-6 h-6 mx-auto mb-2 " />
              <input
                type="file"
                multiple
                accept="images/*"
                hidden
                onChange={uploadImages}
              />
              jatuhkan gambar Anda atau klik untuk menelusuri
            </label>
          )}
        </div>
        <div className="flex-1 flex flex-col space-y-3">
          <div className=" flex-1 border relative">
            {watch("images")[0] && (
              <>
                <Image
                  src={watch("images")[0].secure_url}
                  alt="image-product"
                  fill
                  className="object-cover object-center"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white "
                  type="button"
                  onClick={() => deleteImage(watch("images")[0].public_id)}
                >
                  <MdDelete className="text-xl" />
                </button>
              </>
            )}
          </div>
          <div className="flex-1 border relative">
            {watch("images")[1] && (
              <>
                <Image
                  src={watch("images")[1].secure_url}
                  alt="image-product"
                  fill
                  className="object-cover object-center"
                />
                <button
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white "
                  type="button"
                  onClick={() => deleteImage(watch("images")[0].public_id)}
                >
                  <MdDelete className="text-xl" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border w-full h-28 relative">
        {watch("images")[2] && (
          <>
            <Image
              src={watch("images")[2].secure_url}
              alt="image-product"
              fill
              className="object-cover object-center"
            />
            <button
              className="absolute top-2 right-2 p-2 bg-red-500 text-white "
              onClick={() => deleteImage(watch("images")[0].public_id)}
              type="button"
            >
              <MdDelete className="text-xl" />
            </button>
          </>
        )}
      </div>
      <div className=" flex items-center text-gray-500 text-secondaryText">
        <AiOutlineExclamationCircle className="mr-1" />{" "}
        <p>Memasukan Photo Maximal 4</p>
      </div>
    </div>
  );
};

export default FormImage;
