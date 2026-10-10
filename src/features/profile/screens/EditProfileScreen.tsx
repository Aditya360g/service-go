import { router } from "expo-router";
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

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;

  role: "customer" | "provider" | "admin";

  status: "active" | "inactive" | "blocked";

  emailVerified: boolean;

  createdAt: string;
};

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
};

type ProfileErrors = Partial<
  Record<keyof ProfileForm, string>
>;

/*
  TEMPORARY FRONTEND DATA

  Backend integration ke time:
  GET /users/me

  se real logged-in user profile
  load hogi.

  UI ko rewrite nahi karna padega.
*/
const demoUser: UserProfile = {
  id: 1,

  name: "Aditya",

  email: "aditya@example.com",

  phone: "9876543210",

  role: "customer",

  status: "active",

  emailVerified: true,

  createdAt: "10 Sep 2026",
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

function getInitials(
  name: string
) {
  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0)
    )
    .join("")
    .toUpperCase();

  return initials || "U";
}

export default function EditProfileScreen() {
  /*
    BACKEND INTEGRATION LATER:

    Logged-in user ko AuthProvider /
    React Query ke through GET /users/me
    se load karenge.

    Abhi demoUser frontend placeholder hai.
  */

  const user = demoUser;

  const originalForm =
    useMemo<ProfileForm>(
      () => ({
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
      [
        user.name,
        user.email,
        user.phone,
      ]
    );

  const [form, setForm] =
    useState<ProfileForm>(
      originalForm
    );

  const [errors, setErrors] =
    useState<ProfileErrors>(
      {}
    );

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const updateField = <
    K extends keyof ProfileForm
  >(
    field: K,
    value: ProfileForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSaved(false);
  };

  const hasChanges =
    form.name.trim() !==
    originalForm.name.trim() ||
    form.phone.trim() !==
    originalForm.phone.trim();

  const validateForm = () => {
    const nextErrors: ProfileErrors =
      {};

    const cleanName =
      form.name.trim();

    const phoneDigits =
      form.phone.replace(
        /\D/g,
        ""
      );

    if (
      cleanName.length < 2
    ) {
      nextErrors.name =
        "Please enter a valid name.";
    }

    if (
      cleanName.length > 80
    ) {
      nextErrors.name =
        "Name cannot exceed 80 characters.";
    }

    if (
      phoneDigits.length !== 10
    ) {
      nextErrors.phone =
        "Enter a valid 10-digit mobile number.";
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

  const handleReset = () => {
    setForm(
      originalForm
    );

    setErrors({});

    setSaved(false);
  };

  const handleSave =
    async () => {
      if (!validateForm()) {
        return;
      }

      if (!hasChanges) {
        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "No profile changes to save."
          );
        } else {
          Alert.alert(
            "No Changes",
            "You haven't changed any profile information."
          );
        }

        return;
      }

      setSaving(true);
      setSaved(false);

      try {
        const payload = {
          name:
            form.name.trim(),

          phone:
            form.phone.replace(
              /\D/g,
              ""
            ),
        };

        /*
          ======================================
          BACKEND INTEGRATION
          ======================================

          Tumhare backend me profile update
          endpoint already hai:

          PATCH /users/me

          Later:

          await profileApi.updateProfile(
            payload
          );

          Example payload:

          {
            name: "Aditya",
            phone: "9876543210"
          }

          IMPORTANT:

          Email ko yahan directly update
          nahi kar rahe because email
          change ke liye verification flow
          alag hona chahiye.

          Backend already duplicate phone
          validation handle karta hai.

          Example backend error:
          "Phone number already in use"

          UI same rahegi.
        */

        console.log(
          "Profile update payload:",
          payload
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );

        setSaved(true);

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Profile updated successfully."
          );
        } else {
          Alert.alert(
            "Profile Updated",
            "Your profile has been updated successfully."
          );
        }

        router.replace(
          "/profile"
        );
      } catch (error: any) {
        console.error(
          "Profile update error:",
          error
        );

        const message =
          error?.response?.data
            ?.detail ||
          error?.message ||
          "Unable to update profile.";

        if (
          String(message)
            .toLowerCase()
            .includes(
              "phone number already"
            )
        ) {
          setErrors(
            (current) => ({
              ...current,

              phone:
                "This phone number is already in use.",
            })
          );

          return;
        }

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            String(message)
          );
        } else {
          Alert.alert(
            "Unable to Update",
            String(message)
          );
        }
      } finally {
        setSaving(false);
      }
    };

  const handleCancel = () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    if (
      Platform.OS === "web"
    ) {
      const confirmed =
        window.confirm(
          "Discard your unsaved profile changes?"
        );

      if (confirmed) {
        router.back();
      }

      return;
    }

    Alert.alert(
      "Discard Changes?",
      "Your unsaved profile changes will be lost.",
      [
        {
          text: "Keep Editing",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",

          onPress: () =>
            router.back(),
        },
      ]
    );
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
      {/* HEADER */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1000,
          }}
        >
          <Pressable
            disabled={saving}
            onPress={handleCancel}
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
        {/* HEADING */}
        <View className="mb-7">
          <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Customer Account
          </Text>

          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Edit Profile
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Keep your ServiGo contact
            information up to date for
            bookings and service
            communication.
          </Text>
        </View>

        {/* SAVED MESSAGE */}
        {saved && (
          <View className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
            <Text className="font-bold text-green-700">
              ✓ Profile updated
              successfully
            </Text>
          </View>
        )}

        {/* PROFILE IDENTITY */}
        <View className="mb-6 rounded-3xl bg-blue-600 p-6 md:p-8">
          <View className="flex-row flex-wrap items-center gap-5">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
              <Text className="text-3xl font-bold text-blue-700">
                {getInitials(
                  form.name
                )}
              </Text>
            </View>

            <View
              style={{
                minWidth: 220,
                flexBasis: 500,
                flexGrow: 1,
              }}
            >
              <Text className="text-2xl font-bold text-white">
                {form.name.trim() ||
                  "Your Name"}
              </Text>

              <Text className="mt-1 text-blue-100">
                {form.email}
              </Text>

              <View className="mt-3 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-blue-700 px-3 py-1">
                  <Text className="text-xs font-bold text-white">
                    Customer
                  </Text>
                </View>

                {user.emailVerified && (
                  <View className="rounded-full bg-green-100 px-3 py-1">
                    <Text className="text-xs font-bold text-green-700">
                      ✓ Email Verified
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* PERSONAL INFORMATION */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Personal Information
          </Text>

          <Text className="mt-1 text-sm leading-5 text-slate-500">
            This information is used
            for your ServiGo account
            and service bookings.
          </Text>

          {/* NAME */}
          <View className="mt-6">
            <FormLabel
              title="Full Name"
              required
            />

            <View
              className={
                errors.name
                  ? "rounded-xl border border-red-400 bg-white px-4"
                  : "rounded-xl border border-slate-200 bg-white px-4"
              }
            >
              <TextInput
                value={form.name}
                onChangeText={(
                  value
                ) =>
                  updateField(
                    "name",
                    value
                  )
                }
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
                maxLength={80}
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>

            <ErrorText
              message={
                errors.name
              }
            />

            <Text className="mt-2 text-right text-xs text-slate-400">
              {form.name.length}/80
            </Text>
          </View>

          {/* EMAIL */}
          <View className="mt-5">
            <FormLabel
              title="Email Address"
            />

            <View className="rounded-xl border border-slate-200 bg-slate-100 px-4">
              <TextInput
                value={form.email}
                editable={false}
                selectTextOnFocus={
                  false
                }
                className="py-4 text-base text-slate-500 outline-none"
              />
            </View>

            <View className="mt-2 flex-row flex-wrap items-center justify-between gap-2">
              <Text className="text-xs leading-5 text-slate-400">
                Email cannot be
                changed directly from
                this screen.
              </Text>

              {user.emailVerified ? (
                <Text className="text-xs font-semibold text-green-600">
                  ✓ Verified
                </Text>
              ) : (
                <Pressable
                  onPress={() =>
                    router.push(
                      "/verify-email"
                    )
                  }
                >
                  <Text className="text-xs font-semibold text-blue-600">
                    Verify Email
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* PHONE */}
          <View className="mt-5">
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

            <Text className="mt-2 text-xs leading-5 text-slate-400">
              This number may be used
              by service professionals
              for booking-related
              communication.
            </Text>
          </View>
        </View>

        {/* ACCOUNT INFORMATION */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Account Information
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-4">
            <View
              className="rounded-2xl bg-slate-50 p-4"
              style={{
                minWidth: 180,
                flexBasis: 220,
                flexGrow: 1,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Type
              </Text>

              <Text className="mt-2 font-bold capitalize text-slate-900">
                {user.role}
              </Text>
            </View>

            <View
              className="rounded-2xl bg-slate-50 p-4"
              style={{
                minWidth: 180,
                flexBasis: 220,
                flexGrow: 1,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Status
              </Text>

              <Text className="mt-2 font-bold capitalize text-green-600">
                {user.status}
              </Text>
            </View>

            <View
              className="rounded-2xl bg-slate-50 p-4"
              style={{
                minWidth: 180,
                flexBasis: 220,
                flexGrow: 1,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Member Since
              </Text>

              <Text className="mt-2 font-bold text-slate-900">
                {user.createdAt}
              </Text>
            </View>
          </View>
        </View>

        {/* PROFILE PREVIEW */}
        <View className="mb-6 rounded-3xl bg-slate-900 p-6">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Profile Preview
          </Text>

          <View className="mt-5 flex-row flex-wrap items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-slate-800">
              <Text className="text-xl font-bold text-white">
                {getInitials(
                  form.name
                )}
              </Text>
            </View>

            <View className="flex-1">
              <Text className="text-lg font-bold text-white">
                {form.name.trim() ||
                  "Your Name"}
              </Text>

              <Text className="mt-1 text-sm text-slate-400">
                {form.email}
              </Text>

              <Text className="mt-1 text-sm text-slate-400">
                {form.phone
                  ? `+91 ${form.phone}`
                  : "No phone number"}
              </Text>
            </View>
          </View>
        </View>

        {/* SECURITY NOTE */}
        <View className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <Text className="font-bold text-blue-800">
            Account Security
          </Text>

          <Text className="mt-2 text-sm leading-6 text-blue-700">
            Sensitive account changes
            such as password and email
            verification are handled
            through separate secure
            flows.
          </Text>

          <View className="mt-4 flex-row flex-wrap gap-3">
            <Pressable
              onPress={() =>
                router.push(
                  "/forgot-password"
                )
              }
              className="rounded-xl bg-white px-4 py-3"
            >
              <Text className="font-semibold text-blue-700">
                Change Password
              </Text>
            </Pressable>

            {!user.emailVerified && (
              <Pressable
                onPress={() =>
                  router.push(
                    "/verify-email"
                  )
                }
                className="rounded-xl bg-white px-4 py-3"
              >
                <Text className="font-semibold text-blue-700">
                  Verify Email
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* UNSAVED CHANGES */}
        {hasChanges && (
          <View className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <Text className="font-semibold text-amber-800">
              You have unsaved
              profile changes.
            </Text>
          </View>
        )}

        {/* ACTIONS */}
        <View className="flex-row flex-wrap items-center justify-between gap-3">
          <Pressable
            disabled={
              saving ||
              !hasChanges
            }
            onPress={
              handleReset
            }
            className={
              !hasChanges
                ? "rounded-xl border border-slate-200 bg-slate-100 px-6 py-4 opacity-50"
                : "rounded-xl border border-slate-200 bg-white px-6 py-4"
            }
          >
            <Text className="font-bold text-slate-700">
              Reset Changes
            </Text>
          </Pressable>

          <View className="flex-row flex-wrap gap-3">
            <Pressable
              disabled={saving}
              onPress={
                handleCancel
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
                !hasChanges
              }
              onPress={
                handleSave
              }
              className={
                saving
                  ? "rounded-xl bg-blue-400 px-7 py-4"
                  : !hasChanges
                    ? "rounded-xl bg-blue-300 px-7 py-4 opacity-60"
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

        <Text className="mt-6 text-center text-xs leading-5 text-slate-400">
          Your profile information is
          used to manage your ServiGo
          account and bookings.
        </Text>
      </View>
    </ScrollView>
  );
}