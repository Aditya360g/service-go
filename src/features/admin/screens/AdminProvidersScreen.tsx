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

type ProviderStatus =
  | "pending"
  | "active"
  | "suspended";

type ProviderFilter =
  | "all"
  | ProviderStatus;

type Provider = {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  services: number;
  completedJobs: number;
  rating: number;
  joinedAt: string;
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

const initialProviders: Provider[] = [
  {
    id: 5,
    name: "Rahul Provider",
    initials: "RP",
    email: "rahul.provider@example.com",
    phone: "9876543210",
    profession: "Appliance Technician",
    location: "Jaipur",
    services: 3,
    completedJobs: 109,
    rating: 5,
    joinedAt: "10 Sep 2026",
    status: "active",
  },
  {
    id: 2,
    name: "Amit Sharma",
    initials: "AS",
    email: "amit.sharma@example.com",
    phone: "9812345678",
    profession: "Home Service Expert",
    location: "Jaipur",
    services: 2,
    completedJobs: 84,
    rating: 4.8,
    joinedAt: "02 Sep 2026",
    status: "active",
  },
  {
    id: 3,
    name: "Rohit Verma",
    initials: "RV",
    email: "rohit.verma@example.com",
    phone: "9823456789",
    profession: "Electrician",
    location: "Jaipur",
    services: 4,
    completedJobs: 61,
    rating: 4.7,
    joinedAt: "04 Sep 2026",
    status: "active",
  },
  {
    id: 4,
    name: "Vikas Kumar",
    initials: "VK",
    email: "vikas.kumar@example.com",
    phone: "9834567890",
    profession: "Plumber",
    location: "Jaipur",
    services: 3,
    completedJobs: 73,
    rating: 4.9,
    joinedAt: "05 Sep 2026",
    status: "active",
  },
  {
    id: 12,
    name: "Manoj Sharma",
    initials: "MS",
    email: "manoj.sharma@example.com",
    phone: "9845678901",
    profession: "Painter",
    location: "Jaipur",
    services: 3,
    completedJobs: 0,
    rating: 0,
    joinedAt: "17 Sep 2026",
    status: "pending",
  },
  {
    id: 13,
    name: "Ajay Meena",
    initials: "AM",
    email: "ajay.meena@example.com",
    phone: "9856789012",
    profession: "Carpenter",
    location: "Jaipur",
    services: 2,
    completedJobs: 0,
    rating: 0,
    joinedAt: "18 Sep 2026",
    status: "pending",
  },
  {
    id: 14,
    name: "Rakesh Kumar",
    initials: "RK",
    email: "rakesh.kumar@example.com",
    phone: "9867890123",
    profession: "Electrician",
    location: "Jaipur",
    services: 4,
    completedJobs: 0,
    rating: 0,
    joinedAt: "18 Sep 2026",
    status: "pending",
  },
  {
    id: 15,
    name: "Sandeep Singh",
    initials: "SS",
    email: "sandeep.singh@example.com",
    phone: "9878901234",
    profession: "AC Technician",
    location: "Jaipur",
    services: 2,
    completedJobs: 47,
    rating: 4.6,
    joinedAt: "28 Aug 2026",
    status: "suspended",
  },
];

const filters: {
  label: string;
  value: ProviderFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Suspended",
      value: "suspended",
    },
  ];

