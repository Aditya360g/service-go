import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type ProviderProfile = {
  name: string;
  email: string;
  phone: string;
  profession: string;
  experience: string;
  location: string;
  serviceArea: string;
  bio: string;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/provider",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/provider/bookings",
  },
  {
    label: "My Services",
    icon: "🛠️",
    route: "/provider/services",
  },
  {
    label: "Availability",
    icon: "🕒",
    route: "/provider/availability",
  },
  {
    label: "Earnings",
    icon: "₹",
    route: "/provider/earnings",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/provider/reviews",
  },
  {
    label: "Profile",
    icon: "👤",
    route: "/provider/profile",
  },
] as const;

const initialProfile: ProviderProfile = {
  name: "Rahul Provider",
  email: "rahul.provider@example.com",
  phone: "9876543210",
  profession: "Appliance Technician",
  experience: "5 Years",
  location: "Jaipur, Rajasthan",
  serviceArea:
    "Vaishali Nagar, Mansarovar, C Scheme, Malviya Nagar",
  bio:
    "Experienced appliance technician providing washing machine repair, inspection and installation services.",
};

function ProfileField({
  label,
  value,
  editable,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  editable: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?:
  | "default"
  | "email-address"
  | "phone-pad";
}) {
  return (
    <View
      style={{
        minWidth: 260,
        flexBasis: 360,
        flexGrow: 1,
      }}
    >
      <Text className="mb-2 text-sm font-bold text-slate-700">
        {label}
      </Text>

      <View
        className={
          editable
            ? "rounded-xl border border-slate-200 bg-white px-4"
            : "rounded-xl border border-slate-100 bg-slate-50 px-4"
        }
      >
        <TextInput
          value={value}
          editable={editable}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={
            keyboardType === "email-address"
              ? "none"
              : "sentences"
          }
          autoCorrect={false}
          className={
            editable
              ? "py-4 text-base text-slate-900 outline-none"
              : "py-4 text-base text-slate-500 outline-none"
          }
          style={
            multiline
              ? {
                minHeight: 110,
                textAlignVertical: "top",
              }
              : undefined
          }
        />
      </View>
    </View>
  );
}

