import { router } from "expo-router";
import { useState } from "react";
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

const initialForm: AddressForm = {
  label: "Home",

  fullName: "",
  phone: "",

  houseNumber: "",
  street: "",
  landmark: "",

  city: "",
  state: "Rajasthan",
  pincode: "",

  instructions: "",

  isDefault: false,
};

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

export default function AddAddressScreen() {
  const [form, setForm] =
    useState<AddressForm>(
      initialForm
    );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [saving, setSaving] =
    useState(false);

  const updateField = <
    K extends keyof AddressForm
  >(
    field: K,
    value: AddressForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
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

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors)
        .length === 0
    );
  };

  const handleSaveAddress =
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
            form.phone
              .replace(/\D/g, "")
              .trim(),

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
          ======================================
          BACKEND INTEGRATION LATER
          ======================================

          Yahan real API call lagegi:

          await addressesApi.createAddress(
            payload
          );

          Example API:

          POST /addresses

          {
            label: "Home",
            full_name: "...",
            phone: "...",
            house_number: "...",
            street: "...",
            landmark: "...",
            city: "...",
            state: "...",
            pincode: "...",
            instructions: "...",
            is_default: true
          }

          UI ko change karne ki
          zarurat nahi hogi.
        */

        console.log(
          "Address payload:",
          payload
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Address saved successfully."
          );
        } else {
          Alert.alert(
            "Address Saved",
            "Your address has been saved successfully."
          );
        }

        router.replace(
          "/addresses"
        );
      } catch (error) {
        console.error(
          "Address save error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to save address. Please try again."
          );
        } else {
          Alert.alert(
            "Unable to Save",
            "Something went wrong while saving your address."
          );
        }
      } finally {
        setSaving(false);
      }
    };

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
            maxWidth: 1100,
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
        {/* Heading */}
        <View className="mb-7">
          <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Address
          </Text>

          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Add New Address
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Add an address where
            ServiGo professionals can
            provide your booked service.
          </Text>
        </View>

        {/* Address Type */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Address Type
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Choose a label so you can
            identify this address easily.
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

          <Text className="mt-1 text-sm text-slate-500">
            The service professional can
            use these details for this
            address.
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
                  value={form.phone}
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

        {/* Main Address */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Address Details
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Enter the complete service
            location.
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

          {/* City + State */}
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
                  value={form.city}
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
            Delivery Instructions
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Optional instructions to
            help the professional find
            your address.
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
              placeholder="Example: Call when you reach the gate. Flat is on the second floor."
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

        {/* Default Address */}
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
                Make this my default
                address
              </Text>

              <Text className="mt-1 text-sm leading-5 text-slate-500">
                ServiGo will automatically
                select this address during
                future bookings.
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Preview */}
        <View className="mb-6 rounded-3xl bg-slate-900 p-6">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Address Preview
          </Text>

          <View className="mt-4 flex-row items-start">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
              <Text className="text-2xl">
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
                {[
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
                  .join(", ") ||
                  "Your complete address will appear here."}
              </Text>

              {!!form.fullName && (
                <Text className="mt-3 text-sm text-slate-400">
                  {form.fullName}
                  {form.phone
                    ? ` • +91 ${form.phone}`
                    : ""}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row flex-wrap justify-end gap-3">
          <Pressable
            disabled={saving}
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
            disabled={saving}
            onPress={
              handleSaveAddress
            }
            className={
              saving
                ? "rounded-xl bg-blue-400 px-7 py-4"
                : "rounded-xl bg-blue-600 px-7 py-4"
            }
          >
            <Text className="font-bold text-white">
              {saving
                ? "Saving Address..."
                : "Save Address"}
            </Text>
          </Pressable>
        </View>

        {/* Footer note */}
        <Text className="mt-5 text-center text-xs leading-5 text-slate-400">
          Your address is used only for
          service booking and provider
          visit purposes.
        </Text>
      </View>
    </ScrollView>
  );
}