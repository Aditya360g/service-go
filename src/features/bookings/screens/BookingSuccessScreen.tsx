import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
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

type BookingSuccessData = {
  id: number;

  serviceName: string;

  providerId: number;
  providerServiceId: number;
  providerName: string;
  providerInitials: string;

  date: string;
  time: string;

  addressLabel: string;
  address: string;

  problem?: string;
  notes?: string;

  servicePrice: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;

  createdAt: string;
};

/*
  TEMPORARY FRONTEND DATA

  Backend integration ke time sirf is mock data ki jagah
  GET booking API ka response use hoga.

  UI ko dobara banane ki zarurat nahi hogi.
*/
const demoBookings: BookingSuccessData[] = [
  {
    id: 1001,

    serviceName: "Washing Machine Repair",

    providerId: 5,
    providerServiceId: 501,
    providerName: "Rahul Provider",
    providerInitials: "RP",

    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",

    addressLabel: "Home",
    address: "Vaishali Nagar, Jaipur, Rajasthan",

    problem:
      "Washing machine is not spinning properly and making noise.",

    notes:
      "Please call before arriving.",

    servicePrice: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,

    bookingStatus: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",

    createdAt: "18 Sep 2026, 10:15 AM",
  },

  {
    id: 1002,

    serviceName: "Home Cleaning",

    providerId: 1,
    providerServiceId: 101,
    providerName: "Amit Sharma",
    providerInitials: "AS",

    date: "22 Sep 2026",
    time: "02:00 PM - 04:00 PM",

    addressLabel: "Home",
    address: "Mansarovar, Jaipur, Rajasthan",

    problem:
      "Need complete cleaning for 2BHK home.",

    notes:
      "Please bring cleaning equipment.",

    servicePrice: 499,
    serviceCharge: 49,
    discount: 50,
    totalAmount: 498,

    bookingStatus: "pending",
    paymentStatus: "pending",

    createdAt: "18 Sep 2026, 11:30 AM",
  },
];

function getParam(
  value?: string | string[]
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

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

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      className="rounded-2xl bg-slate-50 p-5"
      style={{
        minWidth: 190,
        flexBasis: 240,
        flexGrow: 1,
      }}
    >
      <Text className="text-2xl">
        {icon}
      </Text>

      <Text className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </Text>

      <Text className="mt-1 font-bold leading-6 text-slate-800">
        {value}
      </Text>
    </View>
  );
}

