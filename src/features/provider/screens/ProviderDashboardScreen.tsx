import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
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
  | "completed";

type DashboardBooking = {
  id: number;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
};

type ProviderService = {
  id: number;
  serviceName: string;
  price: number;
  bookings: number;
  active: boolean;
};

type ReviewItem = {
  id: number;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type SidebarItem = {
  label: string;
  icon: string;
  route:
  | "/provider"
  | "/provider/bookings"
  | "/provider/services"
  | "/provider/availability"
  | "/provider/earnings"
  | "/provider/reviews"
  | "/provider/profile";
};

const sidebarItems: SidebarItem[] = [
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
];

const recentBookings: DashboardBooking[] = [
  {
    id: 1001,
    customerName: "Aman Sharma",
    serviceName: "Washing Machine Repair",
    date: "18 Sep 2026",
    time: "4:00 PM",
    location: "Vaishali Nagar",
    amount: 599,
    status: "confirmed",
  },
  {
    id: 1002,
    customerName: "Rohit Jain",
    serviceName: "Appliance Inspection",
    date: "18 Sep 2026",
    time: "6:00 PM",
    location: "Mansarovar",
    amount: 399,
    status: "pending",
  },
  {
    id: 1003,
    customerName: "Neha Verma",
    serviceName: "Washing Machine Repair",
    date: "17 Sep 2026",
    time: "2:30 PM",
    location: "C Scheme",
    amount: 599,
    status: "completed",
  },
  {
    id: 1004,
    customerName: "Karan Singh",
    serviceName: "Appliance Inspection",
    date: "17 Sep 2026",
    time: "11:00 AM",
    location: "Jagatpura",
    amount: 399,
    status: "completed",
  },
];

const services: ProviderService[] = [
  {
    id: 501,
    serviceName: "Washing Machine Repair",
    price: 599,
    bookings: 68,
    active: true,
  },
  {
    id: 502,
    serviceName: "Appliance Inspection",
    price: 399,
    bookings: 31,
    active: true,
  },
  {
    id: 503,
    serviceName: "Installation Service",
    price: 499,
    bookings: 22,
    active: false,
  },
];

const reviews: ReviewItem[] = [
  {
    id: 1,
    customerName: "Neha Verma",
    serviceName: "Washing Machine Repair",
    rating: 5,
    comment:
      "Very professional and completed the repair quickly.",
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    customerName: "Karan Singh",
    serviceName: "Appliance Inspection",
    rating: 5,
    comment:
      "Good behaviour and clearly explained the issue.",
    createdAt: "Yesterday",
  },
  {
    id: 3,
    customerName: "Pooja Mehta",
    serviceName: "Washing Machine Repair",
    rating: 4,
    comment:
      "Service was good and provider arrived on time.",
    createdAt: "2 days ago",
  },
];

const weeklyEarnings = [
  {
    day: "Mon",
    amount: 1200,
  },
  {
    day: "Tue",
    amount: 2200,
  },
  {
    day: "Wed",
    amount: 1700,
  },
  {
    day: "Thu",
    amount: 2900,
  },
  {
    day: "Fri",
    amount: 2500,
  },
  {
    day: "Sat",
    amount: 3600,
  },
  {
    day: "Sun",
    amount: 3100,
  },
];

function getBookingStatusStyle(
  status: BookingStatus
) {
  switch (status) {
    case "pending":
      return {
        wrapper:
          "bg-amber-50 border-amber-200",
        text: "text-amber-700",
      };

    case "confirmed":
      return {
        wrapper:
          "bg-blue-50 border-blue-200",
        text: "text-blue-700",
      };

    case "completed":
      return {
        wrapper:
          "bg-green-50 border-green-200",
        text: "text-green-700",
      };
  }
}

function StatCard({
  icon,
  iconClass,
  value,
  label,
  trend,
}: {
  icon: string;
  iconClass: string;
  value: string;
  label: string;
  trend: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 180,
        flexBasis: 190,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View
          className={`h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Text className="text-xl">
            {icon}
          </Text>
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-2xl font-bold text-slate-900">
            {value}
          </Text>

          <Text className="mt-0.5 text-sm text-slate-500">
            {label}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-xs font-semibold text-green-600">
        {trend}
      </Text>
    </View>
  );
}

function SidebarButton({
  item,
  active = false,
}: {
  item: SidebarItem;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={() =>
        router.push(item.route)
      }
      className={
        active
          ? "flex-row items-center rounded-xl bg-blue-50 px-4 py-4"
          : "flex-row items-center rounded-xl px-4 py-4"
      }
    >
      <View className="w-8 items-center">
        <Text
          className={
            active
              ? "text-xl text-blue-600"
              : "text-xl text-slate-500"
          }
        >
          {item.icon}
        </Text>
      </View>

      <Text
        className={
          active
            ? "ml-3 font-bold text-blue-700"
            : "ml-3 font-semibold text-slate-600"
        }
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function ProviderDashboardScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [search, setSearch] =
    useState("");

  const [
    availableToday,
    setAvailableToday,
  ] = useState(true);

  const [
    notifications,
    setNotifications,
  ] = useState(3);

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
            booking.customerName,
            booking.serviceName,
            booking.location,
            booking.status,
            String(booking.id),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [search]);

  const handleLogout = () => {
    const performLogout = () => {
      /*
        BACKEND INTEGRATION LATER

        await authApi.logout();
        clear access token
        clear refresh token
        clear provider session
      */

      router.replace("/login");
    };

    if (Platform.OS === "web") {
      const confirmed =
        window.confirm(
          "Are you sure you want to logout?"
        );

      if (confirmed) {
        performLogout();
      }

      return;
    }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress:
            performLogout,
        },
      ]
    );
  };

  const maxEarning =
    Math.max(
      ...weeklyEarnings.map(
        (item) => item.amount
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
        {/* DESKTOP SIDEBAR */}
        {isDesktop && (
          <View
            className="border-r border-slate-200 bg-white px-5 py-6"
            style={{
              width: 250,
            }}
          >
            {/* BRAND */}
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

            {/* SIDEBAR NAV */}
            <View className="gap-1">
              {sidebarItems.map(
                (item) => (
                  <SidebarButton
                    key={item.label}
                    item={item}
                    active={
                      item.route ===
                      "/provider"
                    }
                  />
                )
              )}
            </View>

            {/* PROVIDER STATUS */}
            <View className="mt-8 rounded-2xl bg-slate-50 p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-bold text-slate-900">
                    Availability
                  </Text>

                  <Text className="mt-1 text-xs text-slate-500">
                    Accept new bookings
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    setAvailableToday(
                      (current) =>
                        !current
                    )
                  }
                  className={
                    availableToday
                      ? "h-7 w-12 justify-center rounded-full bg-green-500 px-1"
                      : "h-7 w-12 justify-center rounded-full bg-slate-300 px-1"
                  }
                >
                  <View
                    className="h-5 w-5 rounded-full bg-white"
                    style={{
                      alignSelf:
                        availableToday
                          ? "flex-end"
                          : "flex-start",
                    }}
                  />
                </Pressable>
              </View>

              <View
                className={
                  availableToday
                    ? "mt-3 self-start rounded-full bg-green-100 px-3 py-1.5"
                    : "mt-3 self-start rounded-full bg-slate-200 px-3 py-1.5"
                }
              >
                <Text
                  className={
                    availableToday
                      ? "text-xs font-bold text-green-700"
                      : "text-xs font-bold text-slate-600"
                  }
                >
                  {availableToday
                    ? "● Available Today"
                    : "Offline"}
                </Text>
              </View>
            </View>

            {/* LOGOUT */}
            <Pressable
              onPress={
                handleLogout
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
          {/* TOP HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between gap-4">
              {!isDesktop && (
                <Pressable
                  onPress={() =>
                    router.push(
                      "/provider/profile"
                    )
                  }
                >
                  <Text className="text-xl font-black text-blue-600">
                    ServiGo
                  </Text>
                </Pressable>
              )}

              <View
                className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4"
                style={{
                  maxWidth: 620,
                  flex: 1,
                }}
              >
                <Text className="mr-2 text-lg text-slate-400">
                  ⌕
                </Text>

                <TextInput
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  placeholder="Search booking, customer or service"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 py-3 text-sm text-slate-900 outline-none"
                />
              </View>

              <View className="flex-row items-center gap-4">
                <Pressable
                  onPress={() => {
                    setNotifications(
                      0
                    );
                  }}
                  className="relative h-10 w-10 items-center justify-center rounded-full bg-slate-50"
                >
                  <Text className="text-xl">
                    🔔
                  </Text>

                  {notifications >
                    0 && (
                      <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1">
                        <Text className="text-[10px] font-bold text-white">
                          {
                            notifications
                          }
                        </Text>
                      </View>
                    )}
                </Pressable>

                {isDesktop && (
                  <Pressable
                    onPress={() =>
                      router.push(
                        "/provider/profile"
                      )
                    }
                    className="flex-row items-center"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Text className="font-bold text-blue-700">
                        RP
                      </Text>
                    </View>

                    <View className="ml-3">
                      <Text className="font-bold text-slate-900">
                        Rahul Provider
                      </Text>

                      <Text className="text-xs text-slate-400">
                        Appliance Technician
                      </Text>
                    </View>

                    <Text className="ml-2 text-slate-400">
                      ⌄
                    </Text>
                  </Pressable>
                )}
              </View>
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
                    (item) => (
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
                          item.route ===
                            "/provider"
                            ? "rounded-full bg-blue-600 px-4 py-2.5"
                            : "rounded-full border border-slate-200 bg-white px-4 py-2.5"
                        }
                      >
                        <Text
                          className={
                            item.route ===
                              "/provider"
                              ? "font-semibold text-white"
                              : "font-semibold text-slate-600"
                          }
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )
                  )}
                </View>
              </ScrollView>
            )}
          </View>

          {/* CONTENT */}
          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 60,
            }}
          >
            <View className="p-5 md:p-8">
              {/* WELCOME */}
              <View className="mb-6 flex-row flex-wrap items-center justify-between gap-4">
                <View>
                  <Text className="text-3xl font-black text-slate-900">
                    Welcome back,
                    Rahul! 👋
                  </Text>

                  <Text className="mt-2 text-slate-500">
                    Here's what's
                    happening with your
                    ServiGo business today.
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  <Pressable
                    onPress={() =>
                      router.push(
                        "/provider/availability"
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3"
                  >
                    <Text className="font-bold text-slate-700">
                      Set Availability
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/provider/services"
                      )
                    }
                    className="rounded-xl bg-blue-600 px-5 py-3"
                  >
                    <Text className="font-bold text-white">
                      + Add Service
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="📅"
                  iconClass="bg-blue-50"
                  value="4"
                  label="Today's Bookings"
                  trend="+2 from yesterday"
                />

                <StatCard
                  icon="⏳"
                  iconClass="bg-amber-50"
                  value="3"
                  label="Pending Requests"
                  trend="Needs your action"
                />

                <StatCard
                  icon="₹"
                  iconClass="bg-green-50"
                  value="₹17.2K"
                  label="This Week"
                  trend="+18% this week"
                />

                <StatCard
                  icon="⭐"
                  iconClass="bg-violet-50"
                  value="5.0"
                  label="Provider Rating"
                  trend="42 customer reviews"
                />

                <StatCard
                  icon="✓"
                  iconClass="bg-pink-50"
                  value="109"
                  label="Completed Jobs"
                  trend="+12 this month"
                />
              </View>

              {/* MAIN GRID */}
              <View className="flex-row flex-wrap gap-5">
                {/* RECENT BOOKINGS */}
                <View
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  style={{
                    minWidth: 300,
                    flexBasis: 700,
                    flexGrow: 2,
                  }}
                >
                  <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                    <View>
                      <Text className="text-lg font-bold text-slate-900">
                        Recent Bookings
                      </Text>

                      <Text className="mt-1 text-xs text-slate-400">
                        Latest customer
                        service requests
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/bookings"
                        )
                      }
                    >
                      <Text className="font-semibold text-blue-600">
                        View all
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
                        const style =
                          getBookingStatusStyle(
                            booking.status
                          );

                        return (
                          <Pressable
                            key={
                              booking.id
                            }
                            onPress={() =>
                              router.push({
                                pathname:
                                  "/provider/bookings/[bookingId]",
                                params: {
                                  bookingId:
                                    String(
                                      booking.id
                                    ),
                                },
                              })
                            }
                            className={
                              index !==
                                filteredBookings.length -
                                1
                                ? "border-b border-slate-100 px-5 py-4"
                                : "px-5 py-4"
                            }
                          >
                            <View className="flex-row flex-wrap items-center gap-4">
                              <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                                <Text className="font-bold text-blue-700">
                                  {booking.customerName
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
                                  flexGrow: 1,
                                  flexBasis: 220,
                                }}
                              >
                                <Text className="font-bold text-slate-900">
                                  {
                                    booking.customerName
                                  }
                                </Text>

                                <Text className="mt-1 text-sm text-slate-500">
                                  {
                                    booking.serviceName
                                  }
                                </Text>
                              </View>

                              <View
                                style={{
                                  minWidth: 120,
                                }}
                              >
                                <Text className="text-sm font-semibold text-slate-700">
                                  {
                                    booking.date
                                  }
                                </Text>

                                <Text className="mt-1 text-xs text-slate-400">
                                  {
                                    booking.time
                                  }
                                </Text>
                              </View>

                              <View
                                style={{
                                  minWidth: 110,
                                }}
                              >
                                <Text className="font-bold text-slate-900">
                                  ₹
                                  {
                                    booking.amount
                                  }
                                </Text>
                              </View>

                              <View
                                className={`rounded-full border px-3 py-1.5 ${style.wrapper}`}
                              >
                                <Text
                                  className={`text-xs font-bold capitalize ${style.text}`}
                                >
                                  {
                                    booking.status
                                  }
                                </Text>
                              </View>

                              <Text className="text-slate-400">
                                ›
                              </Text>
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

                      <Text className="mt-1 text-sm text-slate-500">
                        Try another search.
                      </Text>
                    </View>
                  )}
                </View>

                {/* RIGHT SIDE */}
                <View
                  style={{
                    minWidth: 280,
                    flexBasis: 340,
                    flexGrow: 1,
                  }}
                >
                  {/* PERFORMANCE */}
                  <View className="rounded-2xl border border-slate-200 bg-white p-5">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold text-slate-900">
                        Performance
                      </Text>

                      <Text className="text-xs font-semibold text-green-600">
                        Excellent
                      </Text>
                    </View>

                    <View className="mt-5 items-center">
                      <View className="h-24 w-24 items-center justify-center rounded-full border-[8px] border-blue-100">
                        <Text className="text-2xl font-black text-slate-900">
                          5.0
                        </Text>

                        <Text className="text-xs text-slate-400">
                          Rating
                        </Text>
                      </View>
                    </View>

                    <View className="mt-5 gap-3">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-slate-500">
                          Completion rate
                        </Text>

                        <Text className="font-bold text-slate-900">
                          96%
                        </Text>
                      </View>

                      <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <View
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: "96%",
                          }}
                        />
                      </View>

                      <View className="mt-2 flex-row justify-between">
                        <Text className="text-sm text-slate-500">
                          Response rate
                        </Text>

                        <Text className="font-bold text-slate-900">
                          92%
                        </Text>
                      </View>

                      <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <View
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: "92%",
                          }}
                        />
                      </View>

                      <View className="mt-2 flex-row justify-between">
                        <Text className="text-sm text-slate-500">
                          On-time rate
                        </Text>

                        <Text className="font-bold text-slate-900">
                          94%
                        </Text>
                      </View>

                      <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <View
                          className="h-full rounded-full bg-violet-500"
                          style={{
                            width: "94%",
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  {/* QUICK ACTIONS */}
                  <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <Text className="text-lg font-bold text-slate-900">
                      Quick Actions
                    </Text>

                    <View className="mt-4 gap-3">
                      <Pressable
                        onPress={() =>
                          router.push(
                            "/provider/bookings"
                          )
                        }
                        className="flex-row items-center rounded-xl bg-slate-50 p-4"
                      >
                        <Text className="text-xl">
                          📅
                        </Text>

                        <Text className="ml-3 flex-1 font-semibold text-slate-700">
                          Manage Bookings
                        </Text>

                        <Text className="text-slate-400">
                          ›
                        </Text>
                      </Pressable>

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
                          Set Availability
                        </Text>

                        <Text className="text-slate-400">
                          ›
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

              {/* SECOND ROW */}
              <View className="mt-5 flex-row flex-wrap gap-5">
                {/* EARNINGS */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 300,
                    flexBasis: 650,
                    flexGrow: 2,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-bold text-slate-900">
                        Weekly Earnings
                      </Text>

                      <Text className="mt-1 text-xs text-slate-400">
                        Earnings performance
                        this week
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/earnings"
                        )
                      }
                    >
                      <Text className="font-semibold text-blue-600">
                        View details
                      </Text>
                    </Pressable>
                  </View>

                  <View className="mt-6 flex-row items-end justify-between gap-2">
                    {weeklyEarnings.map(
                      (item) => {
                        const barHeight =
                          Math.max(
                            35,
                            Math.round(
                              (item.amount /
                                maxEarning) *
                              170
                            )
                          );

                        return (
                          <View
                            key={
                              item.day
                            }
                            className="flex-1 items-center"
                          >
                            <Text className="mb-2 text-xs font-semibold text-slate-500">
                              ₹
                              {(
                                item.amount /
                                1000
                              ).toFixed(
                                1
                              )}
                              K
                            </Text>

                            <View
                              className="w-full max-w-[48px] rounded-t-xl bg-blue-500"
                              style={{
                                height:
                                  barHeight,
                              }}
                            />

                            <Text className="mt-2 text-xs font-semibold text-slate-400">
                              {
                                item.day
                              }
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* SERVICES */}
                <View
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  style={{
                    minWidth: 280,
                    flexBasis: 390,
                    flexGrow: 1,
                  }}
                >
                  <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                    <Text className="text-lg font-bold text-slate-900">
                      My Services
                    </Text>

                    <Pressable
                      onPress={() =>
                        router.push(
                          "/provider/services"
                        )
                      }
                    >
                      <Text className="font-semibold text-blue-600">
                        View all
                      </Text>
                    </Pressable>
                  </View>

                  {services.map(
                    (service) => (
                      <View
                        key={
                          service.id
                        }
                        className="border-b border-slate-100 px-5 py-4"
                      >
                        <View className="flex-row items-center">
                          <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            <Text>
                              🛠️
                            </Text>
                          </View>

                          <View className="ml-3 flex-1">
                            <Text className="font-bold text-slate-900">
                              {
                                service.serviceName
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              {
                                service.bookings
                              }{" "}
                              bookings
                            </Text>
                          </View>

                          <View className="items-end">
                            <Text className="font-bold text-slate-900">
                              ₹
                              {
                                service.price
                              }
                            </Text>

                            <Text
                              className={
                                service.active
                                  ? "mt-1 text-xs font-semibold text-green-600"
                                  : "mt-1 text-xs font-semibold text-slate-400"
                              }
                            >
                              {service.active
                                ? "● Active"
                                : "Inactive"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>

              {/* REVIEWS */}
              <View className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Recent Reviews
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      What customers are
                      saying about your
                      service
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/provider/reviews"
                      )
                    }
                  >
                    <Text className="font-semibold text-blue-600">
                      View all
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row flex-wrap">
                  {reviews.map(
                    (review) => (
                      <View
                        key={
                          review.id
                        }
                        className="p-5"
                        style={{
                          minWidth: 260,
                          flexBasis: 340,
                          flexGrow: 1,
                        }}
                      >
                        <View className="flex-row items-center">
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <Text className="font-bold text-slate-700">
                              {review.customerName
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

                          <View className="ml-3 flex-1">
                            <Text className="font-bold text-slate-900">
                              {
                                review.customerName
                              }
                            </Text>

                            <Text className="text-xs text-slate-400">
                              {
                                review.createdAt
                              }
                            </Text>
                          </View>

                          <Text className="font-bold text-amber-500">
                            ⭐{" "}
                            {
                              review.rating
                            }
                          </Text>
                        </View>

                        <Text className="mt-4 text-sm leading-6 text-slate-600">
                          “
                          {
                            review.comment
                          }
                          ”
                        </Text>

                        <Text className="mt-3 text-xs font-semibold text-blue-600">
                          {
                            review.serviceName
                          }
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}