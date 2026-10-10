import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking";

type PaymentStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed";

type BookingPaymentData = {
  bookingId: number;

  providerId: number;
  providerServiceId: number;

  providerName: string;
  providerInitials: string;

  serviceName: string;

  date: string;
  time: string;

  address: string;

  problem?: string;
  notes?: string;

  servicePrice: number;
  serviceCharge: number;
  discount: number;
  totalAmount: number;

  paymentStatus: PaymentStatus;
};

type CardForm = {
  cardNumber: string;
  nameOnCard: string;
  expiry: string;
  cvv: string;
};

type CardErrors = Partial<
  Record<keyof CardForm, string>
>;

const demoBookings: BookingPaymentData[] = [
  {
    bookingId: 1001,

    providerId: 5,
    providerServiceId: 501,

    providerName: "Rahul Provider",
    providerInitials: "RP",

    serviceName:
      "Washing Machine Repair",

    date: "20 Sep 2026",
    time:
      "10:00 AM - 11:00 AM",

    address:
      "Vaishali Nagar, Jaipur, Rajasthan",

    problem:
      "Washing machine is not spinning properly.",

    notes:
      "Please call before arriving.",

    servicePrice: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,

    paymentStatus: "pending",
  },

  {
    bookingId: 1002,

    providerId: 1,
    providerServiceId: 101,

    providerName: "Amit Sharma",
    providerInitials: "AS",

    serviceName:
      "Home Cleaning",

    date: "22 Sep 2026",
    time:
      "02:00 PM - 04:00 PM",

    address:
      "Mansarovar, Jaipur, Rajasthan",

    problem:
      "Need complete cleaning for 2BHK home.",

    notes:
      "Please bring cleaning equipment.",

    servicePrice: 499,
    serviceCharge: 49,
    discount: 50,
    totalAmount: 498,

    paymentStatus: "pending",
  },
];

const banks = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Punjab National Bank",
];

function getParam(
  value?: string | string[]
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
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

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <Text className="mt-1 text-sm text-red-600">
      {message}
    </Text>
  );
}

