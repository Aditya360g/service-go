import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
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
  serviceName: string;
  providerName: string;
  providerInitials: string;
  providerId: number;
  providerServiceId: number;
  date: string;
  time: string;
  address: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

type FilterType =
  | "all"
  | "upcoming"
  | "completed"
  | "cancelled";

const bookings: Booking[] = [
  {
    id: 1001,
    serviceName: "Washing Machine Repair",
    providerName: "Rahul Provider",
    providerInitials: "RP",
    providerId: 5,
    providerServiceId: 501,
    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    address: "Vaishali Nagar, Jaipur, Rajasthan",
    amount: 599,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "18 Sep 2026",
  },
  {
    id: 1002,
    serviceName: "Home Cleaning",
    providerName: "Amit Sharma",
    providerInitials: "AS",
    providerId: 1,
    providerServiceId: 101,
    date: "22 Sep 2026",
    time: "02:00 PM - 04:00 PM",
    address: "Mansarovar, Jaipur, Rajasthan",
    amount: 499,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "18 Sep 2026",
  },
  {
    id: 1003,
    serviceName: "Electrician",
    providerName: "Rohit Verma",
    providerInitials: "RV",
    providerId: 2,
    providerServiceId: 201,
    date: "15 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    address: "Malviya Nagar, Jaipur, Rajasthan",
    amount: 249,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "14 Sep 2026",
  },
  {
    id: 1004,
    serviceName: "Plumber",
    providerName: "Vikas Kumar",
    providerInitials: "VK",
    providerId: 3,
    providerServiceId: 301,
    date: "12 Sep 2026",
    time: "04:00 PM - 05:00 PM",
    address: "C Scheme, Jaipur, Rajasthan",
    amount: 299,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "11 Sep 2026",
  },
  {
    id: 1005,
    serviceName: "AC Repair",
    providerName: "Sandeep Singh",
    providerInitials: "SS",
    providerId: 4,
    providerServiceId: 401,
    date: "17 Sep 2026",
    time: "01:00 PM - 02:00 PM",
    address: "Jagatpura, Jaipur, Rajasthan",
    amount: 399,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "16 Sep 2026",
  },
];

const filters: {
  label: string;
  value: FilterType;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Upcoming",
      value: "upcoming",
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

function formatBookingStatus(status: BookingStatus) {
  switch (status) {
    case "pending":
      return "Pending";

    case "confirmed":
      return "Confirmed";

    case "in_progress":
      return "In Progress";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function getBookingStatusClasses(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        container: "bg-amber-50",
        text: "text-amber-700",
      };

    case "confirmed":
      return {
        container: "bg-blue-50",
        text: "text-blue-700",
      };

    case "in_progress":
      return {
        container: "bg-violet-50",
        text: "text-violet-700",
      };

    case "completed":
      return {
        container: "bg-green-50",
        text: "text-green-700",
      };

    case "cancelled":
      return {
        container: "bg-red-50",
        text: "text-red-700",
      };
  }
}

function formatPaymentStatus(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return "Payment Pending";

    case "paid":
      return "Paid";

    case "refunded":
      return "Refunded";
  }
}

