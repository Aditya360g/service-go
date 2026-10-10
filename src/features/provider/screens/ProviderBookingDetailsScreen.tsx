import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
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

type BookingDetails = {
  id: number;

  customer: {
    id: number;
    name: string;
    phone: string;
    initials: string;
  };

  service: {
    providerServiceId: number;
    name: string;
    price: number;
  };

  schedule: {
    date: string;
    time: string;
    duration: string;
  };

  address: {
    label: string;
    fullAddress: string;
    landmark: string;
  };

  problem: string;
  customerNotes: string;

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  servicePrice: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;

  createdAt: string;
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

const bookings: BookingDetails[] = [
  {
    id: 1001,

    customer: {
      id: 1,
      name: "Aman Sharma",
      phone: "9876543210",
      initials: "AS",
    },

    service: {
      providerServiceId: 501,
      name: "Washing Machine Repair",
      price: 599,
    },

    schedule: {
      date: "20 Sep 2026",
      time: "10:00 AM - 11:00 AM",
      duration: "1 hour",
    },

    address: {
      label: "Home",
      fullAddress:
        "A-204, Vaishali Nagar, Jaipur, Rajasthan - 302021",
      landmark: "Near Main Market",
    },

    problem:
      "Washing machine is not spinning properly and making noise during the wash cycle.",

    customerNotes:
      "Please call before arriving.",

    status: "confirmed",
    paymentStatus: "paid",

    servicePrice: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,

    createdAt: "18 Sep 2026, 11:35 AM",
  },

  {
    id: 1002,

    customer: {
      id: 2,
      name: "Rohit Jain",
      phone: "9876501234",
      initials: "RJ",
    },

    service: {
      providerServiceId: 502,
      name: "Appliance Inspection",
      price: 399,
    },

    schedule: {
      date: "20 Sep 2026",
      time: "2:00 PM - 3:00 PM",
      duration: "1 hour",
    },

    address: {
      label: "Home",
      fullAddress:
        "B-112, Mansarovar, Jaipur, Rajasthan - 302020",
      landmark: "Near Metro Station",
    },

    problem:
      "Need inspection of washing machine before deciding on repair.",

    customerNotes: "No special instructions.",

    status: "pending",
    paymentStatus: "pending",

    servicePrice: 399,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 448,

    createdAt: "18 Sep 2026, 10:20 AM",
  },

  {
    id: 1003,

    customer: {
      id: 3,
      name: "Neha Verma",
      phone: "9812345678",
      initials: "NV",
    },

    service: {
      providerServiceId: 501,
      name: "Washing Machine Repair",
      price: 599,
    },

    schedule: {
      date: "17 Sep 2026",
      time: "2:30 PM - 3:30 PM",
      duration: "1 hour",
    },

    address: {
      label: "Home",
      fullAddress:
        "21, C Scheme, Jaipur, Rajasthan - 302001",
      landmark: "Near Central Park",
    },

    problem:
      "Machine was stopping automatically during rinse cycle.",

    customerNotes: "Completed successfully.",

    status: "completed",
    paymentStatus: "paid",

    servicePrice: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,

    createdAt: "16 Sep 2026, 5:40 PM",
  },
];

function getStatusStyle(
  status: BookingStatus
) {
  switch (status) {
    case "pending":
      return {
        wrapper:
          "border-amber-200 bg-amber-50",
        text: "text-amber-700",
        label: "Pending",
      };

    case "confirmed":
      return {
        wrapper:
          "border-blue-200 bg-blue-50",
        text: "text-blue-700",
        label: "Confirmed",
      };

    case "in_progress":
      return {
        wrapper:
          "border-violet-200 bg-violet-50",
        text: "text-violet-700",
        label: "In Progress",
      };

    case "completed":
      return {
        wrapper:
          "border-green-200 bg-green-50",
        text: "text-green-700",
        label: "Completed",
      };

    case "cancelled":
      return {
        wrapper:
          "border-red-200 bg-red-50",
        text: "text-red-700",
        label: "Cancelled",
      };
  }
}

function getPaymentStyle(
  status: PaymentStatus
) {
  switch (status) {
    case "paid":
      return {
        wrapper: "bg-green-50",
        text: "text-green-700",
        label: "Paid",
      };

    case "pending":
      return {
        wrapper: "bg-amber-50",
        text: "text-amber-700",
        label: "Payment Pending",
      };

    case "refunded":
      return {
        wrapper: "bg-slate-100",
        text: "text-slate-600",
        label: "Refunded",
      };
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row justify-between gap-5 border-b border-slate-100 py-3">
      <Text className="text-sm text-slate-500">
        {label}
      </Text>

      <Text className="flex-1 text-right text-sm font-semibold text-slate-900">
        {value}
      </Text>
    </View>
  );
}

export default function ProviderBookingDetailsScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1000;

  const params =
    useLocalSearchParams<{
      bookingId?: string | string[];
    }>();

  const rawBookingId = Array.isArray(
    params.bookingId
  )
    ? params.bookingId[0]
    : params.bookingId;

  const bookingId = Number(
    rawBookingId
  );

  const bookingData =
    bookings.find(
      (item) =>
        item.id === bookingId
    ) ?? null;

  const [status, setStatus] =
    useState<BookingStatus>(
      bookingData?.status ??
      "pending"
    );

  const [updating, setUpdating] =
    useState(false);

  if (!bookingData) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full items-center rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-5xl">
            📅
          </Text>

          <Text className="mt-5 text-2xl font-bold text-slate-900">
            Booking Not Found
          </Text>

          <Text className="mt-2 text-center text-slate-500">
            This booking does not exist.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/provider/bookings"
              )
            }
            className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
          >
            <Text className="font-bold text-white">
              Back to Bookings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const booking = bookingData;

  const statusStyle =
    getStatusStyle(status);

  const paymentStyle =
    getPaymentStyle(
      booking.paymentStatus
    );

  const updateStatus = async (
    nextStatus: BookingStatus
  ) => {
    setUpdating(true);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 400)
    );

    setStatus(nextStatus);
    setUpdating(false);
  };

  const confirmAction = (
    title: string,
    message: string,
    nextStatus: BookingStatus
  ) => {
    if (Platform.OS === "web") {
      const confirmed =
        window.confirm(message);

      if (confirmed) {
        updateStatus(nextStatus);
      }

      return;
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () =>
            updateStatus(
              nextStatus
            ),
        },
      ]
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
                      key={item.label}
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
              )}
            </View>
          </View>
        )}

        {/* MAIN */}
        <View className="flex-1">
          {/* HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() =>
                  router.replace(
                    "/provider/bookings"
                  )
                }
              >
                <Text className="font-semibold text-blue-600">
                  ← Back to Bookings
                </Text>
              </Pressable>

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
                          key={item.label}
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
                            {item.label}
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
              <View className="mb-6 flex-row flex-wrap items-start justify-between gap-4">
                <View>
                  <Text className="text-sm font-semibold text-slate-400">
                    Booking #{booking.id}
                  </Text>

                  <Text className="mt-1 text-3xl font-black text-slate-900">
                    {booking.service.name}
                  </Text>

                  <Text className="mt-2 text-sm text-slate-500">
                    Created {booking.createdAt}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  <View
                    className={`rounded-full border px-4 py-2 ${statusStyle.wrapper}`}
                  >
                    <Text
                      className={`text-sm font-bold ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </Text>
                  </View>

                  <View
                    className={`rounded-full px-4 py-2 ${paymentStyle.wrapper}`}
                  >
                    <Text
                      className={`text-sm font-bold ${paymentStyle.text}`}
                    >
                      {paymentStyle.label}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-5">
                {/* LEFT */}
                <View
                  style={{
                    minWidth: 290,
                    flexBasis: 680,
                    flexGrow: 2,
                  }}
                >
                  {/* CUSTOMER */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Customer
                    </Text>

                    <View className="mt-5 flex-row items-center">
                      <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                        <Text className="text-lg font-bold text-blue-700">
                          {booking.customer.initials}
                        </Text>
                      </View>

                      <View className="ml-4 flex-1">
                        <Text className="text-lg font-bold text-slate-900">
                          {booking.customer.name}
                        </Text>

                        <Text className="mt-1 text-sm text-slate-500">
                          +91 {booking.customer.phone}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* SCHEDULE */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Schedule
                    </Text>

                    <View className="mt-4 flex-row flex-wrap gap-4">
                      <View
                        className="rounded-xl bg-slate-50 p-4"
                        style={{
                          minWidth: 180,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase text-slate-400">
                          Date
                        </Text>

                        <Text className="mt-2 font-bold text-slate-900">
                          {booking.schedule.date}
                        </Text>
                      </View>

                      <View
                        className="rounded-xl bg-slate-50 p-4"
                        style={{
                          minWidth: 180,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase text-slate-400">
                          Time
                        </Text>

                        <Text className="mt-2 font-bold text-slate-900">
                          {booking.schedule.time}
                        </Text>
                      </View>

                      <View
                        className="rounded-xl bg-slate-50 p-4"
                        style={{
                          minWidth: 150,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase text-slate-400">
                          Duration
                        </Text>

                        <Text className="mt-2 font-bold text-slate-900">
                          {booking.schedule.duration}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ADDRESS */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Service Address
                    </Text>

                    <View className="mt-4 rounded-xl bg-slate-50 p-5">
                      <View className="self-start rounded-full bg-blue-50 px-3 py-1.5">
                        <Text className="text-xs font-bold text-blue-700">
                          {booking.address.label}
                        </Text>
                      </View>

                      <Text className="mt-3 font-semibold leading-6 text-slate-900">
                        {booking.address.fullAddress}
                      </Text>

                      <Text className="mt-2 text-sm text-slate-500">
                        Landmark:{" "}
                        {booking.address.landmark}
                      </Text>
                    </View>
                  </View>

                  {/* PROBLEM */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Service Details
                    </Text>

                    <View className="mt-5">
                      <Text className="text-xs font-semibold uppercase text-slate-400">
                        Customer Problem
                      </Text>

                      <Text className="mt-2 leading-7 text-slate-700">
                        {booking.problem}
                      </Text>
                    </View>

                    <View className="mt-5 border-t border-slate-100 pt-5">
                      <Text className="text-xs font-semibold uppercase text-slate-400">
                        Customer Note
                      </Text>

                      <Text className="mt-2 leading-7 text-slate-700">
                        {booking.customerNotes}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* RIGHT */}
                <View
                  style={{
                    minWidth: 280,
                    flexBasis: 340,
                    flexGrow: 1,
                  }}
                >
                  {/* PRICE */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Payment Summary
                    </Text>

                    <View className="mt-4">
                      <InfoRow
                        label="Service Price"
                        value={`₹${booking.servicePrice}`}
                      />

                      <InfoRow
                        label="Service Charge"
                        value={`₹${booking.serviceCharge}`}
                      />

                      <InfoRow
                        label="Discount"
                        value={`-₹${booking.discount}`}
                      />
                    </View>

                    <View className="mt-4 flex-row items-center justify-between">
                      <Text className="font-bold text-slate-900">
                        Total Amount
                      </Text>

                      <Text className="text-2xl font-black text-slate-900">
                        ₹{booking.totalAmount}
                      </Text>
                    </View>
                  </View>

                  {/* BOOKING INFO */}
                  <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Booking Information
                    </Text>

                    <View className="mt-4">
                      <InfoRow
                        label="Booking ID"
                        value={`#${booking.id}`}
                      />

                      <InfoRow
                        label="Service ID"
                        value={`#${booking.service.providerServiceId}`}
                      />

                      <InfoRow
                        label="Booking Status"
                        value={statusStyle.label}
                      />

                      <InfoRow
                        label="Payment"
                        value={paymentStyle.label}
                      />
                    </View>
                  </View>

                  {/* ACTIONS */}
                  <View className="rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Booking Actions
                    </Text>

                    {status ===
                      "pending" && (
                        <View className="mt-5 gap-3">
                          <Pressable
                            disabled={updating}
                            onPress={() =>
                              updateStatus(
                                "confirmed"
                              )
                            }
                            className="items-center rounded-xl bg-blue-600 px-5 py-4"
                          >
                            <Text className="font-bold text-white">
                              {updating
                                ? "Updating..."
                                : "Accept Booking"}
                            </Text>
                          </Pressable>

                          <Pressable
                            disabled={updating}
                            onPress={() =>
                              confirmAction(
                                "Decline Booking",
                                "Are you sure you want to decline this booking?",
                                "cancelled"
                              )
                            }
                            className="items-center rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                          >
                            <Text className="font-bold text-red-600">
                              Decline Booking
                            </Text>
                          </Pressable>
                        </View>
                      )}

                    {status ===
                      "confirmed" && (
                        <View className="mt-5 gap-3">
                          <Pressable
                            disabled={updating}
                            onPress={() =>
                              confirmAction(
                                "Start Service",
                                "Start this service now?",
                                "in_progress"
                              )
                            }
                            className="items-center rounded-xl bg-blue-600 px-5 py-4"
                          >
                            <Text className="font-bold text-white">
                              {updating
                                ? "Updating..."
                                : "Start Service"}
                            </Text>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              router.replace(
                                "/provider/bookings"
                              )
                            }
                            className="items-center rounded-xl border border-slate-200 px-5 py-4"
                          >
                            <Text className="font-bold text-slate-700">
                              Back to Bookings
                            </Text>
                          </Pressable>
                        </View>
                      )}

                    {status ===
                      "in_progress" && (
                        <View className="mt-5">
                          <Pressable
                            disabled={updating}
                            onPress={() =>
                              confirmAction(
                                "Complete Service",
                                "Mark this service as completed?",
                                "completed"
                              )
                            }
                            className="items-center rounded-xl bg-green-600 px-5 py-4"
                          >
                            <Text className="font-bold text-white">
                              {updating
                                ? "Updating..."
                                : "Mark as Completed"}
                            </Text>
                          </Pressable>
                        </View>
                      )}

                    {status ===
                      "completed" && (
                        <View className="mt-5 rounded-xl bg-green-50 p-4">
                          <Text className="font-bold text-green-700">
                            ✓ Service Completed
                          </Text>

                          <Text className="mt-1 text-sm text-green-600">
                            No further action is required.
                          </Text>
                        </View>
                      )}

                    {status ===
                      "cancelled" && (
                        <View className="mt-5 rounded-xl bg-red-50 p-4">
                          <Text className="font-bold text-red-700">
                            Booking Cancelled
                          </Text>

                          <Text className="mt-1 text-sm text-red-600">
                            This booking is no longer active.
                          </Text>
                        </View>
                      )}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}