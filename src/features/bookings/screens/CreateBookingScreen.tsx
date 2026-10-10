import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type ProviderService = {
  id: number;
  providerId: number;
  providerName: string;
  providerInitials: string;
  providerRating: number;

  serviceId: number;
  serviceName: string;

  description: string;
  duration: string;
  price: number;
};

type Address = {
  id: number;
  label: string;
  fullAddress: string;
};

type TimeSlot = {
  id: string;
  label: string;
  available: boolean;
};

type PaymentPreference =
  | "online"
  | "after_service";

const providerServices: ProviderService[] = [
  {
    id: 101,
    providerId: 1,
    providerName: "Amit Sharma",
    providerInitials: "AS",
    providerRating: 4.8,

    serviceId: 1,
    serviceName: "Home Cleaning",

    description:
      "Complete home cleaning including floors, dusting, kitchen surfaces and bathrooms.",

    duration: "2 - 4 hours",
    price: 499,
  },

  {
    id: 102,
    providerId: 1,
    providerName: "Amit Sharma",
    providerInitials: "AS",
    providerRating: 4.8,

    serviceId: 8,
    serviceName: "Bathroom Cleaning",

    description:
      "Deep bathroom cleaning covering floors, tiles and common fixtures.",

    duration: "1 - 2 hours",
    price: 399,
  },

  {
    id: 201,
    providerId: 2,
    providerName: "Rohit Verma",
    providerInitials: "RV",
    providerRating: 4.7,

    serviceId: 2,
    serviceName: "Electrician",

    description:
      "Electrical repairs, switches, sockets, fans, lights and basic wiring work.",

    duration: "30 min - 2 hours",
    price: 249,
  },

  {
    id: 301,
    providerId: 3,
    providerName: "Vikas Kumar",
    providerInitials: "VK",
    providerRating: 4.9,

    serviceId: 3,
    serviceName: "Plumber",

    description:
      "Tap repair, pipe leakage, drainage inspection and bathroom fitting work.",

    duration: "30 min - 2 hours",
    price: 299,
  },

  {
    id: 401,
    providerId: 4,
    providerName: "Sandeep Singh",
    providerInitials: "SS",
    providerRating: 4.6,

    serviceId: 4,
    serviceName: "AC Repair",

    description:
      "AC inspection, servicing and diagnosis of common cooling issues.",

    duration: "1 - 2 hours",
    price: 399,
  },

  {
    id: 501,
    providerId: 5,
    providerName: "Rahul Provider",
    providerInitials: "RP",
    providerRating: 5,

    serviceId: 5,
    serviceName: "Washing Machine Repair",

    description:
      "Washing machine inspection, diagnosis and common repair services.",

    duration: "1 - 2 hours",
    price: 599,
  },

  {
    id: 601,
    providerId: 6,
    providerName: "Manoj Sharma",
    providerInitials: "MS",
    providerRating: 4.5,

    serviceId: 6,
    serviceName: "Painting",

    description:
      "Interior and exterior home painting service.",

    duration: "Depends on property",
    price: 999,
  },

  {
    id: 701,
    providerId: 7,
    providerName: "Ajay Meena",
    providerInitials: "AM",
    providerRating: 4.4,

    serviceId: 7,
    serviceName: "Carpenter",

    description:
      "Furniture repair, installation and household woodwork.",

    duration: "1 - 3 hours",
    price: 299,
  },
];

const savedAddresses: Address[] = [
  {
    id: 1,
    label: "Home",
    fullAddress:
      "Vaishali Nagar, Jaipur, Rajasthan",
  },

  {
    id: 2,
    label: "Office",
    fullAddress:
      "C Scheme, Jaipur, Rajasthan",
  },

  {
    id: 3,
    label: "Other",
    fullAddress:
      "Mansarovar, Jaipur, Rajasthan",
  },
];

