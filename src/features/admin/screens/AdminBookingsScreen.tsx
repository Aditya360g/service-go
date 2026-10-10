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
  | "in_progress"
  | "completed"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "refunded";

type BookingFilter =
  | "all"
  | BookingStatus;

type Booking = {
  id: number;
  customerName: string;
  customerPhone: string;
  providerName: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
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

const initialBookings: Booking[] = [
  {
    id: 1001,
    customerName: "Aman Sharma",
    customerPhone: "9876543210",
    providerName: "Rahul Provider",
    serviceName: "Washing Machine Repair",
    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    location: "Vaishali Nagar",
    amount: 648,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 1002,
    customerName: "Rohit Jain",
    customerPhone: "9876501234",
    providerName: "Rahul Provider",
    serviceName: "Appliance Inspection",
    date: "20 Sep 2026",
    time: "2:00 PM - 3:00 PM",
    location: "Mansarovar",
    amount: 448,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: 1003,
    customerName: "Neha Verma",
    customerPhone: "9812345678",
    providerName: "Amit Sharma",
    serviceName: "Home Cleaning",
    date: "17 Sep 2026",
    time: "2:30 PM - 3:30 PM",
    location: "C Scheme",
    amount: 548,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: 1004,
    customerName: "Karan Singh",
    customerPhone: "9823456789",
    providerName: "Vikas Kumar",
    serviceName: "Plumber",
    date: "18 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    location: "Jagatpura",
    amount: 348,
    status: "in_progress",
    paymentStatus: "paid",
  },
  {
    id: 1005,
    customerName: "Pooja Mehta",
    customerPhone: "9834567890",
    providerName: "Sandeep Singh",
    serviceName: "AC Repair",
    date: "16 Sep 2026",
    time: "4:00 PM - 5:00 PM",
    location: "Malviya Nagar",
    amount: 448,
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: 1006,
    customerName: "Deepak Sharma",
    customerPhone: "9845678901",
    providerName: "Rohit Verma",
    serviceName: "Electrician",
    date: "21 Sep 2026",
    time: "12:00 PM - 1:00 PM",
    location: "Tonk Road",
    amount: 298,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: 1007,
    customerName: "Anjali Jain",
    customerPhone: "9856789012",
    providerName: "Manoj Sharma",
    serviceName: "Painting",
    date: "22 Sep 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Shyam Nagar",
    amount: 1048,
    status: "confirmed",
    paymentStatus: "paid",
  },
];

const filters: {
  label: string;
  value: BookingFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Confirmed",
      value: "confirmed",
    },
    {
      label: "In Progress",
      value: "in_progress",
    },
    {
      label: "Completed",
      value: "completed",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
  ];

function getStatusStyle(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        wrapper: "border-amber-200 bg-amber-50",
        text: "text-amber-700",
      };

    case "confirmed":
      return {
        label: "Confirmed",
        wrapper: "border-blue-200 bg-blue-50",
        text: "text-blue-700",
      };

    case "in_progress":
      return {
        label: "In Progress",
        wrapper: "border-violet-200 bg-violet-50",
        text: "text-violet-700",
      };

    case "completed":
      return {
        label: "Completed",
        wrapper: "border-green-200 bg-green-50",
        text: "text-green-700",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        wrapper: "border-red-200 bg-red-50",
        text: "text-red-700",
      };
  }
}

