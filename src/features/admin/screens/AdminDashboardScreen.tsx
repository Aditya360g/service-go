import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

type ProviderStatus =
  | "active"
  | "pending"
  | "suspended";

type RecentBooking = {
  id: number;
  customerName: string;
  providerName: string;
  serviceName: string;
  amount: number;
  status: BookingStatus;
};

type PendingProvider = {
  id: number;
  name: string;
  profession: string;
  location: string;
  services: number;
  status: ProviderStatus;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/admin",
  },
  {
    label: "Users",
    icon: "👥",
    route: "/admin/users",
  },
  {
    label: "Providers",
    icon: "🧑‍🔧",
    route: "/admin/providers",
  },
  {
    label: "Services",
    icon: "🛠️",
    route: "/admin/services",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/admin/bookings",
  },
  {
    label: "Payments",
    icon: "₹",
    route: "/admin/payments",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/admin/reviews",
  },
  {
    label: "Reports",
    icon: "📊",
    route: "/admin/reports",
  },
] as const;

const recentBookings: RecentBooking[] = [
  {
    id: 1001,
    customerName: "Aman Sharma",
    providerName: "Rahul Provider",
    serviceName: "Washing Machine Repair",
    amount: 648,
    status: "confirmed",
  },
  {
    id: 1002,
    customerName: "Rohit Jain",
    providerName: "Rahul Provider",
    serviceName: "Appliance Inspection",
    amount: 448,
    status: "pending",
  },
  {
    id: 1003,
    customerName: "Neha Verma",
    providerName: "Amit Sharma",
    serviceName: "Home Cleaning",
    amount: 548,
    status: "completed",
  },
  {
    id: 1004,
    customerName: "Karan Singh",
    providerName: "Vikas Kumar",
    serviceName: "Plumber",
    amount: 348,
    status: "completed",
  },
  {
    id: 1005,
    customerName: "Pooja Mehta",
    providerName: "Sandeep Singh",
    serviceName: "AC Repair",
    amount: 448,
    status: "cancelled",
  },
];

const pendingProviders: PendingProvider[] = [
  {
    id: 12,
    name: "Manoj Sharma",
    profession: "Painter",
    location: "Jaipur",
    services: 3,
    status: "pending",
  },
  {
    id: 13,
    name: "Ajay Meena",
    profession: "Carpenter",
    location: "Jaipur",
    services: 2,
    status: "pending",
  },
  {
    id: 14,
    name: "Rakesh Kumar",
    profession: "Electrician",
    location: "Jaipur",
    services: 4,
    status: "pending",
  },
];

const monthlyData = [
  {
    month: "Apr",
    bookings: 48,
  },
  {
    month: "May",
    bookings: 62,
  },
  {
    month: "Jun",
    bookings: 75,
  },
  {
    month: "Jul",
    bookings: 92,
  },
  {
    month: "Aug",
    bookings: 118,
  },
  {
    month: "Sep",
    bookings: 134,
  },
];

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: string;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 180,
        flexBasis: 210,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
          <Text className="text-xl">
            {icon}
          </Text>
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-2xl font-black text-slate-900">
            {value}
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            {title}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-xs font-semibold text-green-600">
        {change}
      </Text>
    </View>
  );
}

function getBookingStatusStyle(
  status: BookingStatus
) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        wrapper:
          "border-amber-200 bg-amber-50",
        text: "text-amber-700",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        wrapper:
          "border-blue-200 bg-blue-50",
        text: "text-blue-700",
      };

    case "completed":
      return {
        label: "Completed",
        wrapper:
          "border-green-200 bg-green-50",
        text: "text-green-700",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        wrapper:
          "border-red-200 bg-red-50",
        text: "text-red-700",
      };
  }
}