const timeSlots: TimeSlot[] = [
  {
    id: "09",
    label: "09:00 AM - 10:00 AM",
    available: true,
  },
  {
    id: "10",
    label: "10:00 AM - 11:00 AM",
    available: true,
  },
  {
    id: "11",
    label: "11:00 AM - 12:00 PM",
    available: false,
  },
  {
    id: "12",
    label: "12:00 PM - 01:00 PM",
    available: true,
  },
  {
    id: "14",
    label: "02:00 PM - 03:00 PM",
    available: true,
  },
  {
    id: "15",
    label: "03:00 PM - 04:00 PM",
    available: true,
  },
  {
    id: "16",
    label: "04:00 PM - 05:00 PM",
    available: false,
  },
  {
    id: "17",
    label: "05:00 PM - 06:00 PM",
    available: true,
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

function createUpcomingDates() {
  const dates: {
    id: string;
    day: string;
    date: string;
    fullDate: string;
  }[] = [];

  for (let i = 1; i <= 7; i += 1) {
    const current = new Date();

    current.setDate(
      current.getDate() + i
    );

    const id = current
      .toISOString()
      .split("T")[0];

    const day = current.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
      }
    );

    const date =
      current.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );

    const fullDate =
      current.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    dates.push({
      id,
      day,
      date,
      fullDate,
    });
  }

  return dates;
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