function PriceRow({
  label,
  value,
  bold = false,
  positive = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  positive?: boolean;
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
          positive
            ? "font-semibold text-green-600"
            : bold
              ? "text-xl font-bold text-slate-900"
              : "font-semibold text-slate-700"
        }
      >
        {value}
      </Text>
    </View>
  );
}

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string | string[];

    serviceName?: string | string[];

    providerId?: string | string[];
    providerServiceId?: string | string[];
    providerName?: string | string[];

    date?: string | string[];
    time?: string | string[];

    address?: string | string[];

    problem?: string | string[];
    notes?: string | string[];

    servicePrice?: string | string[];
    serviceCharge?: string | string[];
    discount?: string | string[];
    totalAmount?: string | string[];

    paymentStatus?: string | string[];
  }>();

  const bookingId = Number(
    getParam(params.bookingId)
  );

  const booking = useMemo<
    BookingSuccessData | undefined
  >(() => {
    /*
      BACKEND INTEGRATION:

      Later yahan:

      const booking =
        await bookingsApi.getBookingById(
          bookingId
        );

      use karna hai.

      Neeche ka UI same rahega.
    */

    const existingBooking =
      demoBookings.find(
        (item) =>
          item.id === bookingId
      );

    if (existingBooking) {
      return existingBooking;
    }

    /*
      Ye fallback CreateBookingScreen se
      newly-created booking ke params ko
      support karta hai.
    */
    if (
      bookingId &&
      !Number.isNaN(bookingId)
    ) {
      const servicePrice =
        Number(
          getParam(
            params.servicePrice
          )
        ) || 0;

      const serviceCharge =
        Number(
          getParam(
            params.serviceCharge
          )
        ) || 0;

      const discount =
        Number(
          getParam(params.discount)
        ) || 0;

      const suppliedTotal =
        Number(
          getParam(
            params.totalAmount
          )
        );

      const calculatedTotal =
        Math.max(
          servicePrice +
          serviceCharge -
          discount,
          0
        );

      const totalAmount =
        suppliedTotal ||
        calculatedTotal;

      const paymentStatusParam =
        getParam(
          params.paymentStatus
        );

      const paymentStatus: PaymentStatus =
        paymentStatusParam === "paid"
          ? "paid"
          : paymentStatusParam ===
            "refunded"
            ? "refunded"
            : "pending";

      const providerName =
        getParam(
          params.providerName
        ) || "ServiGo Expert";

      const providerInitials =
        providerName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) =>
            part.charAt(0)
          )
          .join("")
          .toUpperCase() || "SG";

      return {
        id: bookingId,

        serviceName:
          getParam(
            params.serviceName
          ) || "Home Service",

        providerId:
          Number(
            getParam(
              params.providerId
            )
          ) || 1,

        providerServiceId:
          Number(
            getParam(
              params.providerServiceId
            )
          ) || 1,

        providerName,
        providerInitials,

        date:
          getParam(params.date) ||
          "Scheduled date",

        time:
          getParam(params.time) ||
          "Scheduled time",

        addressLabel: "Home",

        address:
          getParam(
            params.address
          ) ||
          "Service address",

        problem:
          getParam(
            params.problem
          ),

        notes:
          getParam(params.notes),

        servicePrice,
        serviceCharge,
        discount,
        totalAmount,

        bookingStatus: "pending",
        paymentStatus,

        paymentMethod:
          paymentStatus === "paid"
            ? "Online Payment"
            : undefined,

        createdAt: "Just now",
      };
    }

    return undefined;
  }, [
    bookingId,
    params.address,
    params.date,
    params.discount,
    params.notes,
    params.paymentStatus,
    params.problem,
    params.providerId,
    params.providerName,
    params.providerServiceId,
    params.serviceCharge,
    params.serviceName,
    params.servicePrice,
    params.time,
    params.totalAmount,
  ]);

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Text className="text-4xl">
                📋
              </Text>
            </View>

            <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
              Booking not found
            </Text>

            <Text className="mt-2 text-center leading-6 text-slate-500">
              We couldn't find the booking
              confirmation details.
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/bookings"
                )
              }
              className="mt-6 w-full items-center rounded-xl bg-blue-600 px-5 py-4"
            >
              <Text className="font-bold text-white">
                View My Bookings
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.replace("/")
              }
              className="mt-2 px-5 py-3"
            >
              <Text className="font-semibold text-blue-600">
                Go to Home
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const bookingStatus =
    getBookingStatusClasses(
      booking.bookingStatus
    );

  const paymentStatus =
    getPaymentStatusClasses(
      booking.paymentStatus
    );

  const viewBooking = () => {
    router.replace({
      pathname:
        "/bookings/[bookingId]",
      params: {
        bookingId: String(
          booking.id
        ),
      },
    });
  };

  const openBookings = () => {
    router.replace("/bookings");
  };

  const openHome = () => {
    router.replace("/");
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

  const openSupport = () => {
    router.push("/support");
  };

  const bookAnotherService = () => {
    router.push("/services");
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
            maxWidth: 1200,
          }}
        >
          <Pressable
            onPress={openHome}
          >
            <View>
              <Text className="text-xl font-bold text-blue-600">
                ServiGo
              </Text>

              <Text className="text-xs text-slate-400">
                Your Home. Our Experts.
              </Text>
            </View>
          </Pressable>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={openBookings}
              className="rounded-xl px-4 py-2"
            >
              <Text className="font-semibold text-slate-700">
                My Bookings
              </Text>
            </Pressable>

            <Pressable
              onPress={openHome}
              className="rounded-xl bg-blue-600 px-5 py-2.5"
            >
              <Text className="font-bold text-white">
                Home
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View
        className="mx-auto w-full px-5 py-8"
        style={{
          maxWidth: 1100,
        }}
      >
        {/* Success Hero */}
        <View className="mb-6 items-center rounded-3xl bg-green-600 px-6 py-10 md:px-10">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-white">
            <Text className="text-5xl font-bold text-green-600">
              ✓
            </Text>
          </View>

          <Text className="mt-6 text-center text-3xl font-bold text-white">
            Booking Successful!
          </Text>

          <Text className="mt-3 max-w-2xl text-center text-base leading-7 text-green-50">
            Your service booking has been
            created successfully. You can
            track its status anytime from My
            Bookings.
          </Text>

          <View className="mt-6 rounded-full bg-green-700 px-5 py-2.5">
            <Text className="font-bold text-white">
              Booking #{booking.id}
            </Text>
          </View>
        </View>

        {/* Booking status */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <View className="flex-row flex-wrap items-start justify-between gap-5">
            <View
              style={{
                minWidth: 220,
                flexBasis: 500,
                flexGrow: 1,
              }}
            >
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Booked Service
              </Text>

              <Text className="mt-2 text-2xl font-bold text-slate-900">
                {booking.serviceName}
              </Text>

              <Text className="mt-2 text-sm text-slate-500">
                Booking created{" "}
                {booking.createdAt}
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
                    booking.bookingStatus
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
        </View>

        {/* Date / Time / Booking ID */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="mb-5 text-xl font-bold text-slate-900">
            Booking Details
          </Text>

          <View className="flex-row flex-wrap gap-4">
            <InfoCard
              icon="📅"
              label="Service Date"
              value={booking.date}
            />

            <InfoCard
              icon="🕐"
              label="Time Slot"
              value={booking.time}
            />

            <InfoCard
              icon="📋"
              label="Booking ID"
              value={`#${booking.id}`}
            />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-6">
          {/* Main Content */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 600,
              flexGrow: 2,
            }}
          >
            {/* Provider */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                Service Professional
              </Text>

              <View className="flex-row flex-wrap items-center gap-4">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-xl font-bold text-blue-700">
                    {
                      booking.providerInitials
                    }
                  </Text>
                </View>

                <View
                  style={{
                    minWidth: 180,
                    flexBasis: 300,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    {
                      booking.providerName
                    }
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {booking.serviceName}
                  </Text>

                  <View className="mt-2 self-start rounded-full bg-blue-50 px-3 py-1">
                    <Text className="text-xs font-bold text-blue-700">
                      ✓ ServiGo Provider
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={openProvider}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
                >
                  <Text className="font-bold text-blue-700">
                    View Provider
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
                <View className="self-start rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-xs font-bold text-blue-700">
                    {booking.addressLabel}
                  </Text>
                </View>

                <Text className="mt-3 text-base leading-7 text-slate-700">
                  📍 {booking.address}
                </Text>
              </View>
            </View>

            {/* Requirements */}
            {(booking.problem ||
              booking.notes) && (
                <View className="rounded-3xl border border-slate-200 bg-white p-6">
                  <Text className="text-xl font-bold text-slate-900">
                    Service Requirement
                  </Text>

                  {!!booking.problem && (
                    <View className="mt-5">
                      <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Problem / Requirement
                      </Text>

                      <Text className="mt-2 text-base leading-7 text-slate-700">
                        {booking.problem}
                      </Text>
                    </View>
                  )}

                  {!!booking.notes && (
                    <View className="mt-5 rounded-2xl bg-amber-50 p-4">
                      <Text className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                        Note for Provider
                      </Text>

                      <Text className="mt-2 leading-6 text-amber-900">
                        {booking.notes}
                      </Text>
                    </View>
                  )}
                </View>
              )}
          </View>

          {/* Sidebar */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 350,
              flexGrow: 1,
            }}
          >
            {/* Payment */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-4 text-xl font-bold text-slate-900">
                Payment Summary
              </Text>

              <PriceRow
                label="Service Price"
                value={`₹${booking.servicePrice}`}
              />

              <PriceRow
                label="Service Charge"
                value={`₹${booking.serviceCharge}`}
              />

              {booking.discount > 0 && (
                <PriceRow
                  label="Discount"
                  value={`- ₹${booking.discount}`}
                  positive
                />
              )}

              <View className="my-3 h-px bg-slate-200" />

              <PriceRow
                label="Total Amount"
                value={`₹${booking.totalAmount}`}
                bold
              />

              <View
                className={`mt-5 rounded-xl p-4 ${paymentStatus.container}`}
              >
                <Text
                  className={`text-xs font-semibold uppercase tracking-wider ${paymentStatus.text}`}
                >
                  Payment Status
                </Text>

                <Text
                  className={`mt-1 font-bold ${paymentStatus.text}`}
                >
                  {formatPaymentStatus(
                    booking.paymentStatus
                  )}
                </Text>

                {!!booking.paymentMethod && (
                  <Text className="mt-1 text-sm text-slate-500">
                    {booking.paymentMethod}
                  </Text>
                )}
              </View>

              {booking.paymentStatus ===
                "pending" && (
                  <Pressable
                    onPress={openPayment}
                    className="mt-5 items-center rounded-xl bg-blue-600 px-5 py-4"
                  >
                    <Text className="font-bold text-white">
                      Continue to Payment
                    </Text>
                  </Pressable>
                )}
            </View>

            {/* Next Steps */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                What happens next?
              </Text>

              <View className="gap-5">
                <View className="flex-row">
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Text className="font-bold text-blue-700">
                      1
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-slate-800">
                      Provider Confirmation
                    </Text>

                    <Text className="mt-1 text-sm leading-6 text-slate-500">
                      Your provider receives
                      your service request and
                      confirms the booking.
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Text className="font-bold text-blue-700">
                      2
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-slate-800">
                      Professional Arrives
                    </Text>

                    <Text className="mt-1 text-sm leading-6 text-slate-500">
                      The professional visits
                      your address at the
                      selected date and time.
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Text className="font-bold text-blue-700">
                      3
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-slate-800">
                      Service Completion
                    </Text>

                    <Text className="mt-1 text-sm leading-6 text-slate-500">
                      Once your service is
                      complete, booking status
                      will be updated.
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    <Text className="font-bold text-blue-700">
                      4
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="font-bold text-slate-800">
                      Rate & Review
                    </Text>

                    <Text className="mt-1 text-sm leading-6 text-slate-500">
                      Share your experience
                      after service completion.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Booking CTA */}
        <View className="mt-6 rounded-3xl bg-slate-900 p-7 md:p-8">
          <View className="flex-row flex-wrap items-center justify-between gap-6">
            <View
              style={{
                minWidth: 240,
                flexBasis: 480,
                flexGrow: 1,
              }}
            >
              <Text className="text-2xl font-bold text-white">
                You're all set!
              </Text>

              <Text className="mt-2 leading-6 text-slate-300">
                Track provider confirmation,
                payment and service progress
                from your booking details.
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-3">
              <Pressable
                onPress={viewBooking}
                className="rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  View Booking
                </Text>
              </Pressable>

              <Pressable
                onPress={openBookings}
                className="rounded-xl border border-slate-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  My Bookings
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Other actions */}
        <View className="mt-5 flex-row flex-wrap items-center justify-center gap-3">
          <Pressable
            onPress={bookAnotherService}
            className="rounded-xl px-5 py-3"
          >
            <Text className="font-semibold text-blue-600">
              + Book Another Service
            </Text>
          </Pressable>

          <Pressable
            onPress={openSupport}
            className="rounded-xl px-5 py-3"
          >
            <Text className="font-semibold text-slate-600">
              Need Help?
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}