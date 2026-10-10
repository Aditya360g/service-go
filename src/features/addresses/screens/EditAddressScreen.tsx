import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type AddressLabel =
  | "Home"
  | "Office"
  | "Other";

type Address = {
  id: number;

  label: AddressLabel;

  fullName: string;
  phone: string;

  houseNumber: string;
  street: string;
  landmark?: string;

  city: string;
  state: string;
  pincode: string;

  instructions?: string;

  isDefault: boolean;

  createdAt: string;
  updatedAt?: string;
};

type AddressForm = {
  label: AddressLabel;

  fullName: string;
  phone: string;

  houseNumber: string;
  street: string;
  landmark: string;

  city: string;
  state: string;
  pincode: string;

  instructions: string;

  isDefault: boolean;
};

type FormErrors = Partial<
  Record<
    keyof AddressForm,
    string
  >
>;

const demoAddresses: Address[] = [
  {
    id: 1,

    label: "Home",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber: "A-204",
    street: "Vaishali Nagar",

    landmark:
      "Near Main Market",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302021",

    instructions:
      "Call when you reach the main gate.",

    isDefault: true,

    createdAt: "18 Sep 2026",
  },

  {
    id: 2,

    label: "Office",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber:
      "Office 305",

    street: "C Scheme",

    landmark:
      "Near Central Park",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",

    instructions:
      "Ask reception for third floor.",

    isDefault: false,

    createdAt: "17 Sep 2026",
  },

  {
    id: 3,

    label: "Other",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber: "B-112",
    street: "Mansarovar",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302020",

    instructions: "",

    isDefault: false,

    createdAt: "15 Sep 2026",
  },
];

const addressLabels: {
  label: AddressLabel;
  icon: string;
  description: string;
}[] = [
    {
      label: "Home",
      icon: "🏠",
      description:
        "Your home address",
    },

    {
      label: "Office",
      icon: "🏢",
      description:
        "Your work address",
    },

    {
      label: "Other",
      icon: "📍",
      description:
        "Any other location",
    },
  ];

