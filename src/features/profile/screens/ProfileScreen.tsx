import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;

  role:
  | "customer"
  | "provider"
  | "admin";

  status:
  | "active"
  | "inactive"
  | "blocked";

  emailVerified: boolean;

  createdAt: string;

  totalBookings: number;
  completedBookings: number;
  savedAddresses: number;
  favoriteProviders: number;
};

const demoUser: UserProfile = {
  id: 1,

  name: "Aditya",

  email: "aditya@example.com",

  phone: "9876543210",

  role: "customer",

  status: "active",

  emailVerified: true,

  createdAt: "10 Sep 2026",

  totalBookings: 5,
  completedBookings: 2,
  savedAddresses: 3,
  favoriteProviders: 2,
};

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

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 150,
        flexBasis: 200,
        flexGrow: 1,
      }}
    >
      <Text className="text-2xl font-bold text-slate-900">
        {value}
      </Text>

      <Text className="mt-1 text-sm text-slate-500">
        {label}
      </Text>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  description,
  onPress,
  danger = false,
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <View className="flex-row items-center">
        <View
          className={
            danger
              ? "mr-4 h-12 w-12 items-center justify-center rounded-xl bg-red-50"
              : "mr-4 h-12 w-12 items-center justify-center rounded-xl bg-blue-50"
          }
        >
          <Text className="text-2xl">
            {icon}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            className={
              danger
                ? "font-bold text-red-600"
                : "font-bold text-slate-900"
            }
          >
            {title}
          </Text>

          <Text className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </Text>
        </View>

        <Text
          className={
            danger
              ? "ml-3 text-xl text-red-400"
              : "ml-3 text-xl text-slate-400"
          }
        >
          →
        </Text>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const user = demoUser;

  const [loggingOut, setLoggingOut] =
    useState(false);

  const openEditProfile = () => {
    router.push(
      "/profile/edit"
    );
  };

  const handleLogout =
    async () => {
      const performLogout =
        async () => {
          setLoggingOut(true);

          try {
            /*
              ==================================
              BACKEND INTEGRATION LATER
              ==================================

              Tumhare backend me logout
              flow already hai.

              Later:

              await authApi.logout();

              await sessionStorage.clear();

              authProvider.logout();

              router.replace("/login");

              Access + Refresh token
              dono clear honge.

              UI ko rewrite nahi karna.
            */

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  400
                )
            );

            router.replace(
              "/login"
            );
          } catch (error) {
            console.error(
              "Logout error:",
              error
            );

            if (
              Platform.OS === "web"
            ) {
              window.alert(
                "Unable to logout."
              );
            } else {
              Alert.alert(
                "Logout Failed",
                "Unable to logout. Please try again."
              );
            }
          } finally {
            setLoggingOut(false);
          }
        };

      if (
        Platform.OS === "web"
      ) {
        const confirmed =
          window.confirm(
            "Are you sure you want to logout?"
          );

        if (confirmed) {
          await performLogout();
        }

        return;
      }

      Alert.alert(
        "Logout",
        "Are you sure you want to logout from ServiGo?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style:
              "destructive",

            onPress:
              performLogout,
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
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row flex-wrap items-center justify-between gap-3"
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
          maxWidth: 1100,
        }}
      >
        {/* Profile Hero */}
        <View className="mb-6 rounded-3xl bg-blue-600 p-7 md:p-8">
          <View className="flex-row flex-wrap items-center gap-6">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
              <Text className="text-3xl font-bold text-blue-700">
                {getInitials(
                  user.name
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
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-3xl font-bold text-white">
                  {user.name}
                </Text>

                {user.emailVerified && (
                  <View className="rounded-full bg-green-100 px-3 py-1">
                    <Text className="text-xs font-bold text-green-700">
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>

              <Text className="mt-2 text-blue-100">
                {user.email}
              </Text>

              <Text className="mt-1 text-blue-100">
                +91 {user.phone}
              </Text>

              <View className="mt-4 flex-row flex-wrap gap-2">
                <View className="rounded-full bg-blue-700 px-3 py-1">
                  <Text className="text-xs font-bold capitalize text-white">
                    {user.role}
                  </Text>
                </View>

                <View className="rounded-full bg-white px-3 py-1">
                  <Text className="text-xs font-bold capitalize text-blue-700">
                    {user.status}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={
                openEditProfile
              }
              className="rounded-xl bg-white px-6 py-4"
            >
              <Text className="font-bold text-blue-700">
                Edit Profile
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Stats */}
        <View className="mb-6 flex-row flex-wrap gap-4">
          <StatCard
            value={String(
              user.totalBookings
            )}
            label="Total Bookings"
          />

          <StatCard
            value={String(
              user.completedBookings
            )}
            label="Completed"
          />

          <StatCard
            value={String(
              user.savedAddresses
            )}
            label="Saved Addresses"
          />

          <StatCard
            value={String(
              user.favoriteProviders
            )}
            label="Favorites"
          />
        </View>

        <View className="flex-row flex-wrap gap-6">
          {/* Left */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 620,
              flexGrow: 2,
            }}
          >
            {/* Account */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Account
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Manage your personal
                information and account
                settings.
              </Text>

              <View className="mt-5 gap-3">
                <MenuItem
                  icon="👤"
                  title="Edit Profile"
                  description="Update your name and mobile number."
                  onPress={
                    openEditProfile
                  }
                />

                <MenuItem
                  icon="📍"
                  title="My Addresses"
                  description="Add, edit and manage service addresses."
                  onPress={() =>
                    router.push(
                      "/addresses"
                    )
                  }
                />

                <MenuItem
                  icon="❤️"
                  title="Favorite Providers"
                  description="View professionals you have saved."
                  onPress={() =>
                    router.push(
                      "/favorites"
                    )
                  }
                />

                <MenuItem
                  icon="🔔"
                  title="Notifications"
                  description="View booking and account notifications."
                  onPress={() =>
                    router.push(
                      "/notifications"
                    )
                  }
                />
              </View>
            </View>

            {/* Services */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                My Services
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Manage your ServiGo
                bookings and service
                activity.
              </Text>

              <View className="mt-5 gap-3">
                <MenuItem
                  icon="📅"
                  title="My Bookings"
                  description="Track upcoming, completed and cancelled services."
                  onPress={() =>
                    router.push(
                      "/bookings"
                    )
                  }
                />

                <MenuItem
                  icon="🛠️"
                  title="Book a Service"
                  description="Browse services and find professionals."
                  onPress={() =>
                    router.push(
                      "/services"
                    )
                  }
                />

                <MenuItem
                  icon="🔎"
                  title="Find Providers"
                  description="Search and compare ServiGo professionals."
                  onPress={() =>
                    router.push(
                      "/providers"
                    )
                  }
                />
              </View>
            </View>

            {/* Security */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Security
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Manage password and
                account verification.
              </Text>

              <View className="mt-5 gap-3">
                <MenuItem
                  icon="🔐"
                  title="Change Password"
                  description="Reset or update your account password."
                  onPress={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                />

                {!user.emailVerified && (
                  <MenuItem
                    icon="✉️"
                    title="Verify Email"
                    description="Verify your email address to secure your account."
                    onPress={() =>
                      router.push(
                        "/verify-email"
                      )
                    }
                  />
                )}
              </View>
            </View>
          </View>

          {/* Right Sidebar */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 340,
              flexGrow: 1,
            }}
          >
            {/* Account Info */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Account Information
              </Text>

              <View className="mt-5 gap-4">
                <View>
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account ID
                  </Text>

                  <Text className="mt-1 font-bold text-slate-900">
                    #{user.id}
                  </Text>
                </View>

                <View className="h-px bg-slate-100" />

                <View>
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Account Type
                  </Text>

                  <Text className="mt-1 font-bold capitalize text-slate-900">
                    {user.role}
                  </Text>
                </View>

                <View className="h-px bg-slate-100" />

                <View>
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Status
                  </Text>

                  <Text
                    className={
                      user.emailVerified
                        ? "mt-1 font-bold text-green-600"
                        : "mt-1 font-bold text-amber-600"
                    }
                  >
                    {user.emailVerified
                      ? "Verified"
                      : "Not Verified"}
                  </Text>
                </View>

                <View className="h-px bg-slate-100" />

                <View>
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Member Since
                  </Text>

                  <Text className="mt-1 font-bold text-slate-900">
                    {user.createdAt}
                  </Text>
                </View>
              </View>
            </View>

            {/* Support */}
            <View className="mb-6 rounded-3xl bg-slate-900 p-6">
              <Text className="text-xl font-bold text-white">
                Need Help?
              </Text>

              <Text className="mt-2 leading-6 text-slate-300">
                Contact ServiGo support
                for booking, payment or
                account assistance.
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    "/support"
                  )
                }
                className="mt-5 items-center rounded-xl bg-white px-5 py-4"
              >
                <Text className="font-bold text-slate-900">
                  Contact Support
                </Text>
              </Pressable>
            </View>

            {/* Logout */}
            <View className="rounded-3xl border border-red-200 bg-white p-6">
              <Text className="text-lg font-bold text-slate-900">
                Sign Out
              </Text>

              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Sign out from this
                device. You can login
                again anytime.
              </Text>

              <Pressable
                disabled={loggingOut}
                onPress={
                  handleLogout
                }
                className={
                  loggingOut
                    ? "mt-5 items-center rounded-xl bg-red-300 px-5 py-4"
                    : "mt-5 items-center rounded-xl bg-red-600 px-5 py-4"
                }
              >
                <Text className="font-bold text-white">
                  {loggingOut
                    ? "Logging Out..."
                    : "Logout"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-7 items-center">
          <Text className="text-center text-xs leading-5 text-slate-400">
            ServiGo account information
            and activity will be loaded
            securely from your logged-in
            account after backend
            integration.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}