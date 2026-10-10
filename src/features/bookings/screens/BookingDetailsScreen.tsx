import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
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

type TimelineStatus =
  | "completed"
  | "current"
  | "pending"
  | "cancelled";

type TimelineItem = {
  title: string;
  description: string;
  time?: string;
  status: TimelineStatus;
};

type Booking = {
  id: number;

  serviceName: string;
  serviceDescription: string;

  providerId: number;
  providerName: string;
  providerInitials: string;
  providerServiceId: number;
  providerRating: number;
  providerExperience: string;
  providerPhone: string;

  date: string;
  time: string;

  addressLabel: string;
  address: string;

  amount: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;

  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;

  problem?: string;
  notes?: string;

  createdAt: string;
  confirmedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;

  cancellationReason?: string;
};

const bookings: Booking[] = [
  {
    id: 1001,

    serviceName: "Washing Machine Repair",
    serviceDescription:
      "Washing machine inspection, diagnosis and repair service.",

    providerId: 5,
    providerName: "Rahul Provider",
    providerInitials: "RP",
    providerServiceId: 501,
    providerRating: 5,
    providerExperience: "4 years",
    providerPhone: "+91 98765 43210",

    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",

    addressLabel: "Home",
    address:
      "Vaishali Nagar, Jaipur, Rajasthan",

    amount: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,

    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",

    problem:
      "Washing machine is not spinning properly and making noise.",

    notes:
      "Please call before arriving.",

    createdAt: "18 Sep 2026, 10:15 AM",
    confirmedAt: "18 Sep 2026, 10:20 AM",
  },

  {
    id: 1002,

    serviceName: "Home Cleaning",
    serviceDescription:
      "Complete home cleaning including floors, dusting, kitchen and bathroom cleaning.",

    providerId: 1,
    providerName: "Amit Sharma",
    providerInitials: "AS",
    providerServiceId: 101,
    providerRating: 4.8,
    providerExperience: "6 years",
    providerPhone: "+91 98765 11111",

    date: "22 Sep 2026",
    time: "02:00 PM - 04:00 PM",

    addressLabel: "Home",
    address:
      "Mansarovar, Jaipur, Rajasthan",

    amount: 499,
    serviceCharge: 49,
    discount: 50,
    totalAmount: 498,

    status: "pending",
    paymentStatus: "pending",

    problem:
      "Need complete cleaning for 2BHK home.",

    notes:
      "Please bring cleaning equipment.",

    createdAt: "18 Sep 2026, 11:30 AM",
  },

  {
    id: 1003,

    serviceName: "Electrician",
    serviceDescription:
      "Electrical repair and household electrical service.",

    providerId: 2,
    providerName: "Rohit Verma",
    providerInitials: "RV",
    providerServiceId: 201,
    providerRating: 4.7,
    providerExperience: "5 years",
    providerPhone: "+91 98765 22222",

    date: "15 Sep 2026",
    time: "11:00 AM - 12:00 PM",

    addressLabel: "Home",
    address:
      "Malviya Nagar, Jaipur, Rajasthan",

    amount: 249,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 298,

    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",

    problem:
      "Bedroom fan and one switch board are not working.",

    notes: "",

    createdAt: "14 Sep 2026, 09:10 AM",
    confirmedAt: "14 Sep 2026, 09:15 AM",
    startedAt: "15 Sep 2026, 11:05 AM",
    completedAt: "15 Sep 2026, 11:48 AM",
  },

  {
    id: 1004,

    serviceName: "Plumber",
    serviceDescription:
      "Household plumbing repair and leakage service.",

    providerId: 3,
    providerName: "Vikas Kumar",
    providerInitials: "VK",
    providerServiceId: 301,
    providerRating: 4.9,
    providerExperience: "8 years",
    providerPhone: "+91 98765 33333",

    date: "12 Sep 2026",
    time: "04:00 PM - 05:00 PM",

    addressLabel: "Home",
    address:
      "C Scheme, Jaipur, Rajasthan",

    amount: 299,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 348,

    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Online Payment",

    problem:
      "Kitchen sink pipe is leaking.",

    notes: "",

    createdAt: "11 Sep 2026, 05:20 PM",
    confirmedAt: "11 Sep 2026, 05:25 PM",
    cancelledAt: "12 Sep 2026, 09:00 AM",

    cancellationReason:
      "Customer requested cancellation.",
  },

  {
    id: 1005,

    serviceName: "AC Repair",
    serviceDescription:
      "AC inspection, servicing and common cooling issue diagnosis.",

    providerId: 4,
    providerName: "Sandeep Singh",
    providerInitials: "SS",
    providerServiceId: 401,
    providerRating: 4.6,
    providerExperience: "4 years",
    providerPhone: "+91 98765 44444",

    date: "17 Sep 2026",
    time: "01:00 PM - 02:00 PM",

    addressLabel: "Home",
    address:
      "Jagatpura, Jaipur, Rajasthan",

    amount: 399,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 448,

    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",

    problem:
      "AC cooling is low.",

    notes:
      "Outdoor unit is installed on balcony.",

    createdAt: "16 Sep 2026, 01:30 PM",
    confirmedAt: "16 Sep 2026, 01:36 PM",
    startedAt: "17 Sep 2026, 01:05 PM",
    completedAt: "17 Sep 2026, 01:55 PM",
  },
];

