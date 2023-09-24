"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global {
  var cloudinary: any;
}

const uploadPreset = "tfkxcvc4";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  // Function for a successful upload.
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset="tfkxcvc4"
      options={{
        maxFiles: 1,
      }}
    >
      {/*Destructure open   */}
      {({ open }) => {
        return (
          <div
            // Call open on click and execute it (it might not exist,  therefore the ? )
            onClick={() => open?.()}
            className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2 
              p-20 
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
            "
          >
            {/* This is the icon that shows inside the rectangle where you upload the photo. */}
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {/* Render the image inside the div.
            The image was uploaded from next/image already. */}
            {value && (
              <div
                className="
              absolute inset-0 w-full h-full"
              >
                {/* Clicking on the image opens the Cloudinary widget. */}
                <Image
                  fill
                  style={{ objectFit: "cover" }}
                  src={value}
                  alt="Uploaded image"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