export default function PaymentScreen() {
  const params =
    useLocalSearchParams<{
      bookingId?:
      | string
      | string[];

      providerId?:
      | string
      | string[];

      providerServiceId?:
      | string
      | string[];

      providerName?:
      | string
      | string[];

      serviceName?:
      | string
      | string[];

      date?:
      | string
      | string[];

      time?:
      | string
      | string[];

      address?:
      | string
      | string[];

      problem?:
      | string
      | string[];

      notes?:
      | string
      | string[];

      servicePrice?:
      | string
      | string[];

      serviceCharge?:
      | string
      | string[];

      discount?:
      | string
      | string[];

      totalAmount?:
      | string
      | string[];

      returnTo?:
      | string
      | string[];
    }>();

  const bookingId =
    Number(
      getParam(
        params.bookingId
      )
    );

  const booking =
    useMemo<
      BookingPaymentData | undefined
    >(() => {
      /*
        BACKEND INTEGRATION LATER

        Replace this lookup with:

        const response =
          await paymentsApi.getPaymentSummary(
            bookingId
          );

        return response.data;

        UI same rahegi.
      */

      const existing =
        demoBookings.find(
          (item) =>
            item.bookingId ===
            bookingId
        );

      if (existing) {
        return existing;
      }

      if (
        !bookingId ||
        Number.isNaN(
          bookingId
        )
      ) {
        return undefined;
      }

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
          getParam(
            params.discount
          )
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

      const providerName =
        getParam(
          params.providerName
        ) ||
        "ServiGo Expert";

      const initials =
        providerName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) =>
            part.charAt(0)
          )
          .join("")
          .toUpperCase() ||
        "SG";

      return {
        bookingId,

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
        providerInitials:
          initials,

        serviceName:
          getParam(
            params.serviceName
          ) ||
          "Home Service",

        date:
          getParam(
            params.date
          ) ||
          "Scheduled date",

        time:
          getParam(
            params.time
          ) ||
          "Scheduled time",

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
          getParam(
            params.notes
          ),

        servicePrice,
        serviceCharge,
        discount,
        totalAmount,

        paymentStatus:
          "pending",
      };
    }, [
      bookingId,
      params.address,
      params.date,
      params.discount,
      params.notes,
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

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "upi"
    );

  const [upiId, setUpiId] =
    useState("");

  const [
    selectedBank,
    setSelectedBank,
  ] =
    useState("");

  const [card, setCard] =
    useState<CardForm>({
      cardNumber: "",
      nameOnCard: "",
      expiry: "",
      cvv: "",
    });

  const [
    cardErrors,
    setCardErrors,
  ] =
    useState<CardErrors>({});

  const [error, setError] =
    useState("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState<PaymentStatus>(
      "pending"
    );

  const [processing, setProcessing] =
    useState(false);

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
            💳
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Payment details not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            We couldn't find the
            booking associated with
            this payment.
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

  const updateCardField = <
    K extends keyof CardForm
  >(
    field: K,
    value: CardForm[K]
  ) => {
    setCard(
      (current) => ({
        ...current,
        [field]: value,
      })
    );

    setCardErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      })
    );

    setError("");
  };

  const validateUpi = () => {
    const value =
      upiId.trim();

    if (
      value.length < 5 ||
      !value.includes("@")
    ) {
      setError(
        "Enter a valid UPI ID, for example name@upi."
      );

      return false;
    }

    setError("");

    return true;
  };

  const validateCard = () => {
    const errors: CardErrors =
      {};

    const cardNumber =
      card.cardNumber.replace(
        /\s/g,
        ""
      );

    if (
      !/^\d{16}$/.test(
        cardNumber
      )
    ) {
      errors.cardNumber =
        "Enter a valid 16-digit card number.";
    }

    if (
      card.nameOnCard
        .trim()
        .length < 2
    ) {
      errors.nameOnCard =
        "Enter the name shown on the card.";
    }

    if (
      !/^(0[1-9]|1[0-2])\/\d{2}$/.test(
        card.expiry
      )
    ) {
      errors.expiry =
        "Use MM/YY format.";
    }

    if (
      !/^\d{3,4}$/.test(
        card.cvv
      )
    ) {
      errors.cvv =
        "Enter a valid CVV.";
    }

    setCardErrors(
      errors
    );

    if (
      Object.keys(
        errors
      ).length > 0
    ) {
      setError(
        "Please check your card details."
      );

      return false;
    }

    setError("");

    return true;
  };

  const validatePayment =
    () => {
      if (
        paymentMethod ===
        "upi"
      ) {
        return validateUpi();
      }

      if (
        paymentMethod ===
        "card"
      ) {
        return validateCard();
      }

      if (
        paymentMethod ===
        "netbanking" &&
        !selectedBank
      ) {
        setError(
          "Please select your bank."
        );

        return false;
      }

      setError("");

      return true;
    };

  const goToSuccess =
    () => {
      router.replace({
        pathname:
          "/booking-success/[bookingId]",

        params: {
          bookingId:
            String(
              booking.bookingId
            ),

          providerId:
            String(
              booking.providerId
            ),

          providerServiceId:
            String(
              booking.providerServiceId
            ),

          providerName:
            booking.providerName,

          serviceName:
            booking.serviceName,

          date:
            booking.date,

          time:
            booking.time,

          address:
            booking.address,

          problem:
            booking.problem ||
            "",

          notes:
            booking.notes ||
            "",

          servicePrice:
            String(
              booking.servicePrice
            ),

          serviceCharge:
            String(
              booking.serviceCharge
            ),

          discount:
            String(
              booking.discount
            ),

          totalAmount:
            String(
              booking.totalAmount
            ),

          paymentStatus:
            "paid",
        },
      });
    };

  const handlePayment =
    async () => {
      if (
        !validatePayment()
      ) {
        return;
      }

      setProcessing(true);
      setPaymentStatus(
        "processing"
      );
      setError("");

      try {
        const paymentPayload = {
          booking_id:
            booking.bookingId,

          amount:
            booking.totalAmount,

          payment_method:
            paymentMethod,

          upi_id:
            paymentMethod ===
              "upi"
              ? upiId.trim()
              : null,

          bank:
            paymentMethod ===
              "netbanking"
              ? selectedBank
              : null,

          /*
            Never send/store raw CVV
            in your backend/database.

            Real payment gateway SDK
            will tokenize sensitive
            card information.
          */
        };

        console.log(
          "Payment payload:",
          paymentPayload
        );

        /*
          ====================================
          PAYMENT GATEWAY INTEGRATION LATER
          ====================================

          Example flow:

          1. Backend:
             POST /payments/create-order

          2. Backend creates Razorpay /
             other gateway order.

          3. Frontend opens payment
             gateway checkout.

          4. Gateway returns:
             payment_id
             order_id
             signature

          5. Send result to backend:
             POST /payments/verify

          6. Backend verifies signature
             and updates payment as PAID.

          Then call goToSuccess().

          IMPORTANT:
          Card number / CVV should NOT
          be stored in your own database.

          UI below does not need to
          be rewritten.
        */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              800
            )
        );

        setPaymentStatus(
          "paid"
        );

        if (
          Platform.OS ===
          "web"
        ) {
          window.alert(
            "Payment completed successfully."
          );

          goToSuccess();

          return;
        }

        Alert.alert(
          "Payment Successful",
          `₹${booking.totalAmount} paid successfully.`,
          [
            {
              text: "Continue",
              onPress:
                goToSuccess,
            },
          ]
        );
      } catch (paymentError) {
        console.error(
          "Payment error:",
          paymentError
        );

        setPaymentStatus(
          "failed"
        );

        setError(
          "Payment failed. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    };

  const handlePayLater =
    () => {
      router.replace({
        pathname:
          "/booking-success/[bookingId]",

        params: {
          bookingId:
            String(
              booking.bookingId
            ),

          providerId:
            String(
              booking.providerId
            ),

          providerServiceId:
            String(
              booking.providerServiceId
            ),

          providerName:
            booking.providerName,

          serviceName:
            booking.serviceName,

          date:
            booking.date,

          time:
            booking.time,

          address:
            booking.address,

          problem:
            booking.problem ||
            "",

          notes:
            booking.notes ||
            "",

          servicePrice:
            String(
              booking.servicePrice
            ),

          serviceCharge:
            String(
              booking.serviceCharge
            ),

          discount:
            String(
              booking.discount
            ),

          totalAmount:
            String(
              booking.totalAmount
            ),

          paymentStatus:
            "pending",
        },
      });
    };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {/* HEADER */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row flex-wrap items-center justify-between gap-3"
          style={{
            maxWidth: 1200,
          }}
        >
          <Pressable
            disabled={processing}
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
        {/* HEADING */}
        <View className="mb-7">
          <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Secure Payment
          </Text>

          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Complete your payment
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Choose your preferred
            payment method and securely
            complete your ServiGo
            booking.
          </Text>
        </View>

        {/* SECURITY MESSAGE */}
        <View className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
          <View className="flex-row items-start">
            <Text className="mr-3 text-xl">
              🔒
            </Text>

            <View className="flex-1">
              <Text className="font-bold text-green-800">
                Secure Payment
              </Text>

              <Text className="mt-1 text-sm leading-5 text-green-700">
                Payment details will be
                handled securely through
                the payment gateway.
                ServiGo will not store
                your card CVV.
              </Text>
            </View>
          </View>
        </View>

        {!!error && (
          <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <Text className="font-semibold text-red-700">
              {error}
            </Text>
          </View>
        )}

        {paymentStatus ===
          "failed" && (
            <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <Text className="font-bold text-red-700">
                Payment Failed
              </Text>

              <Text className="mt-1 text-sm text-red-600">
                No payment has been
                confirmed. You can retry
                using the same or another
                payment method.
              </Text>
            </View>
          )}

        <View className="flex-row flex-wrap gap-6">
          {/* LEFT COLUMN */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 700,
              flexGrow: 2,
            }}
          >
            {/* BOOKING INFO */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                Booking Details
              </Text>

              <View className="flex-row flex-wrap items-center gap-5">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-xl font-bold text-blue-700">
                    {
                      booking.providerInitials
                    }
                  </Text>
                </View>

                <View
                  style={{
                    minWidth: 200,
                    flexBasis: 400,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-xl font-bold text-slate-900">
                    {
                      booking.serviceName
                    }
                  </Text>

                  <Text className="mt-1 font-semibold text-blue-600">
                    {
                      booking.providerName
                    }
                  </Text>

                  <Text className="mt-3 text-sm text-slate-500">
                    Booking #
                    {
                      booking.bookingId
                    }
                  </Text>
                </View>

                <View className="rounded-2xl bg-blue-50 px-5 py-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Payable
                  </Text>

                  <Text className="mt-1 text-2xl font-bold text-blue-700">
                    ₹
                    {
                      booking.totalAmount
                    }
                  </Text>
                </View>
              </View>

              <View className="mt-5 flex-row flex-wrap gap-3">
                <View
                  className="rounded-xl bg-slate-50 p-4"
                  style={{
                    minWidth: 180,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </Text>

                  <Text className="mt-2 font-semibold text-slate-800">
                    📅 {booking.date}
                  </Text>
                </View>

                <View
                  className="rounded-xl bg-slate-50 p-4"
                  style={{
                    minWidth: 180,
                    flexBasis: 240,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Time
                  </Text>

                  <Text className="mt-2 font-semibold text-slate-800">
                    🕐 {booking.time}
                  </Text>
                </View>
              </View>
            </View>

            {/* PAYMENT METHOD */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Choose Payment Method
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Select how you would
                like to pay.
              </Text>

              <View className="mt-5 flex-row flex-wrap gap-3">
                <Pressable
                  onPress={() => {
                    setPaymentMethod(
                      "upi"
                    );
                    setError("");
                  }}
                  className={
                    paymentMethod ===
                      "upi"
                      ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                      : "rounded-2xl border border-slate-200 bg-white p-5"
                  }
                  style={{
                    minWidth: 180,
                    flexBasis: 210,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-3xl">
                    📱
                  </Text>

                  <Text className="mt-3 font-bold text-slate-900">
                    UPI
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Pay using your UPI ID
                  </Text>

                  {paymentMethod ===
                    "upi" && (
                      <View className="mt-3 self-start rounded-full bg-blue-600 px-3 py-1">
                        <Text className="text-xs font-bold text-white">
                          ✓ Selected
                        </Text>
                      </View>
                    )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    setPaymentMethod(
                      "card"
                    );
                    setError("");
                  }}
                  className={
                    paymentMethod ===
                      "card"
                      ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                      : "rounded-2xl border border-slate-200 bg-white p-5"
                  }
                  style={{
                    minWidth: 180,
                    flexBasis: 210,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-3xl">
                    💳
                  </Text>

                  <Text className="mt-3 font-bold text-slate-900">
                    Card
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Debit / Credit Card
                  </Text>

                  {paymentMethod ===
                    "card" && (
                      <View className="mt-3 self-start rounded-full bg-blue-600 px-3 py-1">
                        <Text className="text-xs font-bold text-white">
                          ✓ Selected
                        </Text>
                      </View>
                    )}
                </Pressable>

                <Pressable
                  onPress={() => {
                    setPaymentMethod(
                      "netbanking"
                    );
                    setError("");
                  }}
                  className={
                    paymentMethod ===
                      "netbanking"
                      ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                      : "rounded-2xl border border-slate-200 bg-white p-5"
                  }
                  style={{
                    minWidth: 180,
                    flexBasis: 210,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-3xl">
                    🏦
                  </Text>

                  <Text className="mt-3 font-bold text-slate-900">
                    Net Banking
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Pay via your bank
                  </Text>

                  {paymentMethod ===
                    "netbanking" && (
                      <View className="mt-3 self-start rounded-full bg-blue-600 px-3 py-1">
                        <Text className="text-xs font-bold text-white">
                          ✓ Selected
                        </Text>
                      </View>
                    )}
                </Pressable>
              </View>
            </View>

            {/* UPI */}
            {paymentMethod ===
              "upi" && (
                <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
                  <Text className="text-xl font-bold text-slate-900">
                    Pay with UPI
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-slate-500">
                    Enter your UPI ID.
                    Gateway-based UPI apps
                    can be connected later
                    without changing this
                    page layout.
                  </Text>

                  <Text className="mb-2 mt-6 text-sm font-bold text-slate-700">
                    UPI ID
                  </Text>

                  <View className="rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <TextInput
                      value={upiId}
                      onChangeText={(
                        value
                      ) => {
                        setUpiId(
                          value
                        );

                        setError("");
                      }}
                      placeholder="example@upi"
                      placeholderTextColor="#94a3b8"
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={80}
                      className="py-4 text-base text-slate-900 outline-none"
                    />
                  </View>

                  <View className="mt-4 rounded-xl bg-blue-50 p-4">
                    <Text className="text-sm leading-6 text-blue-800">
                      After confirming
                      payment, your payment
                      provider may require
                      additional
                      authorization.
                    </Text>
                  </View>
                </View>
              )}

            {/* CARD */}
            {paymentMethod ===
              "card" && (
                <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
                  <Text className="text-xl font-bold text-slate-900">
                    Card Details
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Enter your card
                    information securely.
                  </Text>

                  {/* Card Number */}
                  <View className="mt-6">
                    <Text className="mb-2 text-sm font-bold text-slate-700">
                      Card Number
                    </Text>

                    <View
                      className={
                        cardErrors.cardNumber
                          ? "rounded-xl border border-red-400 bg-white px-4"
                          : "rounded-xl border border-slate-200 bg-white px-4"
                      }
                    >
                      <TextInput
                        value={
                          card.cardNumber
                        }
                        onChangeText={(
                          value
                        ) => {
                          const digits =
                            value.replace(
                              /\D/g,
                              ""
                            );

                          const limited =
                            digits.slice(
                              0,
                              16
                            );

                          const formatted =
                            limited.replace(
                              /(.{4})/g,
                              "$1 "
                            );

                          updateCardField(
                            "cardNumber",
                            formatted.trim()
                          );
                        }}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#94a3b8"
                        keyboardType="number-pad"
                        maxLength={19}
                        className="py-4 text-base text-slate-900 outline-none"
                      />
                    </View>

                    <FieldError
                      message={
                        cardErrors.cardNumber
                      }
                    />
                  </View>

                  {/* Name */}
                  <View className="mt-5">
                    <Text className="mb-2 text-sm font-bold text-slate-700">
                      Name on Card
                    </Text>

                    <View
                      className={
                        cardErrors.nameOnCard
                          ? "rounded-xl border border-red-400 bg-white px-4"
                          : "rounded-xl border border-slate-200 bg-white px-4"
                      }
                    >
                      <TextInput
                        value={
                          card.nameOnCard
                        }
                        onChangeText={(
                          value
                        ) =>
                          updateCardField(
                            "nameOnCard",
                            value
                          )
                        }
                        placeholder="Name as shown on card"
                        placeholderTextColor="#94a3b8"
                        autoCapitalize="words"
                        maxLength={80}
                        className="py-4 text-base text-slate-900 outline-none"
                      />
                    </View>

                    <FieldError
                      message={
                        cardErrors.nameOnCard
                      }
                    />
                  </View>

                  {/* Expiry + CVV */}
                  <View className="mt-5 flex-row flex-wrap gap-4">
                    <View
                      style={{
                        minWidth: 160,
                        flexBasis: 250,
                        flexGrow: 1,
                      }}
                    >
                      <Text className="mb-2 text-sm font-bold text-slate-700">
                        Expiry
                      </Text>

                      <View
                        className={
                          cardErrors.expiry
                            ? "rounded-xl border border-red-400 bg-white px-4"
                            : "rounded-xl border border-slate-200 bg-white px-4"
                        }
                      >
                        <TextInput
                          value={
                            card.expiry
                          }
                          onChangeText={(
                            value
                          ) => {
                            const digits =
                              value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  4
                                );

                            const formatted =
                              digits.length >
                                2
                                ? `${digits.slice(
                                  0,
                                  2
                                )}/${digits.slice(
                                  2
                                )}`
                                : digits;

                            updateCardField(
                              "expiry",
                              formatted
                            );
                          }}
                          placeholder="MM/YY"
                          placeholderTextColor="#94a3b8"
                          keyboardType="number-pad"
                          maxLength={5}
                          className="py-4 text-base text-slate-900 outline-none"
                        />
                      </View>

                      <FieldError
                        message={
                          cardErrors.expiry
                        }
                      />
                    </View>

                    <View
                      style={{
                        minWidth: 160,
                        flexBasis: 250,
                        flexGrow: 1,
                      }}
                    >
                      <Text className="mb-2 text-sm font-bold text-slate-700">
                        CVV
                      </Text>

                      <View
                        className={
                          cardErrors.cvv
                            ? "rounded-xl border border-red-400 bg-white px-4"
                            : "rounded-xl border border-slate-200 bg-white px-4"
                        }
                      >
                        <TextInput
                          value={
                            card.cvv
                          }
                          onChangeText={(
                            value
                          ) =>
                            updateCardField(
                              "cvv",
                              value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  4
                                )
                            )
                          }
                          placeholder="123"
                          placeholderTextColor="#94a3b8"
                          keyboardType="number-pad"
                          secureTextEntry
                          maxLength={4}
                          className="py-4 text-base text-slate-900 outline-none"
                        />
                      </View>

                      <FieldError
                        message={
                          cardErrors.cvv
                        }
                      />
                    </View>
                  </View>

                  <View className="mt-5 rounded-xl bg-amber-50 p-4">
                    <Text className="text-sm leading-6 text-amber-900">
                      Card inputs are UI
                      placeholders until the
                      payment gateway SDK is
                      connected. Raw card
                      details must never be
                      stored in ServiGo's
                      database.
                    </Text>
                  </View>
                </View>
              )}

            {/* NETBANKING */}
            {paymentMethod ===
              "netbanking" && (
                <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
                  <Text className="text-xl font-bold text-slate-900">
                    Select Bank
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Choose your bank to
                    continue with net
                    banking.
                  </Text>

                  <View className="mt-5 gap-3">
                    {banks.map(
                      (bank) => {
                        const selected =
                          selectedBank ===
                          bank;

                        return (
                          <Pressable
                            key={bank}
                            onPress={() => {
                              setSelectedBank(
                                bank
                              );
                              setError(
                                ""
                              );
                            }}
                            className={
                              selected
                                ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                                : "rounded-2xl border border-slate-200 bg-white p-5"
                            }
                          >
                            <View className="flex-row items-center">
                              <View
                                className={
                                  selected
                                    ? "mr-4 h-6 w-6 items-center justify-center rounded-full bg-blue-600"
                                    : "mr-4 h-6 w-6 rounded-full border-2 border-slate-300"
                                }
                              >
                                {selected && (
                                  <Text className="text-xs font-bold text-white">
                                    ✓
                                  </Text>
                                )}
                              </View>

                              <Text className="font-bold text-slate-800">
                                {bank}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      }
                    )}
                  </View>
                </View>
              )}
          </View>

          {/* RIGHT SIDEBAR */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 350,
              flexGrow: 1,
            }}
          >
            {/* ORDER SUMMARY */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Payment Summary
              </Text>

              <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Service
                </Text>

                <Text className="mt-2 font-bold text-slate-900">
                  {
                    booking.serviceName
                  }
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {
                    booking.providerName
                  }
                </Text>
              </View>

              <View className="mt-5">
                <PriceRow
                  label="Service Price"
                  value={`₹${booking.servicePrice}`}
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
                      positive
                    />
                  )}

                <View className="my-3 h-px bg-slate-200" />

                <PriceRow
                  label="Total Payable"
                  value={`₹${booking.totalAmount}`}
                  bold
                />
              </View>

              <Pressable
                disabled={processing}
                onPress={
                  handlePayment
                }
                className={
                  processing
                    ? "mt-6 items-center rounded-xl bg-blue-400 px-5 py-4"
                    : "mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
                }
              >
                <Text className="font-bold text-white">
                  {processing
                    ? "Processing Payment..."
                    : `Pay ₹${booking.totalAmount}`}
                </Text>
              </Pressable>

              <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
                Do not close the page
                while your payment is
                processing.
              </Text>

              <View className="my-5 h-px bg-slate-200" />

              <Pressable
                disabled={processing}
                onPress={
                  handlePayLater
                }
                className="items-center rounded-xl border border-slate-200 bg-white px-5 py-3.5"
              >
                <Text className="font-semibold text-slate-700">
                  Pay After Service
                </Text>
              </Pressable>
            </View>

            {/* SERVICE ADDRESS */}
            <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-lg font-bold text-slate-900">
                Service Address
              </Text>

              <Text className="mt-3 leading-6 text-slate-600">
                📍 {booking.address}
              </Text>
            </View>

            {/* TRUST */}
            <View className="mt-5 rounded-3xl bg-slate-900 p-6">
              <Text className="text-lg font-bold text-white">
                Protected by ServiGo
              </Text>

              <View className="mt-4 gap-3">
                <Text className="leading-6 text-slate-300">
                  ✓ Secure payment
                  gateway
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Booking linked
                  payment
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Payment status
                  tracking
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Refund-ready flow
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push(
                    "/support"
                  )
                }
                className="mt-5"
              >
                <Text className="font-semibold text-blue-300">
                  Payment issue? Get Help →
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}