export default function AdminDashboardScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [search, setSearch] =
    useState("");

  const [
    providers,
    setProviders,
  ] =
    useState<PendingProvider[]>(
      pendingProviders
    );

  const filteredBookings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return recentBookings;
      }

      return recentBookings.filter(
        (booking) =>
          [
            booking.id,
            booking.customerName,
            booking.providerName,
            booking.serviceName,
            booking.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [search]);

  const approveProvider = (
    providerId: number
  ) => {
    setProviders(
      (current) =>
        current.filter(
          (provider) =>
            provider.id !==
            providerId
        )
    );
  };

  const rejectProvider = (
    providerId: number
  ) => {
    setProviders(
      (current) =>
        current.filter(
          (provider) =>
            provider.id !==
            providerId
        )
    );
  };

  const maxBookings =
    Math.max(
      ...monthlyData.map(
        (item) =>
          item.bookings
      )
    );

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
                  "/admin"
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
                  Admin Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/admin";

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

            <Pressable
              onPress={() =>
                router.replace(
                  "/login"
                )
              }
              className="mt-auto flex-row items-center rounded-xl px-4 py-4"
            >
              <Text className="text-lg">
                ↪
              </Text>

              <Text className="ml-3 font-semibold text-red-600">
                Logout
              </Text>
            </Pressable>
          </View>
        )}

        {/* MAIN */}
        <View className="flex-1">
          {/* HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between gap-4">
              {!isDesktop && (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <View
                className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4"
                style={{
                  maxWidth: 600,
                  flex: 1,
                }}
              >
                <Text className="mr-2">
                  🔎
                </Text>

                <TextInput
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  placeholder="Search booking, user, provider or service"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3 text-sm text-slate-900 outline-none"
                />
              </View>

              <Pressable
                className="flex-row items-center"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                  <Text className="font-bold text-white">
                    AD
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Admin
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Administrator
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* MOBILE NAV */}
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
                        "/admin";

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
              {/* TITLE */}
              <View className="mb-6">
                <Text className="text-3xl font-black text-slate-900">
                  Admin Dashboard
                </Text>

                <Text className="mt-2 text-slate-500">
                  Overview of ServiGo
                  platform activity.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="👥"
                  title="Total Users"
                  value="1,248"
                  change="+42 this month"
                />

                <StatCard
                  icon="🧑‍🔧"
                  title="Providers"
                  value="186"
                  change="+12 this month"
                />

                <StatCard
                  icon="📅"
                  title="Total Bookings"
                  value="3,842"
                  change="+134 this month"
                />

                <StatCard
                  icon="₹"
                  title="Revenue"
                  value="₹4.82L"
                  change="+16.4% this month"
                />

                <StatCard
                  icon="⭐"
                  title="Avg. Rating"
                  value="4.7"
                  change="Platform average"
                />
              </View>

              {/* TOP GRID */}
              <View className="flex-row flex-wrap gap-5">
                {/* BOOKINGS CHART */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 300,
                    flexBasis: 680,
                    flexGrow: 2,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-bold text-slate-900">
                        Booking Growth
                      </Text>

                      <Text className="mt-1 text-sm text-slate-500">
                        Monthly bookings
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/admin/reports"
                        )
                      }
                    >
                      <Text className="font-semibold text-blue-600">
                        View Reports
                      </Text>
                    </Pressable>
                  </View>

                  <View className="mt-8 flex-row items-end justify-between gap-3">
                    {monthlyData.map(
                      (item) => {
                        const height =
                          Math.max(
                            45,
                            Math.round(
                              (item.bookings /
                                maxBookings) *
                              180
                            )
                          );

                        return (
                          <View
                            key={
                              item.month
                            }
                            className="flex-1 items-center"
                          >
                            <Text className="mb-2 text-xs font-semibold text-slate-500">
                              {
                                item.bookings
                              }
                            </Text>

                            <View
                              className="w-full max-w-[55px] rounded-t-xl bg-blue-500"
                              style={{
                                height,
                              }}
                            />

                            <Text className="mt-2 text-xs font-semibold text-slate-400">
                              {
                                item.month
                              }
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* PLATFORM SUMMARY */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 280,
                    flexBasis: 340,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Platform Status
                  </Text>

                  <View className="mt-5 gap-4">
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="font-semibold text-slate-700">
                          Active Users
                        </Text>

                        <Text className="mt-1 text-xs text-slate-400">
                          Current active accounts
                        </Text>
                      </View>

                      <Text className="font-black text-slate-900">
                        1,176
                      </Text>
                    </View>

                    <View className="border-t border-slate-100 pt-4">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-semibold text-slate-700">
                            Active Providers
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Approved providers
                          </Text>
                        </View>

                        <Text className="font-black text-green-600">
                          174
                        </Text>
                      </View>
                    </View>

                    <View className="border-t border-slate-100 pt-4">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-semibold text-slate-700">
                            Pending Providers
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Waiting approval
                          </Text>
                        </View>

                        <Text className="font-black text-amber-600">
                          {providers.length}
                        </Text>
                      </View>
                    </View>

                    <View className="border-t border-slate-100 pt-4">
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="font-semibold text-slate-700">
                            Active Services
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Available categories
                          </Text>
                        </View>

                        <Text className="font-black text-slate-900">
                          38
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* RECENT BOOKINGS */}
              <View className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Recent Bookings
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Latest bookings
                      across ServiGo
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/bookings"
                      )
                    }
                  >
                    <Text className="font-semibold text-blue-600">
                      View All
                    </Text>
                  </Pressable>
                </View>

                {filteredBookings.length >
                  0 ? (
                  filteredBookings.map(
                    (
                      booking,
                      index
                    ) => {
                      const status =
                        getBookingStatusStyle(
                          booking.status
                        );

                      return (
                        <Pressable
                          key={
                            booking.id
                          }
                          onPress={() =>
                            router.push(
                              "/admin/bookings"
                            )
                          }
                          className={
                            index !==
                              filteredBookings.length -
                              1
                              ? "border-b border-slate-100 px-5 py-5"
                              : "px-5 py-5"
                          }
                        >
                          <View className="flex-row flex-wrap items-center gap-4">
                            <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                              <Text className="font-bold text-blue-700">
                                #
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 140,
                                flexBasis: 180,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-bold text-slate-900">
                                #
                                {
                                  booking.id
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Booking ID
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 160,
                                flexBasis: 200,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {
                                  booking.customerName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Customer
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 170,
                                flexBasis: 220,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {
                                  booking.serviceName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                {
                                  booking.providerName
                                }
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                ₹
                                {
                                  booking.amount
                                }
                              </Text>
                            </View>

                            <View
                              className={`rounded-full border px-3 py-1.5 ${status.wrapper}`}
                            >
                              <Text
                                className={`text-xs font-bold ${status.text}`}
                              >
                                {
                                  status.label
                                }
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      );
                    }
                  )
                ) : (
                  <View className="items-center px-5 py-12">
                    <Text className="text-4xl">
                      🔎
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      No booking found
                    </Text>
                  </View>
                )}
              </View>

              {/* PROVIDER APPROVALS */}
              <View className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Pending Provider Approvals
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Review new provider
                      registrations
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/providers"
                      )
                    }
                  >
                    <Text className="font-semibold text-blue-600">
                      Manage Providers
                    </Text>
                  </Pressable>
                </View>

                {providers.length > 0 ? (
                  providers.map(
                    (
                      provider,
                      index
                    ) => (
                      <View
                        key={
                          provider.id
                        }
                        className={
                          index !==
                            providers.length -
                            1
                            ? "border-b border-slate-100 px-5 py-5"
                            : "px-5 py-5"
                        }
                      >
                        <View className="flex-row flex-wrap items-center gap-4">
                          <View className="h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                            <Text className="font-bold text-violet-700">
                              {provider.name
                                .split(
                                  " "
                                )
                                .map(
                                  (
                                    word
                                  ) =>
                                    word[0]
                                )
                                .slice(
                                  0,
                                  2
                                )
                                .join(
                                  ""
                                )}
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 170,
                              flexBasis: 220,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="font-bold text-slate-900">
                              {
                                provider.name
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              Provider #
                              {
                                provider.id
                              }
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 150,
                              flexBasis: 200,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="font-semibold text-slate-700">
                              {
                                provider.profession
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              {
                                provider.location
                              }
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 100,
                            }}
                          >
                            <Text className="font-bold text-slate-900">
                              {
                                provider.services
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              Services
                            </Text>
                          </View>

                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={() =>
                                approveProvider(
                                  provider.id
                                )
                              }
                              className="rounded-lg bg-green-50 px-4 py-2.5"
                            >
                              <Text className="text-xs font-bold text-green-700">
                                Approve
                              </Text>
                            </Pressable>

                            <Pressable
                              onPress={() =>
                                rejectProvider(
                                  provider.id
                                )
                              }
                              className="rounded-lg bg-red-50 px-4 py-2.5"
                            >
                              <Text className="text-xs font-bold text-red-600">
                                Reject
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    )
                  )
                ) : (
                  <View className="items-center px-5 py-12">
                    <Text className="text-4xl">
                      ✅
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      No pending providers
                    </Text>
                  </View>
                )}
              </View>

              {/* QUICK ACTIONS */}
              <View className="mt-5">
                <Text className="mb-4 text-lg font-bold text-slate-900">
                  Quick Actions
                </Text>

                <View className="flex-row flex-wrap gap-4">
                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/users"
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-2xl">
                      👥
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      Manage Users
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      View user accounts
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/providers"
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-2xl">
                      🧑‍🔧
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      Providers
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Manage providers
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/services"
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-2xl">
                      🛠️
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      Services
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Manage service catalog
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/payments"
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-2xl">
                      ₹
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      Payments
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      View transactions
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/reports"
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{
                      minWidth: 180,
                      flexBasis: 220,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-2xl">
                      📊
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      Reports
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Platform analytics
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}