function getStatusStyle(
  status: ProviderStatus
) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        wrapper:
          "border-green-200 bg-green-50",
        text: "text-green-700",
      };

    case "pending":
      return {
        label: "Pending",
        wrapper:
          "border-amber-200 bg-amber-50",
        text: "text-amber-700",
      };

    case "suspended":
      return {
        label: "Suspended",
        wrapper:
          "border-red-200 bg-red-50",
        text: "text-red-700",
      };
  }
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 170,
        flexBasis: 220,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Text className="text-xl">
            {icon}
          </Text>
        </View>

        <View className="ml-4">
          <Text className="text-2xl font-black text-slate-900">
            {value}
          </Text>

          <Text className="text-sm text-slate-500">
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function AdminProvidersScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [
    providers,
    setProviders,
  ] =
    useState<Provider[]>(
      initialProviders
    );

  const [search, setSearch] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<ProviderFilter>(
      "all"
    );

  const filteredProviders =
    useMemo(() => {
      let result = [
        ...providers,
      ];

      if (filter !== "all") {
        result =
          result.filter(
            (provider) =>
              provider.status ===
              filter
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (provider) =>
              [
                provider.id,
                provider.name,
                provider.email,
                provider.phone,
                provider.profession,
                provider.location,
                provider.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      providers,
      search,
      filter,
    ]);

  const activeCount =
    providers.filter(
      (provider) =>
        provider.status ===
        "active"
    ).length;

  const pendingCount =
    providers.filter(
      (provider) =>
        provider.status ===
        "pending"
    ).length;

  const suspendedCount =
    providers.filter(
      (provider) =>
        provider.status ===
        "suspended"
    ).length;

  const updateStatus = (
    providerId: number,
    status: ProviderStatus
  ) => {
    setProviders(
      (current) =>
        current.map(
          (provider) =>
            provider.id ===
              providerId
              ? {
                ...provider,
                status,
              }
              : provider
        )
    );
  };

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
                    "/admin/providers";

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
                    Providers
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage service providers
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <View className="flex-row items-center">
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
                        "/admin/providers";

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
                  Manage Providers
                </Text>

                <Text className="mt-2 text-slate-500">
                  Review, approve and manage
                  all ServiGo providers.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="🧑‍🔧"
                  label="Total Providers"
                  value={
                    providers.length
                  }
                />

                <StatCard
                  icon="✅"
                  label="Active"
                  value={
                    activeCount
                  }
                />

                <StatCard
                  icon="⏳"
                  label="Pending"
                  value={
                    pendingCount
                  }
                />

                <StatCard
                  icon="🚫"
                  label="Suspended"
                  value={
                    suspendedCount
                  }
                />
              </View>

              {/* SEARCH */}
              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={
                      setSearch
                    }
                    placeholder="Search name, email, phone, profession or location"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* FILTERS */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mb-5"
              >
                <View className="flex-row gap-2">
                  {filters.map(
                    (item) => {
                      const selected =
                        filter ===
                        item.value;

                      return (
                        <Pressable
                          key={
                            item.value
                          }
                          onPress={() =>
                            setFilter(
                              item.value
                            )
                          }
                          className={
                            selected
                              ? "rounded-full bg-blue-600 px-5 py-2.5"
                              : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
                          }
                        >
                          <Text
                            className={
                              selected
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

              {/* PROVIDER LIST */}
              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="border-b border-slate-100 px-5 py-5">
                  <Text className="text-lg font-bold text-slate-900">
                    Provider List
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {
                      filteredProviders.length
                    }{" "}
                    providers found
                  </Text>
                </View>

                {filteredProviders.length >
                  0 ? (
                  filteredProviders.map(
                    (
                      provider,
                      index
                    ) => {
                      const status =
                        getStatusStyle(
                          provider.status
                        );

                      return (
                        <View
                          key={
                            provider.id
                          }
                          className={
                            index !==
                              filteredProviders.length -
                              1
                              ? "border-b border-slate-100 px-5 py-5"
                              : "px-5 py-5"
                          }
                        >
                          <View className="flex-row flex-wrap items-center gap-4">
                            {/* AVATAR */}
                            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                              <Text className="font-bold text-blue-700">
                                {
                                  provider.initials
                                }
                              </Text>
                            </View>

                            {/* PROVIDER */}
                            <View
                              style={{
                                minWidth: 175,
                                flexBasis: 210,
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

                            {/* PROFESSION */}
                            <View
                              style={{
                                minWidth: 150,
                                flexBasis: 180,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {
                                  provider.profession
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                📍{" "}
                                {
                                  provider.location
                                }
                              </Text>
                            </View>

                            {/* CONTACT */}
                            <View
                              style={{
                                minWidth: 190,
                                flexBasis: 220,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="text-sm font-semibold text-slate-700">
                                {
                                  provider.email
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                +91{" "}
                                {
                                  provider.phone
                                }
                              </Text>
                            </View>

                            {/* SERVICES */}
                            <View
                              style={{
                                minWidth: 80,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                {
                                  provider.services
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Services
                              </Text>
                            </View>

                            {/* JOBS */}
                            <View
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                {
                                  provider.completedJobs
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Jobs
                              </Text>
                            </View>

                            {/* RATING */}
                            <View
                              style={{
                                minWidth: 80,
                              }}
                            >
                              <Text className="font-bold text-slate-900">
                                {provider.rating >
                                  0
                                  ? `⭐ ${provider.rating}`
                                  : "—"}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Rating
                              </Text>
                            </View>

                            {/* STATUS */}
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

                            {/* ACTION */}
                            <View
                              style={{
                                minWidth: 180,
                              }}
                            >
                              {provider.status ===
                                "pending" && (
                                  <View className="flex-row gap-2">
                                    <Pressable
                                      onPress={() =>
                                        updateStatus(
                                          provider.id,
                                          "active"
                                        )
                                      }
                                      className="flex-1 rounded-lg bg-green-50 px-3 py-2.5"
                                    >
                                      <Text className="text-center text-xs font-bold text-green-700">
                                        Approve
                                      </Text>
                                    </Pressable>

                                    <Pressable
                                      onPress={() =>
                                        updateStatus(
                                          provider.id,
                                          "suspended"
                                        )
                                      }
                                      className="flex-1 rounded-lg bg-red-50 px-3 py-2.5"
                                    >
                                      <Text className="text-center text-xs font-bold text-red-600">
                                        Reject
                                      </Text>
                                    </Pressable>
                                  </View>
                                )}

                              {provider.status ===
                                "active" && (
                                  <Pressable
                                    onPress={() =>
                                      updateStatus(
                                        provider.id,
                                        "suspended"
                                      )
                                    }
                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5"
                                  >
                                    <Text className="text-center text-xs font-bold text-red-600">
                                      Suspend
                                    </Text>
                                  </Pressable>
                                )}

                              {provider.status ===
                                "suspended" && (
                                  <Pressable
                                    onPress={() =>
                                      updateStatus(
                                        provider.id,
                                        "active"
                                      )
                                    }
                                    className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5"
                                  >
                                    <Text className="text-center text-xs font-bold text-green-700">
                                      Reactivate
                                    </Text>
                                  </Pressable>
                                )}
                            </View>
                          </View>

                          {/* BOTTOM INFO */}
                          <View className="mt-4 flex-row flex-wrap gap-4 border-t border-slate-100 pt-4">
                            <Text className="text-xs text-slate-400">
                              Joined:{" "}
                              {
                                provider.joinedAt
                              }
                            </Text>

                            <Text className="text-xs text-slate-400">
                              ID: #
                              {
                                provider.id
                              }
                            </Text>
                          </View>
                        </View>
                      );
                    }
                  )
                ) : (
                  <View className="items-center px-5 py-16">
                    <Text className="text-5xl">
                      🧑‍🔧
                    </Text>

                    <Text className="mt-4 text-xl font-bold text-slate-900">
                      No providers found
                    </Text>

                    <Text className="mt-2 text-sm text-slate-500">
                      Change search or filter.
                    </Text>

                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setFilter(
                          "all"
                        );
                      }}
                      className="mt-5 rounded-xl bg-blue-600 px-5 py-3"
                    >
                      <Text className="font-bold text-white">
                        Clear Filters
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}