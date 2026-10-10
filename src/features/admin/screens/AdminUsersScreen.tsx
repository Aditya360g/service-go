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

type UserRole =
  | "customer"
  | "provider"
  | "admin";

type UserStatus =
  | "active"
  | "suspended";

type UserFilter =
  | "all"
  | UserRole
  | "suspended";

type User = {
  id: number;
  name: string;
  initials: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  bookings: number;
  joinedAt: string;
  status: UserStatus;
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

const initialUsers: User[] = [
  {
    id: 1,
    name: "Aman Sharma",
    initials: "AS",
    email: "aman.sharma@example.com",
    phone: "9876543210",
    role: "customer",
    location: "Vaishali Nagar, Jaipur",
    bookings: 8,
    joinedAt: "01 Sep 2026",
    status: "active",
  },
  {
    id: 2,
    name: "Amit Sharma",
    initials: "AS",
    email: "amit.provider@example.com",
    phone: "9812345678",
    role: "provider",
    location: "Mansarovar, Jaipur",
    bookings: 84,
    joinedAt: "02 Sep 2026",
    status: "active",
  },
  {
    id: 3,
    name: "Rohit Jain",
    initials: "RJ",
    email: "rohit.jain@example.com",
    phone: "9876501234",
    role: "customer",
    location: "Mansarovar, Jaipur",
    bookings: 4,
    joinedAt: "05 Sep 2026",
    status: "active",
  },
  {
    id: 4,
    name: "Neha Verma",
    initials: "NV",
    email: "neha.verma@example.com",
    phone: "9812345670",
    role: "customer",
    location: "C Scheme, Jaipur",
    bookings: 6,
    joinedAt: "07 Sep 2026",
    status: "active",
  },
  {
    id: 5,
    name: "Rahul Provider",
    initials: "RP",
    email: "rahul.provider@example.com",
    phone: "9898989898",
    role: "provider",
    location: "Vaishali Nagar, Jaipur",
    bookings: 109,
    joinedAt: "10 Sep 2026",
    status: "active",
  },
  {
    id: 6,
    name: "Karan Singh",
    initials: "KS",
    email: "karan.singh@example.com",
    phone: "9823456789",
    role: "customer",
    location: "Jagatpura, Jaipur",
    bookings: 3,
    joinedAt: "11 Sep 2026",
    status: "active",
  },
  {
    id: 7,
    name: "Pooja Mehta",
    initials: "PM",
    email: "pooja.mehta@example.com",
    phone: "9834567890",
    role: "customer",
    location: "Malviya Nagar, Jaipur",
    bookings: 5,
    joinedAt: "12 Sep 2026",
    status: "suspended",
  },
  {
    id: 8,
    name: "Vikas Kumar",
    initials: "VK",
    email: "vikas.provider@example.com",
    phone: "9845678901",
    role: "provider",
    location: "C Scheme, Jaipur",
    bookings: 73,
    joinedAt: "13 Sep 2026",
    status: "active",
  },
  {
    id: 9,
    name: "Admin",
    initials: "AD",
    email: "admin@servigo.com",
    phone: "9000000000",
    role: "admin",
    location: "Jaipur",
    bookings: 0,
    joinedAt: "01 Aug 2026",
    status: "active",
  },
  {
    id: 10,
    name: "Deepak Sharma",
    initials: "DS",
    email: "deepak.sharma@example.com",
    phone: "9856789012",
    role: "customer",
    location: "Tonk Road, Jaipur",
    bookings: 2,
    joinedAt: "16 Sep 2026",
    status: "active",
  },
];

const filters: {
  label: string;
  value: UserFilter;
}[] = [
    {
      label: "All Users",
      value: "all",
    },
    {
      label: "Customers",
      value: "customer",
    },
    {
      label: "Providers",
      value: "provider",
    },
    {
      label: "Admins",
      value: "admin",
    },
    {
      label: "Suspended",
      value: "suspended",
    },
  ];

function getRoleStyle(role: UserRole) {
  switch (role) {
    case "customer":
      return {
        label: "Customer",
        wrapper: "bg-blue-50",
        text: "text-blue-700",
      };

    case "provider":
      return {
        label: "Provider",
        wrapper: "bg-violet-50",
        text: "text-violet-700",
      };

    case "admin":
      return {
        label: "Admin",
        wrapper: "bg-slate-900",
        text: "text-white",
      };
  }
}

function getStatusStyle(status: UserStatus) {
  if (status === "active") {
    return {
      label: "Active",
      wrapper:
        "border-green-200 bg-green-50",
      text: "text-green-700",
    };
  }

  return {
    label: "Suspended",
    wrapper:
      "border-red-200 bg-red-50",
    text: "text-red-700",
  };
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

export default function AdminUsersScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [users, setUsers] =
    useState<User[]>(
      initialUsers
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<UserFilter>(
      "all"
    );

  const filteredUsers =
    useMemo(() => {
      let result = [
        ...users,
      ];

      if (
        filter === "suspended"
      ) {
        result =
          result.filter(
            (user) =>
              user.status ===
              "suspended"
          );
      } else if (
        filter !== "all"
      ) {
        result =
          result.filter(
            (user) =>
              user.role ===
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
            (user) =>
              [
                user.id,
                user.name,
                user.email,
                user.phone,
                user.role,
                user.location,
                user.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      users,
      search,
      filter,
    ]);

  const customerCount =
    users.filter(
      (user) =>
        user.role ===
        "customer"
    ).length;

  const providerCount =
    users.filter(
      (user) =>
        user.role ===
        "provider"
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role ===
        "admin"
    ).length;

  const suspendedCount =
    users.filter(
      (user) =>
        user.status ===
        "suspended"
    ).length;

  const toggleStatus = (
    userId: number
  ) => {
    setUsers(
      (current) =>
        current.map(
          (user) =>
            user.id ===
              userId
              ? {
                ...user,
                status:
                  user.status ===
                    "active"
                    ? "suspended"
                    : "active",
              }
              : user
        )
    );
  };

  const deleteUser = (
    userId: number
  ) => {
    setUsers(
      (current) =>
        current.filter(
          (user) =>
            user.id !==
            userId
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
                    "/admin/users";

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
                    Users
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage ServiGo user accounts
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
                        "/admin/users";

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
                  Manage Users
                </Text>

                <Text className="mt-2 text-slate-500">
                  View and manage customers,
                  providers and admin accounts.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="👥"
                  label="Total Users"
                  value={users.length}
                />

                <StatCard
                  icon="👤"
                  label="Customers"
                  value={customerCount}
                />

                <StatCard
                  icon="🧑‍🔧"
                  label="Providers"
                  value={providerCount}
                />

                <StatCard
                  icon="🛡️"
                  label="Admins"
                  value={adminCount}
                />

                <StatCard
                  icon="🚫"
                  label="Suspended"
                  value={suspendedCount}
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
                    placeholder="Search name, email, phone, role or location"
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

              {/* USERS LIST */}
              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="border-b border-slate-100 px-5 py-5">
                  <Text className="text-lg font-bold text-slate-900">
                    User Accounts
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {
                      filteredUsers.length
                    }{" "}
                    users found
                  </Text>
                </View>

                {filteredUsers.length >
                  0 ? (
                  filteredUsers.map(
                    (
                      user,
                      index
                    ) => {
                      const role =
                        getRoleStyle(
                          user.role
                        );

                      const status =
                        getStatusStyle(
                          user.status
                        );

                      return (
                        <View
                          key={
                            user.id
                          }
                          className={
                            index !==
                              filteredUsers.length -
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
                                  user.initials
                                }
                              </Text>
                            </View>

                            {/* NAME */}
                            <View
                              style={{
                                minWidth: 165,
                                flexBasis: 190,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-bold text-slate-900">
                                {
                                  user.name
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                User #
                                {
                                  user.id
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
                                  user.email
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                +91{" "}
                                {
                                  user.phone
                                }
                              </Text>
                            </View>

                            {/* LOCATION */}
                            <View
                              style={{
                                minWidth: 160,
                                flexBasis: 190,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="text-sm font-semibold text-slate-700">
                                📍{" "}
                                {
                                  user.location
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Location
                              </Text>
                            </View>

                            {/* BOOKINGS */}
                            <View
                              style={{
                                minWidth: 80,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                {
                                  user.bookings
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                {user.role ===
                                  "provider"
                                  ? "Jobs"
                                  : "Bookings"}
                              </Text>
                            </View>

                            {/* ROLE */}
                            <View
                              className={`rounded-full px-3 py-1.5 ${role.wrapper}`}
                            >
                              <Text
                                className={`text-xs font-bold ${role.text}`}
                              >
                                {
                                  role.label
                                }
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

                            {/* ACTIONS */}
                            <View
                              className="flex-row gap-2"
                              style={{
                                minWidth: 180,
                              }}
                            >
                              {user.role !==
                                "admin" ? (
                                <>
                                  <Pressable
                                    onPress={() =>
                                      toggleStatus(
                                        user.id
                                      )
                                    }
                                    className={
                                      user.status ===
                                        "active"
                                        ? "flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5"
                                        : "flex-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5"
                                    }
                                  >
                                    <Text
                                      className={
                                        user.status ===
                                          "active"
                                          ? "text-center text-xs font-bold text-amber-700"
                                          : "text-center text-xs font-bold text-green-700"
                                      }
                                    >
                                      {user.status ===
                                        "active"
                                        ? "Suspend"
                                        : "Activate"}
                                    </Text>
                                  </Pressable>

                                  <Pressable
                                    onPress={() =>
                                      deleteUser(
                                        user.id
                                      )
                                    }
                                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5"
                                  >
                                    <Text className="text-center text-xs font-bold text-red-600">
                                      Delete
                                    </Text>
                                  </Pressable>
                                </>
                              ) : (
                                <View className="flex-1 rounded-lg bg-slate-100 px-3 py-2.5">
                                  <Text className="text-center text-xs font-bold text-slate-500">
                                    Protected
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>

                          {/* BOTTOM */}
                          <View className="mt-4 flex-row flex-wrap gap-4 border-t border-slate-100 pt-4">
                            <Text className="text-xs text-slate-400">
                              Joined:{" "}
                              {
                                user.joinedAt
                              }
                            </Text>

                            <Text className="text-xs text-slate-400">
                              Account ID: #
                              {
                                user.id
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
                      👥
                    </Text>

                    <Text className="mt-4 text-xl font-bold text-slate-900">
                      No users found
                    </Text>

                    <Text className="mt-2 text-center text-sm text-slate-500">
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