export default function ProviderProfileScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [profile, setProfile] =
    useState<ProviderProfile>(
      initialProfile
    );

  const [draft, setDraft] =
    useState<ProviderProfile>(
      initialProfile
    );

  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const updateDraft = (
    field: keyof ProviderProfile,
    value: string
  ) => {
    setSaved(false);

    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(false);
  };

  const handleSave = () => {
    const cleanedProfile = {
      ...draft,
      name: draft.name.trim(),
      phone: draft.phone.replace(
        /\D/g,
        ""
      ),
      profession:
        draft.profession.trim(),
      experience:
        draft.experience.trim(),
      location:
        draft.location.trim(),
      serviceArea:
        draft.serviceArea.trim(),
      bio: draft.bio.trim(),
    };

    setProfile(cleanedProfile);
    setDraft(cleanedProfile);
    setEditing(false);
    setSaved(true);
  };

  const current =
    editing
      ? draft
      : profile;

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className={
          isDesktop
            ? "flex-1 flex-row"
            : "flex-1"
        }
      >
        {/* SIDEBAR */}
        {isDesktop && (
          <View
            className="border-r border-slate-200 bg-white px-5 py-6"
            style={{
              width: 250,
            }}
          >
            <Pressable
              onPress={() =>
                router.replace(
                  "/provider"
                )
              }
              className="mb-8 flex-row items-center px-2"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Text className="text-lg font-black text-white">
                  S
                </Text>
              </View>

              <View className="ml-3">
                <Text className="text-xl font-black text-slate-900">
                  ServiGo
                </Text>

                <Text className="text-xs font-semibold text-slate-400">
                  Provider Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/provider/profile";

                  return (
                    <Pressable
                      key={
                        item.label
                      }
                      onPress={() =>
                        router.push(
                          item.route
                        )
                      }
                      className={
                        active
                          ? "flex-row items-center rounded-xl bg-blue-50 px-4 py-4"
                          : "flex-row items-center rounded-xl px-4 py-4"
                      }
                    >
                      <View className="w-8 items-center">
                        <Text className="text-xl">
                          {
                            item.icon
                          }
                        </Text>
                      </View>

                      <Text
                        className={
                          active
                            ? "ml-3 font-bold text-blue-700"
                            : "ml-3 font-semibold text-slate-600"
                        }
                      >
                        {
                          item.label
                        }
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* MAIN */}
        <View className="flex-1">
          {/* HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {isDesktop ? (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Provider Profile
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage your public
                    provider information
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Text className="font-bold text-blue-700">
                    RP
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      {profile.name}
                    </Text>

                    <Text className="text-xs text-slate-400">
                      {
                        profile.profession
                      }
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {!isDesktop && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mt-4"
              >
                <View className="flex-row gap-2">
                  {sidebarItems.map(
                    (item) => {
                      const active =
                        item.route ===
                        "/provider/profile";

                      return (
                        <Pressable
                          key={
                            item.label
                          }
                          onPress={() =>
                            router.push(
                              item.route
                            )
                          }
                          className={
                            active
                              ? "rounded-full bg-blue-600 px-4 py-2.5"
                              : "rounded-full border border-slate-200 bg-white px-4 py-2.5"
                          }
                        >
                          <Text
                            className={
                              active
                                ? "font-semibold text-white"
                                : "font-semibold text-slate-600"
                            }
                          >
                            {
                              item.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 60,
            }}
          >
            <View className="p-5 md:p-8">
              {/* PROFILE HERO */}
              <View className="rounded-2xl border border-slate-200 bg-white p-6">
                <View className="flex-row flex-wrap items-center gap-5">
                  <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-3xl font-black text-blue-700">
                      RP
                    </Text>
                  </View>

                  <View
                    style={{
                      minWidth: 220,
                      flexGrow: 1,
                    }}
                  >
                    <View className="flex-row flex-wrap items-center gap-2">
                      <Text className="text-2xl font-black text-slate-900">
                        {profile.name}
                      </Text>

                      <View className="rounded-full bg-green-50 px-3 py-1">
                        <Text className="text-xs font-bold text-green-700">
                          ✓ Verified
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-1 text-base font-semibold text-slate-600">
                      {
                        profile.profession
                      }
                    </Text>

                    <Text className="mt-2 text-sm text-slate-500">
                      📍{" "}
                      {
                        profile.location
                      }
                    </Text>
                  </View>

                  {!editing ? (
                    <Pressable
                      onPress={
                        handleEdit
                      }
                      className="rounded-xl bg-blue-600 px-6 py-3.5"
                    >
                      <Text className="font-bold text-white">
                        Edit Profile
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={
                          handleCancel
                        }
                        className="rounded-xl border border-slate-200 bg-white px-5 py-3.5"
                      >
                        <Text className="font-bold text-slate-600">
                          Cancel
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={
                          handleSave
                        }
                        className="rounded-xl bg-blue-600 px-5 py-3.5"
                      >
                        <Text className="font-bold text-white">
                          Save Changes
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>

              {saved && (
                <View className="mt-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                  <Text className="font-semibold text-green-700">
                    ✓ Profile updated successfully.
                  </Text>
                </View>
              )}

              {/* STATS */}
              <View className="mt-5 flex-row flex-wrap gap-4">
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 200,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Rating
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-slate-900">
                    ⭐ 5.0
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    42 reviews
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 200,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Completed Jobs
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-slate-900">
                    109
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    Total services
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 200,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Experience
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-slate-900">
                    {
                      profile.experience
                    }
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    Professional work
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 200,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Status
                  </Text>

                  <Text className="mt-2 text-xl font-black text-green-600">
                    ● Active
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    Provider account
                  </Text>
                </View>
              </View>

              {/* DETAILS */}
              <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
                <View className="mb-6">
                  <Text className="text-xl font-bold text-slate-900">
                    Personal Information
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Your basic account
                    and provider details.
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-5">
                  <ProfileField
                    label="Full Name"
                    value={
                      current.name
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "name",
                        value
                      )
                    }
                    placeholder="Enter full name"
                  />

                  <ProfileField
                    label="Email Address"
                    value={
                      current.email
                    }
                    editable={false}
                    onChangeText={() => { }}
                    keyboardType="email-address"
                  />

                  <ProfileField
                    label="Mobile Number"
                    value={
                      current.phone
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "phone",
                        value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            10
                          )
                      )
                    }
                    placeholder="9876543210"
                    keyboardType="phone-pad"
                  />

                  <ProfileField
                    label="Profession"
                    value={
                      current.profession
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "profession",
                        value
                      )
                    }
                    placeholder="Appliance Technician"
                  />

                  <ProfileField
                    label="Experience"
                    value={
                      current.experience
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "experience",
                        value
                      )
                    }
                    placeholder="5 Years"
                  />

                  <ProfileField
                    label="Location"
                    value={
                      current.location
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "location",
                        value
                      )
                    }
                    placeholder="Jaipur, Rajasthan"
                  />
                </View>
              </View>

              {/* PROFESSIONAL */}
              <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
                <Text className="text-xl font-bold text-slate-900">
                  Professional Details
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  Information customers
                  can see on your profile.
                </Text>

                <View className="mt-6 gap-5">
                  <ProfileField
                    label="Service Area"
                    value={
                      current.serviceArea
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "serviceArea",
                        value
                      )
                    }
                    placeholder="Enter service areas"
                  />

                  <ProfileField
                    label="About You"
                    value={
                      current.bio
                    }
                    editable={
                      editing
                    }
                    onChangeText={(
                      value
                    ) =>
                      updateDraft(
                        "bio",
                        value
                      )
                    }
                    placeholder="Tell customers about your experience"
                    multiline
                  />
                </View>
              </View>

              {/* ACCOUNT */}
              <View className="mt-5 flex-row flex-wrap gap-5">
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  style={{
                    minWidth: 280,
                    flexBasis: 500,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Account Status
                  </Text>

                  <View className="mt-5 flex-row items-center justify-between border-b border-slate-100 pb-4">
                    <View>
                      <Text className="font-semibold text-slate-800">
                        Provider Account
                      </Text>

                      <Text className="mt-1 text-xs text-slate-400">
                        Current account status
                      </Text>
                    </View>

                    <Text className="font-bold text-green-600">
                      Active
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between border-b border-slate-100 py-4">
                    <View>
                      <Text className="font-semibold text-slate-800">
                        Email Verification
                      </Text>

                      <Text className="mt-1 text-xs text-slate-400">
                        Email address verification
                      </Text>
                    </View>

                    <Text className="font-bold text-green-600">
                      Verified
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-4">
                    <View>
                      <Text className="font-semibold text-slate-800">
                        Provider Verification
                      </Text>

                      <Text className="mt-1 text-xs text-slate-400">
                        ServiGo provider status
                      </Text>
                    </View>

                    <Text className="font-bold text-green-600">
                      Verified
                    </Text>
                  </View>
                </View>

                {/* QUICK LINKS */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  style={{
                    minWidth: 280,
                    flexBasis: 400,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Provider Settings
                  </Text>

                  <View className="mt-4 gap-3">
                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/services"
                        )
                      }
                      className="flex-row items-center rounded-xl bg-slate-50 p-4"
                    >
                      <Text className="text-xl">
                        🛠️
                      </Text>

                      <Text className="ml-3 flex-1 font-semibold text-slate-700">
                        Manage Services
                      </Text>

                      <Text className="text-slate-400">
                        ›
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/availability"
                        )
                      }
                      className="flex-row items-center rounded-xl bg-slate-50 p-4"
                    >
                      <Text className="text-xl">
                        🕒
                      </Text>

                      <Text className="ml-3 flex-1 font-semibold text-slate-700">
                        Availability
                      </Text>

                      <Text className="text-slate-400">
                        ›
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/reviews"
                        )
                      }
                      className="flex-row items-center rounded-xl bg-slate-50 p-4"
                    >
                      <Text className="text-xl">
                        ⭐
                      </Text>

                      <Text className="ml-3 flex-1 font-semibold text-slate-700">
                        Reviews
                      </Text>

                      <Text className="text-slate-400">
                        ›
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {editing && (
                <View className="mt-5 flex-row flex-wrap justify-end gap-3">
                  <Pressable
                    onPress={
                      handleCancel
                    }
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5"
                  >
                    <Text className="font-bold text-slate-600">
                      Cancel
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={
                      handleSave
                    }
                    className="rounded-xl bg-blue-600 px-6 py-3.5"
                  >
                    <Text className="font-bold text-white">
                      Save Changes
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}