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

type Booking = {
  id: number;
  customerName: string;
  initials: string;
  serviceName: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

type BookingFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

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

const initialBookings: Booking[] = [
  {
    id: 1001,
    customerName: "Aman Sharma",
    initials: "AS",
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
    initials: "RJ",
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
    initials: "NV",
    serviceName: "Washing Machine Repair",
    date: "17 Sep 2026",
    time: "2:30 PM - 3:30 PM",
    location: "C Scheme",
    amount: 648,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: 1004,
    customerName: "Karan Singh",
    initials: "KS",
    serviceName: "Appliance Inspection",
    date: "18 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    location: "Jagatpura",
    amount: 448,
    status: "in_progress",
    paymentStatus: "paid",
  },
  {
    id: 1005,
    customerName: "Pooja Mehta",
    initials: "PM",
    serviceName: "Washing Machine Repair",
    date: "16 Sep 2026",
    time: "4:00 PM - 5:00 PM",
    location: "Malviya Nagar",
    amount: 648,
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: 1006,
    customerName: "Deepak Sharma",
    initials: "DS",
    serviceName: "Installation Service",
    date: "21 Sep 2026",
    time: "12:00 PM - 1:00 PM",
    location: "Tonk Road",
    amount: 548,
    status: "pending",
    paymentStatus: "pending",
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

function getStatusStyle(
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

    case "in_progress":
      return {
        label: "In Progress",
        wrapper:
          "border-violet-200 bg-violet-50",
        text: "text-violet-700",
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

function getPaymentStyle(
  status: PaymentStatus
) {
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
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 160,
        flexBasis: 200,
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

export default function ProviderBookingsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [
    bookings,
    setBookings,
  ] =
    useState<Booking[]>(
      initialBookings
    );

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<BookingFilter>(
      "all"
    );

  const filteredBookings =
    useMemo(() => {
      let result = [
        ...bookings,
      ];

      if (
        activeFilter !==
        "all"
      ) {
        result =
          result.filter(
            (booking) =>
              booking.status ===
              activeFilter
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (booking) =>
              [
                booking.id,
                booking.customerName,
                booking.serviceName,
                booking.location,
                booking.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      bookings,
      search,
      activeFilter,
    ]);

  const updateBookingStatus = (
    bookingId: number,
    status: BookingStatus
  ) => {
    setBookings(
      (current) =>
        current.map(
          (booking) =>
            booking.id ===
              bookingId
              ? {
                ...booking,
                status,
              }
              : booking
        )
    );
  };

  const openBooking = (
    bookingId: number
  ) => {
    router.push({
      pathname:
        "/provider/bookings/[bookingId]",
      params: {
        bookingId:
          String(bookingId),
      },
    });
  };

  const pendingCount =
    bookings.filter(
      (booking) =>
        booking.status ===
        "pending"
    ).length;

  const confirmedCount =
    bookings.filter(
      (booking) =>
        booking.status ===
        "confirmed"
    ).length;

  const progressCount =
    bookings.filter(
      (booking) =>
        booking.status ===
        "in_progress"
    ).length;

  const completedCount =
    bookings.filter(
      (booking) =>
        booking.status ===
        "completed"
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
                    "/provider/bookings";

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
          {/* TOPBAR */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between gap-4">
              <View>
                {isDesktop ? (
                  <>
                    <Text className="text-lg font-bold text-slate-900">
                      Bookings
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Manage customer
                      service requests
                    </Text>
                  </>
                ) : (
                  <Text className="text-xl font-black text-blue-600">
                    ServiGo
                  </Text>
                )}
              </View>

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

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Rahul Provider
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Appliance Technician
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
                        "/provider/bookings";

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
                  My Bookings
                </Text>

                <Text className="mt-2 text-slate-500">
                  View and manage all
                  customer bookings.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="⏳"
                  value={
                    pendingCount
                  }
                  label="Pending"
                />

                <StatCard
                  icon="✓"
                  value={
                    confirmedCount
                  }
                  label="Confirmed"
                />

                <StatCard
                  icon="🛠️"
                  value={
                    progressCount
                  }
                  label="In Progress"
                />

                <StatCard
                  icon="✅"
                  value={
                    completedCount
                  }
                  label="Completed"
                />
              </View>

              {/* SEARCH */}
              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg text-slate-400">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={
                      setSearch
                    }
                    placeholder="Search booking, customer, service or location"
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
                    (filter) => {
                      const selected =
                        activeFilter ===
                        filter.value;

                      return (
                        <Pressable
                          key={
                            filter.value
                          }
                          onPress={() =>
                            setActiveFilter(
                              filter.value
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
                              filter.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>

              {/* BOOKINGS */}
              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Booking List
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      {
                        filteredBookings.length
                      }{" "}
                      bookings found
                    </Text>
                  </View>
                </View>

                {filteredBookings.length >
                  0 ? (
                  filteredBookings.map(
                    (
                      booking,
                      index
                    ) => {
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
                          key={
                            booking.id
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
                            {/* CUSTOMER */}
                            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                              <Text className="font-bold text-blue-700">
                                {
                                  booking.initials
                                }
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
                                  booking.customerName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Booking #
                                {
                                  booking.id
                                }
                              </Text>
                            </View>

                            {/* SERVICE */}
                            <View
                              style={{
                                minWidth: 180,
                                flexBasis: 240,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {
                                  booking.serviceName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                📍{" "}
                                {
                                  booking.location
                                }
                              </Text>
                            </View>

                            {/* DATE */}
                            <View
                              style={{
                                minWidth: 150,
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

                            {/* AMOUNT */}
                            <View
                              style={{
                                minWidth: 80,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                ₹
                                {
                                  booking.amount
                                }
                              </Text>

                              <View
                                className={`mt-1 self-start rounded-full px-2 py-1 ${payment.wrapper}`}
                              >
                                <Text
                                  className={`text-[10px] font-bold ${payment.text}`}
                                >
                                  {
                                    payment.label
                                  }
                                </Text>
                              </View>
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
                              style={{
                                minWidth: 130,
                              }}
                            >
                              {booking.status ===
                                "pending" && (
                                  <View className="mb-2 flex-row gap-2">
                                    <Pressable
                                      onPress={() =>
                                        updateBookingStatus(
                                          booking.id,
                                          "confirmed"
                                        )
                                      }
                                      className="rounded-lg bg-green-50 px-3 py-2"
                                    >
                                      <Text className="text-xs font-bold text-green-700">
                                        Accept
                                      </Text>
                                    </Pressable>

                                    <Pressable
                                      onPress={() =>
                                        updateBookingStatus(
                                          booking.id,
                                          "cancelled"
                                        )
                                      }
                                      className="rounded-lg bg-red-50 px-3 py-2"
                                    >
                                      <Text className="text-xs font-bold text-red-600">
                                        Decline
                                      </Text>
                                    </Pressable>
                                  </View>
                                )}

                              <Pressable
                                onPress={() =>
                                  openBooking(
                                    booking.id
                                  )
                                }
                                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5"
                              >
                                <Text className="text-center text-xs font-bold text-blue-700">
                                  View Details
                                </Text>
                              </Pressable>
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

                    <Text className="mt-2 text-center text-sm text-slate-500">
                      Try changing your
                      search or filter.
                    </Text>

                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setActiveFilter(
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