export default function CreateBookingScreen() {
  const params =
    useLocalSearchParams<{
      providerServiceId?:
      | string
      | string[];
      providerId?:
      | string
      | string[];
    }>();

  const providerServiceId =
    Number(
      getParam(
        params.providerServiceId
      )
    );

  const providerIdFromUrl =
    Number(
      getParam(
        params.providerId
      )
    );

  const service = useMemo(() => {
    const byProviderService =
      providerServices.find(
        (item) =>
          item.id ===
          providerServiceId
      );

    if (byProviderService) {
      return byProviderService;
    }

    if (
      providerIdFromUrl &&
      !Number.isNaN(
        providerIdFromUrl
      )
    ) {
      return providerServices.find(
        (item) =>
          item.providerId ===
          providerIdFromUrl
      );
    }

    return undefined;
  }, [
    providerIdFromUrl,
    providerServiceId,
  ]);

  const dates = useMemo(
    () => createUpcomingDates(),
    []
  );

  const [selectedDateId, setSelectedDateId] =
    useState("");

  const [selectedTimeId, setSelectedTimeId] =
    useState("");

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState<number | null>(
    savedAddresses[0]?.id ?? null
  );

  const [problem, setProblem] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [
    paymentPreference,
    setPaymentPreference,
  ] =
    useState<PaymentPreference>(
      "online"
    );

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const selectedDate =
    dates.find(
      (item) =>
        item.id === selectedDateId
    );

  const selectedTime =
    timeSlots.find(
      (item) =>
        item.id === selectedTimeId
    );

  const selectedAddress =
    savedAddresses.find(
      (item) =>
        item.id ===
        selectedAddressId
    );

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            🛠️
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Service not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            The selected provider service
            could not be found.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/providers"
              )
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              Browse Providers
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const serviceCharge = 49;

  const discount =
    service.price >= 499
      ? 50
      : 0;

  const totalAmount =
    service.price +
    serviceCharge -
    discount;

  const validateBooking = () => {
    if (!selectedDate) {
      setError(
        "Please select a service date."
      );

      return false;
    }

    if (!selectedTime) {
      setError(
        "Please select an available time slot."
      );

      return false;
    }

    if (!selectedAddress) {
      setError(
        "Please select a service address."
      );

      return false;
    }

    if (
      problem.trim().length < 5
    ) {
      setError(
        "Please describe your service requirement."
      );

      return false;
    }

    setError("");

    return true;
  };

  const createBooking = () => {
    if (!validateBooking()) {
      return;
    }

    if (
      !selectedDate ||
      !selectedTime ||
      !selectedAddress
    ) {
      return;
    }

    setSubmitting(true);

    /*
      BACKEND INTEGRATION LATER

      Yahan real API call lagegi:

      const response =
        await bookingsApi.createBooking({
          provider_service_id:
            service.id,

          scheduled_date:
            selectedDate.id,

          time_slot:
            selectedTime.label,

          address_id:
            selectedAddress.id,

          problem:
            problem.trim(),

          notes:
            notes.trim(),
        });

      const bookingId =
        response.data.id;

      UI change nahi hogi.
    */

    const bookingId =
      Math.floor(
        Date.now() / 1000
      );

    const successParams = {
      bookingId:
        String(bookingId),

      providerId:
        String(
          service.providerId
        ),

      providerServiceId:
        String(service.id),

      providerName:
        service.providerName,

      serviceName:
        service.serviceName,

      date:
        selectedDate.fullDate,

      time:
        selectedTime.label,

      address:
        selectedAddress.fullAddress,

      problem:
        problem.trim(),

      notes:
        notes.trim(),

      servicePrice:
        String(service.price),

      serviceCharge:
        String(serviceCharge),

      discount:
        String(discount),

      totalAmount:
        String(totalAmount),

      paymentStatus:
        "pending",
    };

    setSubmitting(false);

    /*
      Online payment select kiya hai to
      payment screen par jayega.

      Pay after service select kiya hai to
      direct booking success page.
    */

    if (
      paymentPreference ===
      "online"
    ) {
      router.push({
        pathname:
          "/payment/[bookingId]",
        params: {
          ...successParams,

          returnTo:
            "booking-success",
        },
      });

      return;
    }

    router.replace({
      pathname:
        "/booking-success/[bookingId]",
      params:
        successParams,
    });
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
        {/* Heading */}
        <View className="mb-7">
          <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Book Service
          </Text>

          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Complete your booking
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Select your preferred date,
            time and service address to
            schedule your ServiGo expert.
          </Text>
        </View>

        {/* Error */}
        {!!error && (
          <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <Text className="font-semibold text-red-700">
              {error}
            </Text>
          </View>
        )}

        <View className="flex-row flex-wrap gap-6">
          {/* LEFT CONTENT */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 720,
              flexGrow: 2,
            }}
          >
            {/* Provider + Service */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="mb-5 text-xl font-bold text-slate-900">
                Selected Service
              </Text>

              <View className="flex-row flex-wrap items-center gap-5">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-2xl font-bold text-blue-700">
                    {
                      service.providerInitials
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
                    {service.serviceName}
                  </Text>

                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname:
                          "/providers/[providerId]",
                        params: {
                          providerId:
                            String(
                              service.providerId
                            ),
                        },
                      })
                    }
                  >
                    <Text className="mt-1 font-semibold text-blue-600">
                      {
                        service.providerName
                      }
                    </Text>
                  </Pressable>

                  <Text className="mt-2 leading-6 text-slate-500">
                    {
                      service.description
                    }
                  </Text>

                  <View className="mt-3 flex-row flex-wrap gap-4">
                    <Text className="text-sm font-semibold text-slate-600">
                      ⭐{" "}
                      {
                        service.providerRating
                      }
                    </Text>

                    <Text className="text-sm font-semibold text-slate-600">
                      ⏱{" "}
                      {service.duration}
                    </Text>
                  </View>
                </View>

                <View className="rounded-2xl bg-slate-50 p-5">
                  <Text className="text-xs uppercase tracking-wider text-slate-400">
                    Service Price
                  </Text>

                  <Text className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{service.price}
                  </Text>
                </View>
              </View>
            </View>

            {/* Date */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Choose Date
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Select your preferred
                service date.
              </Text>

              <View className="mt-5 flex-row flex-wrap gap-3">
                {dates.map(
                  (date) => {
                    const selected =
                      selectedDateId ===
                      date.id;

                    return (
                      <Pressable
                        key={date.id}
                        onPress={() => {
                          setSelectedDateId(
                            date.id
                          );

                          setError("");
                        }}
                        className={
                          selected
                            ? "items-center rounded-2xl border-2 border-blue-600 bg-blue-50 px-5 py-4"
                            : "items-center rounded-2xl border border-slate-200 bg-white px-5 py-4"
                        }
                        style={{
                          minWidth: 100,
                        }}
                      >
                        <Text
                          className={
                            selected
                              ? "text-sm font-semibold text-blue-600"
                              : "text-sm font-semibold text-slate-500"
                          }
                        >
                          {date.day}
                        </Text>

                        <Text
                          className={
                            selected
                              ? "mt-1 text-base font-bold text-blue-700"
                              : "mt-1 text-base font-bold text-slate-900"
                          }
                        >
                          {date.date}
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>

            {/* Time Slot */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Choose Time
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Unavailable slots cannot
                be selected.
              </Text>

              <View className="mt-5 flex-row flex-wrap gap-3">
                {timeSlots.map(
                  (slot) => {
                    const selected =
                      selectedTimeId ===
                      slot.id;

                    return (
                      <Pressable
                        key={slot.id}
                        disabled={
                          !slot.available
                        }
                        onPress={() => {
                          setSelectedTimeId(
                            slot.id
                          );

                          setError("");
                        }}
                        className={
                          !slot.available
                            ? "rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 opacity-50"
                            : selected
                              ? "rounded-xl border-2 border-blue-600 bg-blue-50 px-5 py-3"
                              : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                        }
                      >
                        <Text
                          className={
                            !slot.available
                              ? "font-semibold text-slate-400"
                              : selected
                                ? "font-bold text-blue-700"
                                : "font-semibold text-slate-700"
                          }
                        >
                          {slot.label}
                        </Text>

                        {!slot.available && (
                          <Text className="mt-1 text-center text-xs text-slate-400">
                            Unavailable
                          </Text>
                        )}
                      </Pressable>
                    );
                  }
                )}
              </View>
            </View>

            {/* Address */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <View className="flex-row flex-wrap items-center justify-between gap-3">
                <View>
                  <Text className="text-xl font-bold text-slate-900">
                    Service Address
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Where should the
                    professional visit?
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/addresses/new"
                    )
                  }
                >
                  <Text className="font-semibold text-blue-600">
                    + Add Address
                  </Text>
                </Pressable>
              </View>

              <View className="mt-5 gap-3">
                {savedAddresses.map(
                  (address) => {
                    const selected =
                      selectedAddressId ===
                      address.id;

                    return (
                      <Pressable
                        key={address.id}
                        onPress={() => {
                          setSelectedAddressId(
                            address.id
                          );

                          setError("");
                        }}
                        className={
                          selected
                            ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                            : "rounded-2xl border border-slate-200 bg-white p-5"
                        }
                      >
                        <View className="flex-row items-start">
                          <View
                            className={
                              selected
                                ? "mr-4 mt-1 h-5 w-5 items-center justify-center rounded-full bg-blue-600"
                                : "mr-4 mt-1 h-5 w-5 rounded-full border-2 border-slate-300"
                            }
                          >
                            {selected && (
                              <Text className="text-xs font-bold text-white">
                                ✓
                              </Text>
                            )}
                          </View>

                          <View className="flex-1">
                            <Text className="font-bold text-slate-900">
                              {
                                address.label
                              }
                            </Text>

                            <Text className="mt-1 leading-6 text-slate-600">
                              {
                                address.fullAddress
                              }
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    );
                  }
                )}
              </View>

              <Pressable
                onPress={() =>
                  router.push(
                    "/addresses"
                  )
                }
                className="mt-4 self-start px-2 py-2"
              >
                <Text className="font-semibold text-blue-600">
                  Manage Addresses →
                </Text>
              </Pressable>
            </View>

            {/* Problem */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Describe Your Requirement
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Help the provider understand
                what work is required.
              </Text>

              <View className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <TextInput
                  value={problem}
                  onChangeText={(value) => {
                    setProblem(value);
                    setError("");
                  }}
                  placeholder="Example: Washing machine is not spinning and making unusual noise..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  className="min-h-[120px] py-3 text-base leading-6 text-slate-900 outline-none"
                />
              </View>

              <Text className="mt-2 text-right text-xs text-slate-400">
                {problem.length}/500
              </Text>
            </View>

            {/* Additional Note */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Additional Note
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Optional instructions for
                the professional.
              </Text>

              <View className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Example: Please call before arriving."
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                  maxLength={250}
                  className="min-h-[90px] py-3 text-base leading-6 text-slate-900 outline-none"
                />
              </View>

              <Text className="mt-2 text-right text-xs text-slate-400">
                {notes.length}/250
              </Text>
            </View>

            {/* Payment Preference */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Payment Preference
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Choose how you want to
                pay for this booking.
              </Text>

              <View className="mt-5 gap-3">
                <Pressable
                  onPress={() =>
                    setPaymentPreference(
                      "online"
                    )
                  }
                  className={
                    paymentPreference ===
                      "online"
                      ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                      : "rounded-2xl border border-slate-200 bg-white p-5"
                  }
                >
                  <View className="flex-row items-center">
                    <View
                      className={
                        paymentPreference ===
                          "online"
                          ? "mr-4 h-5 w-5 items-center justify-center rounded-full bg-blue-600"
                          : "mr-4 h-5 w-5 rounded-full border-2 border-slate-300"
                      }
                    >
                      {paymentPreference ===
                        "online" && (
                          <Text className="text-xs font-bold text-white">
                            ✓
                          </Text>
                        )}
                    </View>

                    <View className="flex-1">
                      <Text className="font-bold text-slate-900">
                        Pay Online
                      </Text>

                      <Text className="mt-1 text-sm leading-5 text-slate-500">
                        Continue to secure
                        online payment after
                        confirming booking.
                      </Text>
                    </View>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() =>
                    setPaymentPreference(
                      "after_service"
                    )
                  }
                  className={
                    paymentPreference ===
                      "after_service"
                      ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-5"
                      : "rounded-2xl border border-slate-200 bg-white p-5"
                  }
                >
                  <View className="flex-row items-center">
                    <View
                      className={
                        paymentPreference ===
                          "after_service"
                          ? "mr-4 h-5 w-5 items-center justify-center rounded-full bg-blue-600"
                          : "mr-4 h-5 w-5 rounded-full border-2 border-slate-300"
                      }
                    >
                      {paymentPreference ===
                        "after_service" && (
                          <Text className="text-xs font-bold text-white">
                            ✓
                          </Text>
                        )}
                    </View>

                    <View className="flex-1">
                      <Text className="font-bold text-slate-900">
                        Pay After Service
                      </Text>

                      <Text className="mt-1 text-sm leading-5 text-slate-500">
                        Create the booking now
                        and keep payment pending.
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>

          {/* RIGHT SUMMARY */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 350,
              flexGrow: 1,
            }}
          >
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Booking Summary
              </Text>

              {/* Provider */}
              <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Professional
                </Text>

                <Text className="mt-2 font-bold text-slate-900">
                  {service.providerName}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  ⭐{" "}
                  {
                    service.providerRating
                  }
                </Text>
              </View>

              {/* Service */}
              <View className="mt-3 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Service
                </Text>

                <Text className="mt-2 font-bold text-slate-900">
                  {service.serviceName}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  ⏱ {service.duration}
                </Text>
              </View>

              {/* Date */}
              <View className="mt-3 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Date & Time
                </Text>

                <Text className="mt-2 font-semibold text-slate-800">
                  {selectedDate
                    ? `📅 ${selectedDate.fullDate}`
                    : "Select date"}
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  {selectedTime
                    ? `🕐 ${selectedTime.label}`
                    : "Select time"}
                </Text>
              </View>

              {/* Address */}
              <View className="mt-3 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </Text>

                <Text className="mt-2 leading-6 text-slate-700">
                  {selectedAddress
                    ? `📍 ${selectedAddress.fullAddress}`
                    : "Select service address"}
                </Text>
              </View>

              {/* Price */}
              <View className="mt-6">
                <PriceRow
                  label="Service Price"
                  value={`₹${service.price}`}
                />

                <PriceRow
                  label="Service Charge"
                  value={`₹${serviceCharge}`}
                />

                {discount > 0 && (
                  <PriceRow
                    label="Discount"
                    value={`- ₹${discount}`}
                    positive
                  />
                )}

                <View className="my-3 h-px bg-slate-200" />

                <PriceRow
                  label="Total"
                  value={`₹${totalAmount}`}
                  bold
                />
              </View>

              <Pressable
                disabled={submitting}
                onPress={createBooking}
                className={
                  submitting
                    ? "mt-6 items-center rounded-xl bg-blue-400 px-5 py-4"
                    : "mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
                }
              >
                <Text className="font-bold text-white">
                  {submitting
                    ? "Creating Booking..."
                    : paymentPreference ===
                      "online"
                      ? `Continue to Payment • ₹${totalAmount}`
                      : `Confirm Booking • ₹${totalAmount}`}
                </Text>
              </Pressable>

              <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
                By confirming this booking,
                you agree to ServiGo's
                service terms and
                cancellation policy.
              </Text>
            </View>

            {/* Trust */}
            <View className="mt-4 rounded-3xl bg-slate-900 p-6">
              <Text className="text-lg font-bold text-white">
                ServiGo Protection
              </Text>

              <View className="mt-4 gap-3">
                <Text className="leading-6 text-slate-300">
                  ✓ Verified service
                  professionals
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Transparent pricing
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Booking tracking
                </Text>

                <Text className="leading-6 text-slate-300">
                  ✓ Customer support
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
                  Need help? Contact Support →
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}