function getPaymentStatusClasses(status: PaymentStatus) {
  switch (status) {
    case "pending":
      return {
        container: "bg-amber-50",
        text: "text-amber-700",
      };

    case "paid":
      return {
        container: "bg-green-50",
        text: "text-green-700",
      };

    case "refunded":
      return {
        container: "bg-slate-100",
        text: "text-slate-600",
      };
  }
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
        flexBasis: 220,
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

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [search, setSearch] = useState("");

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeFilter === "upcoming") {
      result = result.filter(
        (booking) =>
          booking.status === "pending" ||
          booking.status === "confirmed" ||
          booking.status === "in_progress"
      );
    }

    if (activeFilter === "completed") {
      result = result.filter(
        (booking) =>
          booking.status === "completed"
      );
    }

    if (activeFilter === "cancelled") {
      result = result.filter(
        (booking) =>
          booking.status === "cancelled"
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((booking) => {
        return (
          booking.serviceName
            .toLowerCase()
            .includes(query) ||
          booking.providerName
            .toLowerCase()
            .includes(query) ||
          booking.address
            .toLowerCase()
            .includes(query) ||
          String(booking.id).includes(query)
        );
      });
    }

    return result;
  }, [activeFilter, search]);

  const upcomingCount = bookings.filter(
    (booking) =>
      booking.status === "pending" ||
      booking.status === "confirmed" ||
      booking.status === "in_progress"
  ).length;

  const completedCount = bookings.filter(
    (booking) =>
      booking.status === "completed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) =>
      booking.status === "cancelled"
  ).length;

  const openBookingDetails = (
    bookingId: number
  ) => {
    router.push({
      pathname: "/bookings/[bookingId]",
      params: {
        bookingId: String(bookingId),
      },
    });
  };

  const openProvider = (
    providerId: number
  ) => {
    router.push({
      pathname: "/providers/[providerId]",
      params: {
        providerId: String(providerId),
      },
    });
  };

  const openPayment = (
    bookingId: number
  ) => {
    router.push({
      pathname: "/payment/[bookingId]",
      params: {
        bookingId: String(bookingId),
      },
    });
  };

  const openReview = (
    bookingId: number
  ) => {
    router.push({
      pathname: "/review/[bookingId]",
      params: {
        bookingId: String(bookingId),
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {/* Top Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1200,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl px-2 py-2"
          >
            <Text className="font-semibold text-blue-600">
              ← Back
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/")}
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
          maxWidth: 1200,
        }}
      >
        {/* Page Heading */}
        <View className="mb-7">
          <Text className="text-3xl font-bold text-slate-900">
            My Bookings
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Track your upcoming services,
            completed bookings, payments and
            cancelled appointments.
          </Text>
        </View>

        {/* Stats */}
        <View className="mb-7 flex-row flex-wrap gap-4">
          <StatCard
            value={String(bookings.length)}
            label="Total bookings"
          />

          <StatCard
            value={String(upcomingCount)}
            label="Upcoming"
          />

          <StatCard
            value={String(completedCount)}
            label="Completed"
          />

          <StatCard
            value={String(cancelledCount)}
            label="Cancelled"
          />
        </View>

        {/* Search */}
        <View className="mb-5 rounded-2xl border border-slate-200 bg-white px-4">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search service, provider or booking ID..."
            placeholderTextColor="#94a3b8"
            className="py-4 text-base text-slate-900 outline-none"
          />
        </View>

        {/* Filters */}
        <View className="mb-7 flex-row flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive =
              activeFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                onPress={() =>
                  setActiveFilter(
                    filter.value
                  )
                }
                className={
                  isActive
                    ? "rounded-full bg-blue-600 px-5 py-2.5"
                    : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
                }
              >
                <Text
                  className={
                    isActive
                      ? "font-semibold text-white"
                      : "font-semibold text-slate-600"
                  }
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Result heading */}
        <View className="mb-5 flex-row flex-wrap items-end justify-between gap-3">
          <View>
            <Text className="text-xl font-bold text-slate-900">
              {activeFilter === "all"
                ? "All Bookings"
                : activeFilter === "upcoming"
                  ? "Upcoming Bookings"
                  : activeFilter ===
                    "completed"
                    ? "Completed Bookings"
                    : "Cancelled Bookings"}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              {filteredBookings.length}{" "}
              {filteredBookings.length === 1
                ? "booking"
                : "bookings"}{" "}
              found
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push("/services")
            }
          >
            <Text className="font-semibold text-blue-600">
              + Book a Service
            </Text>
          </Pressable>
        </View>

        {/* Booking List */}
        {filteredBookings.length > 0 ? (
          <View className="gap-4">
            {filteredBookings.map(
              (booking) => {
                const bookingStatus =
                  getBookingStatusClasses(
                    booking.status
                  );

                const paymentStatus =
                  getPaymentStatusClasses(
                    booking.paymentStatus
                  );

                return (
                  <View
                    key={booking.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6"
                  >
                    {/* Card Header */}
                    <View className="flex-row flex-wrap items-start justify-between gap-4">
                      <View className="flex-row items-center gap-4">
                        <Pressable
                          onPress={() =>
                            openProvider(
                              booking.providerId
                            )
                          }
                          className="h-14 w-14 items-center justify-center rounded-full bg-blue-100"
                        >
                          <Text className="text-lg font-bold text-blue-700">
                            {
                              booking.providerInitials
                            }
                          </Text>
                        </Pressable>

                        <View>
                          <Text className="text-lg font-bold text-slate-900">
                            {
                              booking.serviceName
                            }
                          </Text>

                          <Pressable
                            onPress={() =>
                              openProvider(
                                booking.providerId
                              )
                            }
                          >
                            <Text className="mt-1 font-semibold text-blue-600">
                              {
                                booking.providerName
                              }
                            </Text>
                          </Pressable>
                        </View>
                      </View>

                      <View className="items-end gap-2">
                        <View
                          className={`rounded-full px-3 py-1.5 ${bookingStatus.container}`}
                        >
                          <Text
                            className={`text-xs font-bold ${bookingStatus.text}`}
                          >
                            {formatBookingStatus(
                              booking.status
                            )}
                          </Text>
                        </View>

                        <View
                          className={`rounded-full px-3 py-1.5 ${paymentStatus.container}`}
                        >
                          <Text
                            className={`text-xs font-semibold ${paymentStatus.text}`}
                          >
                            {formatPaymentStatus(
                              booking.paymentStatus
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Divider */}
                    <View className="my-5 h-px bg-slate-100" />

                    {/* Booking Information */}
                    <View className="flex-row flex-wrap gap-5">
                      <View
                        style={{
                          minWidth: 180,
                          flexBasis: 220,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Date
                        </Text>

                        <Text className="mt-1 font-semibold text-slate-800">
                          📅 {booking.date}
                        </Text>
                      </View>

                      <View
                        style={{
                          minWidth: 180,
                          flexBasis: 220,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Time
                        </Text>

                        <Text className="mt-1 font-semibold text-slate-800">
                          🕐 {booking.time}
                        </Text>
                      </View>

                      <View
                        style={{
                          minWidth: 180,
                          flexBasis: 220,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Amount
                        </Text>

                        <Text className="mt-1 font-semibold text-slate-800">
                          ₹{booking.amount}
                        </Text>
                      </View>

                      <View
                        style={{
                          minWidth: 180,
                          flexBasis: 220,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Booking ID
                        </Text>

                        <Text className="mt-1 font-semibold text-slate-800">
                          #{booking.id}
                        </Text>
                      </View>
                    </View>

                    {/* Address */}
                    <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Service Address
                      </Text>

                      <Text className="mt-2 leading-6 text-slate-700">
                        📍 {booking.address}
                      </Text>
                    </View>

                    {/* Actions */}
                    <View className="mt-5 flex-row flex-wrap items-center gap-3">
                      <Pressable
                        onPress={() =>
                          openBookingDetails(
                            booking.id
                          )
                        }
                        className="rounded-xl bg-blue-600 px-5 py-3"
                      >
                        <Text className="font-bold text-white">
                          View Details
                        </Text>
                      </Pressable>

                      {booking.paymentStatus ===
                        "pending" &&
                        booking.status !==
                        "cancelled" && (
                          <Pressable
                            onPress={() =>
                              openPayment(
                                booking.id
                              )
                            }
                            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
                          >
                            <Text className="font-bold text-blue-700">
                              Pay Now
                            </Text>
                          </Pressable>
                        )}

                      {booking.status ===
                        "completed" && (
                          <Pressable
                            onPress={() =>
                              openReview(
                                booking.id
                              )
                            }
                            className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3"
                          >
                            <Text className="font-bold text-amber-700">
                              ★ Write Review
                            </Text>
                          </Pressable>
                        )}

                      {(booking.status ===
                        "pending" ||
                        booking.status ===
                        "confirmed") && (
                          <Pressable
                            onPress={() =>
                              openBookingDetails(
                                booking.id
                              )
                            }
                            className="rounded-xl border border-red-200 bg-red-50 px-5 py-3"
                          >
                            <Text className="font-bold text-red-600">
                              Manage Booking
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  </View>
                );
              }
            )}
          </View>
        ) : (
          /* Empty State */
          <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-16">
            <Text className="text-5xl">
              📅
            </Text>

            <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
              No bookings found
            </Text>

            <Text className="mt-2 max-w-lg text-center leading-6 text-slate-500">
              {search
                ? "No booking matches your search. Try another service, provider or booking ID."
                : "You don't have any bookings in this section yet."}
            </Text>

            {search ? (
              <Pressable
                onPress={() =>
                  setSearch("")
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5"
              >
                <Text className="font-bold text-white">
                  Clear Search
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() =>
                  router.push(
                    "/services"
                  )
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5"
              >
                <Text className="font-bold text-white">
                  Book a Service
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}