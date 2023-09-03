"use client";

import axios from "axios";
import { toast } from "react-hot-toast";
import { useState, useMemo } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Heading from "../reusable/Heading";
import Counter from "../inputs/Counter";
import Input from "../inputs/Input";
import CountrySelect from "../inputs/CountrySelect";
import CategoryInput from "../inputs/CategoryInput";
import ImageUpload from "../inputs/ImageUpload";
import { categories } from "../navbar/Categories";

import useRentModal from "@/app/hooks/useRentModal";
import { set } from "react-hook-form";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      deskCount: 1,
      privateOfficeCount: 1,
      //   Ensure that imageSrc is the same is in the prisma schema.
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const guestCount = watch("guestCount");
  const deskCount = watch("deskCount");
  const privateOfficeCount = watch("privateOfficeCount");
  const imageSrc = watch("imageSrc");

  const Map = useMemo(
    () =>
      dynamic(() => import("../reusable/Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      // If you are on the last step, change the label to "Create" and create your rental desk listing.
      return "Create";
    }
    // If you are not on the last step in the modal, then the label should be "Next".
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      // If you are on the first step, then there is no back button.
      return undefined;
    }
    // If you are not on the first step, then the label should be "Back".
    return "Back";
  }, [step]);

  // The body content is dynamic depending on the step you are on.
  // Body is a changeable variable, hence using "let" instead of "const".

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your nomad desk?"
        subtitle="Pick a category"
      />
      <div
        className="
        grid 
        grid-cols-1 
        md:grid-cols-2 
        gap-3
        max-h-[50vh]
        overflow-y-auto
      "
      >
        {/* Map over the categories with the icons "city", "island" etc. */}
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              // We accept the category on click, which is a string
              // Then we pass in an id of this input and a value to the setValue function

              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          onChange={(value) => setCustomValue("guestCount", value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests do you allow?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("deskCount", value)}
          value={deskCount}
          title="Desks"
          subtitle="How many desks do you have?"
        />
        <hr />
        <Counter
          onChange={(value) => setCustomValue("privateOfficeCount", value)}
          value={privateOfficeCount}
          title="Private Offices"
          subtitle="How many private offices do you have?"
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setCustomValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your desk space?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per day?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={rentModal.onClose}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      //   Check if you are on the first step. Then male sure that the secondary action doesn't exist and there's nothing to offer the user (undefined).
      // If you are not on the first step, then make sure that the secondary action exists and is a function that will take you back to the previous step.
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title="Rent your desk!"
      body={bodyContent}
    />
  );
};

export default RentModal;