function getParam(
  value?: string | string[]
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function FormLabel({
  title,
  required = false,
}: {
  title: string;
  required?: boolean;
}) {
  return (
    <Text className="mb-2 text-sm font-bold text-slate-700">
      {title}

      {required && (
        <Text className="text-red-500">
          {" "}
          *
        </Text>
      )}
    </Text>
  );
}

function ErrorText({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <Text className="mt-1 text-sm text-red-600">
      {message}
    </Text>
  );
}

export default function EditAddressScreen() {
  const params =
    useLocalSearchParams<{
      addressId?: string | string[];
    }>();

  const addressId = Number(
    getParam(params.addressId)
  );

  const address = useMemo(
    () =>
      demoAddresses.find(
        (item) =>
          item.id === addressId
      ),
    [addressId]
  );

  const initialForm =
    useMemo<
      AddressForm | undefined
    >(() => {
      if (!address) {
        return undefined;
      }

      return {
        label: address.label,

        fullName:
          address.fullName,

        phone: address.phone,

        houseNumber:
          address.houseNumber,

        street:
          address.street,

        landmark:
          address.landmark ??
          "",

        city: address.city,

        state: address.state,

        pincode:
          address.pincode,

        instructions:
          address.instructions ??
          "",

        isDefault:
          address.isDefault,
      };
    }, [address]);

  const [form, setForm] =
    useState<AddressForm | null>(
      initialForm ?? null
    );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  if (!address || !form) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            📍
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Address not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            We couldn't find this saved
            address. It may have been
            removed.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/addresses"
              )
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View My Addresses
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const updateField = <
    K extends keyof AddressForm
  >(
    field: K,
    value: AddressForm[K]
  ) => {
    setForm(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          [field]: value,
        };
      }
    );

    setErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      })
    );
  };

  const validateForm =
    () => {
      const nextErrors: FormErrors =
        {};

      if (
        form.fullName
          .trim()
          .length < 2
      ) {
        nextErrors.fullName =
          "Please enter a valid name.";
      }

      const phoneDigits =
        form.phone.replace(
          /\D/g,
          ""
        );

      if (
        phoneDigits.length !== 10
      ) {
        nextErrors.phone =
          "Enter a valid 10-digit mobile number.";
      }

      if (
        form.houseNumber
          .trim()
          .length < 1
      ) {
        nextErrors.houseNumber =
          "House / flat number is required.";
      }

      if (
        form.street
          .trim()
          .length < 3
      ) {
        nextErrors.street =
          "Please enter your street or area.";
      }

      if (
        form.city
          .trim()
          .length < 2
      ) {
        nextErrors.city =
          "Please enter your city.";
      }

      if (
        form.state
          .trim()
          .length < 2
      ) {
        nextErrors.state =
          "Please enter your state.";
      }

      if (
        !/^[1-9][0-9]{5}$/.test(
          form.pincode.trim()
        )
      ) {
        nextErrors.pincode =
          "Enter a valid 6-digit pincode.";
      }

      setErrors(
        nextErrors
      );

      return (
        Object.keys(
          nextErrors
        ).length === 0
      );
    };

  const handleUpdateAddress =
    async () => {
      if (!validateForm()) {
        return;
      }

      setSaving(true);

      try {
        const payload = {
          label: form.label,

          full_name:
            form.fullName.trim(),

          phone:
            form.phone.replace(
              /\D/g,
              ""
            ),

          house_number:
            form.houseNumber.trim(),

          street:
            form.street.trim(),

          landmark:
            form.landmark.trim() ||
            null,

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          pincode:
            form.pincode.trim(),

          instructions:
            form.instructions.trim() ||
            null,

          is_default:
            form.isDefault,
        };

        /*
          ====================================
          BACKEND INTEGRATION LATER
          ====================================

          await addressesApi.updateAddress(
            address.id,
            payload
          );

          Example:

          PATCH /addresses/:addressId

          UI ko dobara rewrite
          nahi karna padega.
        */

        console.log(
          "Updated address:",
          payload
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Address updated successfully."
          );
        } else {
          Alert.alert(
            "Address Updated",
            "Your address has been updated successfully."
          );
        }

        router.replace(
          "/addresses"
        );
      } catch (error) {
        console.error(
          "Update address error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to update address."
          );
        } else {
          Alert.alert(
            "Unable to Update",
            "Something went wrong while updating your address."
          );
        }
      } finally {
        setSaving(false);
      }
    };

  const performDelete =
    async () => {
      setDeleting(true);

      try {
        /*
          ====================================
          BACKEND INTEGRATION LATER
          ====================================

          await addressesApi.deleteAddress(
            address.id
          );

          DELETE /addresses/:addressId
        */

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Address deleted successfully."
          );
        }

        router.replace(
          "/addresses"
        );
      } catch (error) {
        console.error(
          "Delete address error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to delete address."
          );
        } else {
          Alert.alert(
            "Unable to Delete",
            "Something went wrong while deleting this address."
          );
        }
      } finally {
        setDeleting(false);
      }
    };

  const handleDeleteAddress =
    () => {
      if (
        Platform.OS === "web"
      ) {
        const confirmed =
          window.confirm(
            "Are you sure you want to delete this address?"
          );

        if (confirmed) {
          performDelete();
        }

        return;
      }

      Alert.alert(
        "Delete Address",
        "Are you sure you want to delete this address?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style:
              "destructive",
            onPress:
              performDelete,
          },
        ]
      );
    };

  const addressPreview =
    [
      form.houseNumber,
      form.street,
      form.landmark,
      form.city,
      form.state,
      form.pincode,
    ]
      .filter(
        (value) =>
          value.trim()
            .length > 0
      )
      .join(", ");

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1000,
          }}
        >
          <Pressable
            onPress={() =>
              router.back()
            }
            className="rounded-xl px-2 py-2"
          >
            <Text className="font-semibold text-blue-600">
              ← Back
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push("/")
            }
          >
            <Text className="text-xl font-bold text-blue-600">
              ServiGo
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        className="mx-auto w-full px-5 py-8"
        style={{
          maxWidth: 900,
        }}
      >
        {/* Page Heading */}
        <View className="mb-7 flex-row flex-wrap items-end justify-between gap-4">
          <View
            style={{
              flexBasis: 550,
              flexGrow: 1,
            }}
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Address #{address.id}
            </Text>

            <Text className="mt-2 text-3xl font-bold text-slate-900">
              Edit Address
            </Text>

            <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
              Update your saved service
              address and contact details.
            </Text>
          </View>

          {address.isDefault && (
            <View className="rounded-full bg-blue-50 px-4 py-2">
              <Text className="font-bold text-blue-700">
                ✓ Current Default
              </Text>
            </View>
          )}
        </View>

        {/* Address Type */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Address Type
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Choose how this address
            should appear in your
            ServiGo account.
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            {addressLabels.map(
              (item) => {
                const selected =
                  form.label ===
                  item.label;

                return (
                  <Pressable
                    key={item.label}
                    onPress={() =>
                      updateField(
                        "label",
                        item.label
                      )
                    }
                    className={
                      selected
                        ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                        : "rounded-2xl border border-slate-200 bg-white p-5"
                    }
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-3xl">
                      {item.icon}
                    </Text>

                    <Text
                      className={
                        selected
                          ? "mt-3 text-lg font-bold text-blue-700"
                          : "mt-3 text-lg font-bold text-slate-900"
                      }
                    >
                      {item.label}
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      {
                        item.description
                      }
                    </Text>

                    {selected && (
                      <View className="mt-3 self-start rounded-full bg-blue-600 px-3 py-1">
                        <Text className="text-xs font-bold text-white">
                          ✓ Selected
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              }
            )}
          </View>
        </View>

        {/* Contact Details */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Contact Details
          </Text>

          <View className="mt-6 flex-row flex-wrap gap-5">
            {/* Name */}
            <View
              style={{
                minWidth: 250,
                flexBasis: 350,
                flexGrow: 1,
              }}
            >
              <FormLabel
                title="Full Name"
                required
              />

              <View
                className={
                  errors.fullName
                    ? "rounded-xl border border-red-400 bg-white px-4"
                    : "rounded-xl border border-slate-200 bg-white px-4"
                }
              >
                <TextInput
                  value={
                    form.fullName
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateField(
                      "fullName",
                      value
                    )
                  }
                  placeholder="Enter full name"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="words"
                  maxLength={80}
                  className="py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <ErrorText
                message={
                  errors.fullName
                }
              />
            </View>

            {/* Phone */}
            <View
              style={{
                minWidth: 250,
                flexBasis: 350,
                flexGrow: 1,
              }}
            >
              <FormLabel
                title="Mobile Number"
                required
              />

              <View
                className={
                  errors.phone
                    ? "flex-row items-center rounded-xl border border-red-400 bg-white px-4"
                    : "flex-row items-center rounded-xl border border-slate-200 bg-white px-4"
                }
              >
                <Text className="mr-2 font-semibold text-slate-500">
                  +91
                </Text>

                <TextInput
                  value={
                    form.phone
                  }
                  onChangeText={(
                    value
                  ) => {
                    const cleaned =
                      value.replace(
                        /\D/g,
                        ""
                      );

                    updateField(
                      "phone",
                      cleaned.slice(
                        0,
                        10
                      )
                    );
                  }}
                  placeholder="9876543210"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  className="flex-1 py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <ErrorText
                message={
                  errors.phone
                }
              />
            </View>
          </View>
        </View>

        {/* Address Details */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Address Details
          </Text>

          {/* House */}
          <View className="mt-6">
            <FormLabel
              title="House / Flat / Building Number"
              required
            />

            <View
              className={
                errors.houseNumber
                  ? "rounded-xl border border-red-400 bg-white px-4"
                  : "rounded-xl border border-slate-200 bg-white px-4"
              }
            >
              <TextInput
                value={
                  form.houseNumber
                }
                onChangeText={(
                  value
                ) =>
                  updateField(
                    "houseNumber",
                    value
                  )
                }
                placeholder="Example: Flat 204, A-15"
                placeholderTextColor="#94a3b8"
                maxLength={100}
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>

            <ErrorText
              message={
                errors.houseNumber
              }
            />
          </View>

          {/* Street */}
          <View className="mt-5">
            <FormLabel
              title="Street / Area / Locality"
              required
            />

            <View
              className={
                errors.street
                  ? "rounded-xl border border-red-400 bg-white px-4"
                  : "rounded-xl border border-slate-200 bg-white px-4"
              }
            >
              <TextInput
                value={
                  form.street
                }
                onChangeText={(
                  value
                ) =>
                  updateField(
                    "street",
                    value
                  )
                }
                placeholder="Example: Vaishali Nagar"
                placeholderTextColor="#94a3b8"
                maxLength={150}
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>

            <ErrorText
              message={
                errors.street
              }
            />
          </View>

          {/* Landmark */}
          <View className="mt-5">
            <FormLabel title="Landmark (Optional)" />

            <View className="rounded-xl border border-slate-200 bg-white px-4">
              <TextInput
                value={
                  form.landmark
                }
                onChangeText={(
                  value
                ) =>
                  updateField(
                    "landmark",
                    value
                  )
                }
                placeholder="Example: Near City Mall"
                placeholderTextColor="#94a3b8"
                maxLength={120}
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>
          </View>

          {/* City State */}
          <View className="mt-5 flex-row flex-wrap gap-5">
            <View
              style={{
                minWidth: 220,
                flexBasis: 320,
                flexGrow: 1,
              }}
            >
              <FormLabel
                title="City"
                required
              />

              <View
                className={
                  errors.city
                    ? "rounded-xl border border-red-400 bg-white px-4"
                    : "rounded-xl border border-slate-200 bg-white px-4"
                }
              >
                <TextInput
                  value={
                    form.city
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateField(
                      "city",
                      value
                    )
                  }
                  placeholder="Example: Jaipur"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="words"
                  maxLength={80}
                  className="py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <ErrorText
                message={
                  errors.city
                }
              />
            </View>

            <View
              style={{
                minWidth: 220,
                flexBasis: 320,
                flexGrow: 1,
              }}
            >
              <FormLabel
                title="State"
                required
              />

              <View
                className={
                  errors.state
                    ? "rounded-xl border border-red-400 bg-white px-4"
                    : "rounded-xl border border-slate-200 bg-white px-4"
                }
              >
                <TextInput
                  value={
                    form.state
                  }
                  onChangeText={(
                    value
                  ) =>
                    updateField(
                      "state",
                      value
                    )
                  }
                  placeholder="Example: Rajasthan"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="words"
                  maxLength={80}
                  className="py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <ErrorText
                message={
                  errors.state
                }
              />
            </View>
          </View>

          {/* Pincode */}
          <View className="mt-5">
            <View
              style={{
                maxWidth: 350,
              }}
            >
              <FormLabel
                title="Pincode"
                required
              />

              <View
                className={
                  errors.pincode
                    ? "rounded-xl border border-red-400 bg-white px-4"
                    : "rounded-xl border border-slate-200 bg-white px-4"
                }
              >
                <TextInput
                  value={
                    form.pincode
                  }
                  onChangeText={(
                    value
                  ) => {
                    const cleaned =
                      value.replace(
                        /\D/g,
                        ""
                      );

                    updateField(
                      "pincode",
                      cleaned.slice(
                        0,
                        6
                      )
                    );
                  }}
                  placeholder="302001"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={6}
                  className="py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <ErrorText
                message={
                  errors.pincode
                }
              />
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Service Instructions
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Add optional directions for
            ServiGo professionals.
          </Text>

          <View className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <TextInput
              value={
                form.instructions
              }
              onChangeText={(
                value
              ) =>
                updateField(
                  "instructions",
                  value
                )
              }
              placeholder="Example: Call before arriving."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              maxLength={250}
              className="min-h-[100px] py-3 text-base leading-6 text-slate-900 outline-none"
            />
          </View>

          <Text className="mt-2 text-right text-xs text-slate-400">
            {
              form.instructions
                .length
            }
            /250
          </Text>
        </View>

        {/* Default */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Pressable
            onPress={() =>
              updateField(
                "isDefault",
                !form.isDefault
              )
            }
            className="flex-row items-center"
          >
            <View
              className={
                form.isDefault
                  ? "mr-4 h-7 w-7 items-center justify-center rounded-lg bg-blue-600"
                  : "mr-4 h-7 w-7 items-center justify-center rounded-lg border-2 border-slate-300 bg-white"
              }
            >
              {form.isDefault && (
                <Text className="font-bold text-white">
                  ✓
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="font-bold text-slate-900">
                Set as default address
              </Text>

              <Text className="mt-1 text-sm leading-5 text-slate-500">
                This address will be
                selected automatically
                during future bookings.
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Preview */}
        <View className="mb-6 rounded-3xl bg-slate-900 p-6">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Updated Address Preview
          </Text>

          <View className="mt-4 flex-row items-start">
            <View className="mr-4 h-14 w-14 items-center justify-center rounded-xl bg-slate-800">
              <Text className="text-3xl">
                {form.label ===
                  "Home"
                  ? "🏠"
                  : form.label ===
                    "Office"
                    ? "🏢"
                    : "📍"}
              </Text>
            </View>

            <View className="flex-1">
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-lg font-bold text-white">
                  {form.label}
                </Text>

                {form.isDefault && (
                  <View className="rounded-full bg-blue-600 px-3 py-1">
                    <Text className="text-xs font-bold text-white">
                      Default
                    </Text>
                  </View>
                )}
              </View>

              <Text className="mt-2 leading-6 text-slate-300">
                {addressPreview ||
                  "Your address preview will appear here."}
              </Text>

              <Text className="mt-3 text-sm text-slate-400">
                {form.fullName}

                {form.phone
                  ? ` • +91 ${form.phone}`
                  : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Metadata */}
        <View className="mb-6 rounded-2xl bg-slate-100 p-4">
          <Text className="text-sm text-slate-500">
            Address added on{" "}
            {address.createdAt}
          </Text>
        </View>

        {/* Actions */}
        <View className="flex-row flex-wrap items-center justify-between gap-3">
          <Pressable
            disabled={
              saving ||
              deleting
            }
            onPress={
              handleDeleteAddress
            }
            className={
              deleting
                ? "rounded-xl border border-red-200 bg-red-50 px-6 py-4 opacity-60"
                : "rounded-xl border border-red-200 bg-red-50 px-6 py-4"
            }
          >
            <Text className="font-bold text-red-600">
              {deleting
                ? "Deleting..."
                : "Delete Address"}
            </Text>
          </Pressable>

          <View className="flex-row flex-wrap gap-3">
            <Pressable
              disabled={
                saving ||
                deleting
              }
              onPress={() =>
                router.back()
              }
              className="rounded-xl border border-slate-200 bg-white px-6 py-4"
            >
              <Text className="font-bold text-slate-700">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              disabled={
                saving ||
                deleting
              }
              onPress={
                handleUpdateAddress
              }
              className={
                saving
                  ? "rounded-xl bg-blue-400 px-7 py-4"
                  : "rounded-xl bg-blue-600 px-7 py-4"
              }
            >
              <Text className="font-bold text-white">
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}