function formatBookingStatus(
  status: BookingStatus
) {
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
  }
}

function getBookingStatusClasses(
  status: BookingStatus
) {
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

function formatPaymentStatus(
  status: PaymentStatus
) {
  switch (status) {
    case "pending":
      return "Payment Pending";

    case "paid":
      return "Paid";

    case "refunded":
      return "Refunded";
  }
}

function getPaymentStatusClasses(
  status: PaymentStatus
) {
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

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      className="rounded-2xl bg-slate-50 p-4"
      style={{
        minWidth: 180,
        flexBasis: 220,
        flexGrow: 1,
      }}
    >
      <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </Text>

      <Text className="mt-2 font-semibold leading-6 text-slate-800">
        {value}
      </Text>
    </View>
  );
}

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  const rounded = Math.round(rating);

  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <Text
            key={star}
            className={
              star <= rounded
                ? "text-lg text-amber-500"
                : "text-lg text-slate-300"
            }
          >
            ★
          </Text>
        )
      )}
    </View>
  );
}

function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text
        className={
          bold
            ? "text-base font-bold text-slate-900"
            : "text-slate-500"
        }
      >
        {label}
      </Text>

      <Text
        className={
          bold
            ? "text-lg font-bold text-slate-900"
            : "font-semibold text-slate-700"
        }
      >
        {value}
      </Text>
    </View>
  );
}

function getTimeline(
  booking: Booking
): TimelineItem[] {
  if (booking.status === "cancelled") {
    return [
      {
        title: "Booking Created",
        description:
          "Your service booking was created.",
        time: booking.createdAt,
        status: "completed",
      },
      {
        title: "Booking Confirmed",
        description:
          "The provider accepted your booking.",
        time: booking.confirmedAt,
        status: booking.confirmedAt
          ? "completed"
          : "pending",
      },
      {
        title: "Booking Cancelled",
        description:
          booking.cancellationReason ??
          "The booking was cancelled.",
        time: booking.cancelledAt,
        status: "cancelled",
      },
    ];
  }

  return [
    {
      title: "Booking Created",
      description:
        "Your service request was created successfully.",
      time: booking.createdAt,
      status: "completed",
    },
    {
      title: "Provider Confirmation",
      description:
        booking.confirmedAt
          ? "The provider accepted your booking."
          : "Waiting for provider confirmation.",
      time: booking.confirmedAt,
      status:
        booking.status === "pending"
          ? "current"
          : booking.confirmedAt
            ? "completed"
            : "pending",
    },
    {
      title: "Service Started",
      description:
        booking.startedAt
          ? "The provider started the service."
          : "Service will start at the scheduled time.",
      time: booking.startedAt,
      status:
        booking.status === "in_progress"
          ? "current"
          : booking.startedAt
            ? "completed"
            : "pending",
    },
    {
      title: "Service Completed",
      description:
        booking.completedAt
          ? "The service was completed successfully."
          : "Completion will appear here after the service.",
      time: booking.completedAt,
      status:
        booking.status === "completed"
          ? "completed"
          : "pending",
    },
  ];
}