function getPaymentStyle(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        wrapper: "bg-green-50",
        text: "text-green-700",
      };

    case "pending":
      return {
        label: "Pending",
        wrapper: "bg-amber-50",
        text: "text-amber-700",
      };

    case "refunded":
      return {
        label: "Refunded",
        wrapper: "bg-slate-100",
        text: "text-slate-600",
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
        flexBasis: 210,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Text className="text-xl">{icon}</Text>
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

export default function AdminBookingsScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1000;

  const [bookings, setBookings] =
    useState<Booking[]>(initialBookings);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<BookingFilter>("all");

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (filter !== "all") {
      result = result.filter(
        (booking) => booking.status === filter
      );
    }

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter((booking) =>
        [
          booking.id,
          booking.customerName,
          booking.customerPhone,
          booking.providerName,
          booking.serviceName,
          booking.location,
          booking.status,
          booking.paymentStatus,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    return result;
  }, [bookings, search, filter]);

  const updateStatus = (
    bookingId: number,
    status: BookingStatus
  ) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? {
            ...booking,
            status,
          }
          : booking
      )
    );
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const activeCount = bookings.filter(
    (booking) =>
      booking.status === "confirmed" ||
      booking.status === "in_progress"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className={
          isDesktop
            ? "flex-1 flex-row"
            : "flex-1"
        }
      >
        {isDesktop && (
          <View
            className="border-r border-slate-200 bg-white px-5 py-6"
            style={{
              width: 250,
            }}
          >
            <Pressable
              onPress={() =>
                router.replace("/admin")
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
              {sidebarItems.map((item) => {
                const active =
                  item.route ===
                  "/admin/bookings";

                return (
                  <Pressable
                    key={item.label}
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
                      <Text className="text-xl">
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
              })}
            </View>
          </View>
        )}

        <View className="flex-1">
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {isDesktop ? (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Bookings
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage all platform bookings
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
                showsHorizontalScrollIndicator={false}
                className="mt-4"
              >
                <View className="flex-row gap-2">
                  {sidebarItems.map((item) => {
                    const active =
                      item.route ===
                      "/admin/bookings";

                    return (
                      <Pressable
                        key={item.label}
                        onPress={() =>
                          router.push(item.route)
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
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 60,
            }}
          >
            <View className="p-5 md:p-8">
              <View className="mb-6">
                <Text className="text-3xl font-black text-slate-900">
                  All Bookings
                </Text>

                <Text className="mt-2 text-slate-500">
                  Monitor and manage customer
                  bookings across ServiGo.
                </Text>
              </View>

              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="📅"
                  label="Total"
                  value={bookings.length}
                />

                <StatCard
                  icon="⏳"
                  label="Pending"
                  value={pendingCount}
                />

                <StatCard
                  icon="🛠️"
                  label="Active"
                  value={activeCount}
                />

                <StatCard
                  icon="✅"
                  label="Completed"
                  value={completedCount}
                />

                <StatCard
                  icon="❌"
                  label="Cancelled"
                  value={cancelledCount}
                />
              </View>

              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search booking, customer, provider, service or location"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-5"
              >
                <View className="flex-row gap-2">
                  {filters.map((item) => {
                    const selected =
                      filter === item.value;

                    return (
                      <Pressable
                        key={item.value}
                        onPress={() =>
                          setFilter(item.value)
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
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>

              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="border-b border-slate-100 px-5 py-5">
                  <Text className="text-lg font-bold text-slate-900">
                    Booking List
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {filteredBookings.length} bookings found
                  </Text>
                </View>

                {filteredBookings.length > 0 ? (
                  filteredBookings.map(
                    (booking, index) => {
                      const status =
                        getStatusStyle(
                          booking.status
                        );

                      const payment =
                        getPaymentStyle(
                          booking.paymentStatus
                        );

                      return (
                        <View
                          key={booking.id}
                          className={
                            index !==
                              filteredBookings.length - 1
                              ? "border-b border-slate-100 px-5 py-5"
                              : "px-5 py-5"
                          }
                        >
                          <View className="flex-row flex-wrap items-center gap-4">
                            <View
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                #{booking.id}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Booking
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 160,
                                flexBasis: 190,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-bold text-slate-900">
                                {booking.customerName}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                +91 {booking.customerPhone}
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 170,
                                flexBasis: 210,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {booking.serviceName}
                              </Text>

                              <Text className="mt-1 text-xs text-blue-600">
                                {booking.providerName}
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 150,
                                flexBasis: 170,
                              }}
                            >
                              <Text className="text-sm font-semibold text-slate-700">
                                {booking.date}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                {booking.time}
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 130,
                              }}
                            >
                              <Text className="text-sm font-semibold text-slate-700">
                                📍 {booking.location}
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 85,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                ₹{booking.amount}
                              </Text>

                              <View
                                className={`mt-1 self-start rounded-full px-2 py-1 ${payment.wrapper}`}
                              >
                                <Text
                                  className={`text-[10px] font-bold ${payment.text}`}
                                >
                                  {payment.label}
                                </Text>
                              </View>
                            </View>

                            <View
                              className={`rounded-full border px-3 py-1.5 ${status.wrapper}`}
                            >
                              <Text
                                className={`text-xs font-bold ${status.text}`}
                              >
                                {status.label}
                              </Text>
                            </View>

                            <View
                              style={{
                                minWidth: 150,
                              }}
                            >
                              {booking.status ===
                                "pending" && (
                                  <View className="flex-row gap-2">
                                    <Pressable
                                      onPress={() =>
                                        updateStatus(
                                          booking.id,
                                          "confirmed"
                                        )
                                      }
                                      className="rounded-lg bg-green-50 px-3 py-2"
                                    >
                                      <Text className="text-xs font-bold text-green-700">
                                        Confirm
                                      </Text>
                                    </Pressable>

                                    <Pressable
                                      onPress={() =>
                                        updateStatus(
                                          booking.id,
                                          "cancelled"
                                        )
                                      }
                                      className="rounded-lg bg-red-50 px-3 py-2"
                                    >
                                      <Text className="text-xs font-bold text-red-600">
                                        Cancel
                                      </Text>
                                    </Pressable>
                                  </View>
                                )}

                              {booking.status ===
                                "confirmed" && (
                                  <Pressable
                                    onPress={() =>
                                      updateStatus(
                                        booking.id,
                                        "in_progress"
                                      )
                                    }
                                    className="rounded-lg bg-violet-50 px-3 py-2"
                                  >
                                    <Text className="text-center text-xs font-bold text-violet-700">
                                      Start Service
                                    </Text>
                                  </Pressable>
                                )}

                              {booking.status ===
                                "in_progress" && (
                                  <Pressable
                                    onPress={() =>
                                      updateStatus(
                                        booking.id,
                                        "completed"
                                      )
                                    }
                                    className="rounded-lg bg-green-50 px-3 py-2"
                                  >
                                    <Text className="text-center text-xs font-bold text-green-700">
                                      Complete
                                    </Text>
                                  </Pressable>
                                )}

                              {booking.status ===
                                "completed" && (
                                  <Text className="text-center text-xs font-bold text-green-600">
                                    Completed
                                  </Text>
                                )}

                              {booking.status ===
                                "cancelled" && (
                                  <Text className="text-center text-xs font-bold text-red-500">
                                    Cancelled
                                  </Text>
                                )}
                            </View>
                          </View>
                        </View>
                      );
                    }
                  )
                ) : (
                  <View className="items-center px-5 py-16">
                    <Text className="text-5xl">
                      📅
                    </Text>

                    <Text className="mt-4 text-xl font-bold text-slate-900">
                      No bookings found
                    </Text>

                    <Text className="mt-2 text-sm text-slate-500">
                      Change search or filter.
                    </Text>

                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setFilter("all");
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