export default function BookingDetailsScreen() {
  const params =
    useLocalSearchParams<{
      bookingId?: string | string[];
    }>();

  const bookingIdParam =
    Array.isArray(params.bookingId)
      ? params.bookingId[0]
      : params.bookingId;

  const bookingId =
    Number(bookingIdParam);

  const [cancelledLocally, setCancelledLocally] =
    useState(false);

  const booking = useMemo(
    () =>
      bookings.find(
        (item) =>
          item.id === bookingId
      ),
    [bookingId]
  );

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            📋
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Booking not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            We couldn't find this booking.
            It may have been removed or the
            booking ID is incorrect.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/bookings"
              )
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View My Bookings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const effectiveStatus:
    BookingStatus =
    cancelledLocally
      ? "cancelled"
      : booking.status;

  const bookingStatus =
    getBookingStatusClasses(
      effectiveStatus
    );

  const paymentStatus =
    getPaymentStatusClasses(
      booking.paymentStatus
    );

  const timeline =
    getTimeline({
      ...booking,
      status: effectiveStatus,
      cancellationReason:
        cancelledLocally
          ? "Cancelled by customer."
          : booking.cancellationReason,
      cancelledAt:
        cancelledLocally
          ? "Just now"
          : booking.cancelledAt,
    });

  const canCancel =
    effectiveStatus === "pending" ||
    effectiveStatus === "confirmed";

  const openProvider = () => {
    router.push({
      pathname:
        "/providers/[providerId]",
      params: {
        providerId: String(
          booking.providerId
        ),
      },
    });
  };

  const openPayment = () => {
    router.push({
      pathname:
        "/payment/[bookingId]",
      params: {
        bookingId: String(
          booking.id
        ),
      },
    });
  };

  const openReview = () => {
    router.push({
      pathname:
        "/review/[bookingId]",
      params: {
        bookingId: String(
          booking.id
        ),
      },
    });
  };

  const bookAgain = () => {
    router.push({
      pathname:
        "/booking/[providerServiceId]",
      params: {
        providerServiceId:
          String(
            booking.providerServiceId
          ),
        providerId:
          String(
            booking.providerId
          ),
      },
    });
  };

  const cancelBooking = () => {
    const performCancel = () => {
      setCancelledLocally(true);

      if (Platform.OS === "web") {
        window.alert(
          "Booking cancelled successfully."
        );
      }
    };

    if (Platform.OS === "web") {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this booking?"
        );

      if (confirmed) {
        performCancel();
      }

      return;
    }

    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress:
            performCancel,
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
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1200,
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
          maxWidth: 1200,
        }}
      >
        {/* Top Heading */}
        <View className="mb-6 flex-row flex-wrap items-start justify-between gap-5">
          <View
            style={{
              minWidth: 240,
              flexBasis: 600,
              flexGrow: 1,
            }}
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Booking #{booking.id}
            </Text>

            <Text className="mt-2 text-3xl font-bold text-slate-900">
              {booking.serviceName}
            </Text>

            <Text className="mt-2 max-w-2xl leading-6 text-slate-500">
              {booking.serviceDescription}
            </Text>
          </View>

          <View className="items-end gap-2">
            <View
              className={`rounded-full px-4 py-2 ${bookingStatus.container}`}
            >
              <Text
                className={`font-bold ${bookingStatus.text}`}
              >
                {formatBookingStatus(
                  effectiveStatus
                )}
              </Text>
            </View>

            <View
              className={`rounded-full px-4 py-2 ${paymentStatus.container}`}
            >
              <Text
                className={`text-sm font-semibold ${paymentStatus.text}`}
              >
                {formatPaymentStatus(
                  booking.paymentStatus
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="mb-5 text-xl font-bold text-slate-900">
            Service Schedule
          </Text>

          <View className="flex-row flex-wrap gap-4">
            <InfoBox
              label="Date"
              value={`📅 ${booking.date}`}
            />

            <InfoBox
              label="Time"
              value={`🕐 ${booking.time}`}
            />

            <InfoBox
              label="Booking ID"
              value={`#${booking.id}`}
            />

            <InfoBox
              label="Booked On"
              value={booking.createdAt}
            />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-6">
          {/* Main Column */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 700,
              flexGrow: 2,
            }}
          >
            {/* Provider */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                Service Professional
              </Text>

              <View className="flex-row flex-wrap items-center gap-5">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-2xl font-bold text-blue-700">
                    {
                      booking.providerInitials
                    }
                  </Text>
                </View>

                <View
                  style={{
                    minWidth: 200,
                    flexBasis: 350,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-xl font-bold text-slate-900">
                    {
                      booking.providerName
                    }
                  </Text>

                  <View className="mt-2 flex-row flex-wrap items-center gap-2">
                    <RatingStars
                      rating={
                        booking.providerRating
                      }
                    />

                    <Text className="font-bold text-slate-700">
                      {
                        booking.providerRating
                      }
                    </Text>
                  </View>

                  <Text className="mt-2 text-sm text-slate-500">
                    {
                      booking.providerExperience
                    }{" "}
                    experience
                  </Text>
                </View>

                <Pressable
                  onPress={
                    openProvider
                  }
                  className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
                >
                  <Text className="font-bold text-blue-700">
                    View Profile
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Address */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Service Address
              </Text>

              <View className="mt-5 rounded-2xl bg-slate-50 p-5">
                <View className="mb-2 self-start rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-xs font-bold text-blue-700">
                    {
                      booking.addressLabel
                    }
                  </Text>
                </View>

                <Text className="text-base leading-7 text-slate-700">
                  📍 {booking.address}
                </Text>
              </View>
            </View>

            {/* Problem Description */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Service Requirement
              </Text>

              <View className="mt-5">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Problem / Requirement
                </Text>

                <Text className="mt-2 leading-7 text-slate-700">
                  {booking.problem ||
                    "No problem description provided."}
                </Text>
              </View>

              {!!booking.notes && (
                <View className="mt-5 rounded-2xl bg-amber-50 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    Additional Note
                  </Text>

                  <Text className="mt-2 leading-6 text-amber-900">
                    {booking.notes}
                  </Text>
                </View>
              )}
            </View>

            {/* Timeline */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-6 text-xl font-bold text-slate-900">
                Booking Timeline
              </Text>

              <View className="gap-1">
                {timeline.map(
                  (
                    item,
                    index
                  ) => {
                    const isLast =
                      index ===
                      timeline.length -
                      1;

                    return (
                      <View
                        key={`${item.title}-${index}`}
                        className="flex-row"
                      >
                        <View className="mr-4 items-center">
                          <View
                            className={
                              item.status ===
                                "completed"
                                ? "h-8 w-8 items-center justify-center rounded-full bg-green-100"
                                : item.status ===
                                  "current"
                                  ? "h-8 w-8 items-center justify-center rounded-full bg-blue-100"
                                  : item.status ===
                                    "cancelled"
                                    ? "h-8 w-8 items-center justify-center rounded-full bg-red-100"
                                    : "h-8 w-8 items-center justify-center rounded-full bg-slate-100"
                            }
                          >
                            <Text
                              className={
                                item.status ===
                                  "completed"
                                  ? "font-bold text-green-700"
                                  : item.status ===
                                    "current"
                                    ? "font-bold text-blue-700"
                                    : item.status ===
                                      "cancelled"
                                      ? "font-bold text-red-700"
                                      : "font-bold text-slate-400"
                              }
                            >
                              {item.status ===
                                "completed"
                                ? "✓"
                                : item.status ===
                                  "cancelled"
                                  ? "×"
                                  : "•"}
                            </Text>
                          </View>

                          {!isLast && (
                            <View className="min-h-[52px] w-px flex-1 bg-slate-200" />
                          )}
                        </View>

                        <View className="flex-1 pb-6">
                          <Text className="font-bold text-slate-900">
                            {
                              item.title
                            }
                          </Text>

                          <Text className="mt-1 leading-6 text-slate-500">
                            {
                              item.description
                            }
                          </Text>

                          {!!item.time && (
                            <Text className="mt-1 text-xs text-slate-400">
                              {
                                item.time
                              }
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  }
                )}
              </View>
            </View>
          </View>

          {/* Right Sidebar */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 350,
              flexGrow: 1,
            }}
          >
            {/* Price Summary */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-4 text-xl font-bold text-slate-900">
                Price Summary
              </Text>

              <PriceRow
                label="Service Price"
                value={`₹${booking.amount}`}
              />

              <PriceRow
                label="Service Charge"
                value={`₹${booking.serviceCharge}`}
              />

              {booking.discount >
                0 && (
                  <PriceRow
                    label="Discount"
                    value={`- ₹${booking.discount}`}
                  />
                )}

              <View className="my-3 h-px bg-slate-200" />

              <PriceRow
                label="Total"
                value={`₹${booking.totalAmount}`}
                bold
              />

              <View className="mt-4 rounded-xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Payment
                </Text>

                <Text className="mt-1 font-bold text-slate-800">
                  {formatPaymentStatus(
                    booking.paymentStatus
                  )}
                </Text>

                {!!booking.paymentMethod && (
                  <Text className="mt-1 text-sm text-slate-500">
                    {
                      booking.paymentMethod
                    }
                  </Text>
                )}
              </View>

              {booking.paymentStatus ===
                "pending" &&
                effectiveStatus !==
                "cancelled" && (
                  <Pressable
                    onPress={
                      openPayment
                    }
                    className="mt-5 items-center rounded-xl bg-blue-600 px-5 py-4"
                  >
                    <Text className="font-bold text-white">
                      Pay ₹
                      {
                        booking.totalAmount
                      }
                    </Text>
                  </Pressable>
                )}
            </View>

            {/* Actions */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                Booking Actions
              </Text>

              <View className="gap-3">
                {effectiveStatus ===
                  "completed" && (
                    <>
                      <Pressable
                        onPress={
                          openReview
                        }
                        className="items-center rounded-xl bg-amber-500 px-5 py-4"
                      >
                        <Text className="font-bold text-white">
                          ★ Write a Review
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={
                          bookAgain
                        }
                        className="items-center rounded-xl border border-blue-200 bg-blue-50 px-5 py-4"
                      >
                        <Text className="font-bold text-blue-700">
                          Book Again
                        </Text>
                      </Pressable>
                    </>
                  )}

                {effectiveStatus ===
                  "cancelled" && (
                    <Pressable
                      onPress={
                        bookAgain
                      }
                      className="items-center rounded-xl bg-blue-600 px-5 py-4"
                    >
                      <Text className="font-bold text-white">
                        Book Again
                      </Text>
                    </Pressable>
                  )}

                {canCancel && (
                  <Pressable
                    onPress={
                      cancelBooking
                    }
                    className="items-center rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                  >
                    <Text className="font-bold text-red-600">
                      Cancel Booking
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  onPress={() =>
                    router.push(
                      "/support"
                    )
                  }
                  className="items-center rounded-xl border border-slate-200 bg-white px-5 py-4"
                >
                  <Text className="font-bold text-slate-700">
                    Need Help?
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/bookings"
                    )
                  }
                  className="items-center rounded-xl px-5 py-3"
                >
                  <Text className="font-semibold text-blue-600">
                    View All Bookings
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}