
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

type PaymentPreference = "online" | "after_service";

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
    description: "Interior and exterior home painting service.",
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
    fullAddress: "Vaishali Nagar, Jaipur, Rajasthan",
  },
  {
    id: 2,
    label: "Office",
    fullAddress: "C Scheme, Jaipur, Rajasthan",
  },
  {
    id: 3,
    label: "Other",
    fullAddress: "Mansarovar, Jaipur, Rajasthan",
  },
];

const timeSlots: TimeSlot[] = [
  { id: "09", label: "09:00 AM - 10:00 AM", available: true },
  { id: "10", label: "10:00 AM - 11:00 AM", available: true },
  { id: "11", label: "11:00 AM - 12:00 PM", available: false },
  { id: "12", label: "12:00 PM - 01:00 PM", available: true },
  { id: "14", label: "02:00 PM - 03:00 PM", available: true },
  { id: "15", label: "03:00 PM - 04:00 PM", available: true },
  { id: "16", label: "04:00 PM - 05:00 PM", available: false },
  { id: "17", label: "05:00 PM - 06:00 PM", available: true },
];

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function createUpcomingDates() {
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date();
    current.setDate(current.getDate() + index + 1);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const dayNumber = String(current.getDate()).padStart(2, "0");

    return {
      id: `${year}-${month}-${dayNumber}`,
      day: current.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      date: current.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      fullDate: current.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
  });
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
      <Text className="text-xl font-bold text-slate-900">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 leading-6 text-slate-500">
          {subtitle}
        </Text>
      ) : null}
      <View className="mt-5">{children}</View>
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
            ? "flex-1 text-base font-bold text-slate-900"
            : "flex-1 text-sm text-slate-500"
        }
      >
        {label}
      </Text>
      <Text
        className={
          positive
            ? "ml-3 font-semibold text-green-600"
            : bold
              ? "ml-3 text-xl font-bold text-slate-900"
              : "ml-3 font-semibold text-slate-700"
        }
      >
        {value}
      </Text>
    </View>
  );
}

export default function CreateBookingScreen() {
  const params = useLocalSearchParams<{
    providerServiceId?: string | string[];
    providerId?: string | string[];
  }>();

  const { width } = useWindowDimensions();
  const isWide = width >= 1000;
  const horizontalPadding = width >= 1200 ? 32 : width >= 700 ? 24 : 16;

  const providerServiceId = Number(getParam(params.providerServiceId));
  const providerIdFromUrl = Number(getParam(params.providerId));

  const service = useMemo(() => {
    const exactMatch = providerServices.find(
      (item) => item.id === providerServiceId
    );

    if (exactMatch) return exactMatch;

    if (providerIdFromUrl && !Number.isNaN(providerIdFromUrl)) {
      return providerServices.find(
        (item) => item.providerId === providerIdFromUrl
      );
    }

    return undefined;
  }, [providerIdFromUrl, providerServiceId]);

  const dates = useMemo(() => createUpcomingDates(), []);

  const [selectedDateId, setSelectedDateId] = useState("");
  const [selectedTimeId, setSelectedTimeId] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);
  const [problem, setProblem] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentPreference, setPaymentPreference] =
    useState<PaymentPreference>("online");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedDate = dates.find((item) => item.id === selectedDateId);
  const selectedTime = timeSlots.find((item) => item.id === selectedTimeId);
  const selectedAddress = savedAddresses.find(
    (item) => item.id === selectedAddressId
  );

  if (!service) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F8FAFC"
        />
        <View className="flex-1 items-center justify-center bg-slate-50 p-5">
          <View className="w-full rounded-3xl border border-slate-200 bg-white p-8" style={{ maxWidth: 480 }}>
            <Text className="text-center text-5xl">🛠️</Text>
            <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
              Service not found
            </Text>
            <Text className="mt-2 text-center leading-6 text-slate-500">
              The selected provider service could not be found.
            </Text>
            <Pressable
              onPress={() => router.replace("/providers")}
              className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
            >
              <Text className="font-bold text-white">Browse Providers</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const serviceCharge = 49;
  const discount = service.price >= 499 ? 50 : 0;
  const totalAmount = service.price + serviceCharge - discount;

  const createBooking = () => {
    if (!selectedDate) {
      setError("Please select a service date.");
      return;
    }
    if (!selectedTime || !selectedTime.available) {
      setError("Please select an available time slot.");
      return;
    }
    if (!selectedAddress) {
      setError("Please select a service address.");
      return;
    }
    if (problem.trim().length < 5) {
      setError("Please describe your service requirement in at least 5 characters.");
      return;
    }

    setError("");
    setSubmitting(true);

    /*
      Demo flow only. Connect your real booking API here
      before using this in production.
    */
    const bookingId = String(Math.floor(Date.now() / 1000));

    const successParams = {
      bookingId,
      providerId: String(service.providerId),
      providerServiceId: String(service.id),
      providerName: service.providerName,
      serviceName: service.serviceName,
      date: selectedDate.fullDate,
      time: selectedTime.label,
      address: selectedAddress.fullAddress,
      problem: problem.trim(),
      notes: notes.trim(),
      servicePrice: String(service.price),
      serviceCharge: String(serviceCharge),
      discount: String(discount),
      totalAmount: String(totalAmount),
      paymentStatus: "pending",
    };

    setSubmitting(false);

    if (paymentPreference === "online") {
      router.push({
        pathname: "/payment/[bookingId]",
        params: {
          ...successParams,
          returnTo: "booking-success",
        },
      });
      return;
    }

    router.replace({
      pathname: "/booking-success/[bookingId]",
      params: successParams,
    });
  };

  const cardStyle = isWide
    ? { flexBasis: 0, flexGrow: 1, minWidth: 0 }
    : { width: "100%" as const };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFC"
      />

      {/* Header/navbar removed */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: width < 700 ? 16 : 28,
          paddingBottom: 40,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: "100%", maxWidth: 1440, alignSelf: "center" }}>
          <View className="mb-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-blue-600">
              BOOK YOUR SERVICE
            </Text>
            <Text className="mt-2 text-3xl font-bold text-slate-900">
              Complete your booking
            </Text>
            <Text className="mt-2 max-w-2xl leading-6 text-slate-500">
              Select your preferred date, time and address to schedule your
              ServiGo professional.
            </Text>
          </View>

          {error ? (
            <View className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <Text className="font-semibold text-red-700">{error}</Text>
            </View>
          ) : null}

          <View
            style={{
              flexDirection: isWide ? "row" : "column",
              alignItems: "flex-start",
              gap: 20,
              width: "100%",
            }}
          >
            {/* MAIN BOOKING FORM */}
            <View style={[cardStyle, isWide && { flexGrow: 1.9 }]}>
              <Section title="Selected Service">
                <View
                  style={{
                    flexDirection: width < 520 ? "column" : "row",
                    alignItems: width < 520 ? "flex-start" : "center",
                    gap: 16,
                  }}
                >
                  <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                    <Text className="text-xl font-bold text-blue-700">
                      {service.providerInitials}
                    </Text>
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text className="text-xl font-bold text-slate-900">
                      {service.serviceName}
                    </Text>
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "/providers/[providerId]",
                          params: { providerId: String(service.providerId) },
                        })
                      }
                    >
                      <Text className="mt-1 font-semibold text-blue-600">
                        {service.providerName}
                      </Text>
                    </Pressable>
                    <Text className="mt-2 leading-6 text-slate-500">
                      {service.description}
                    </Text>
                    <View className="mt-3 flex-row flex-wrap gap-4">
                      <Text className="text-sm font-semibold text-slate-600">
                        ⭐ {service.providerRating}
                      </Text>
                      <Text className="text-sm font-semibold text-slate-600">
                        ⏱ {service.duration}
                      </Text>
                    </View>
                  </View>

                  <View className="rounded-2xl bg-slate-50 px-4 py-3">
                    <Text className="text-xs uppercase tracking-wider text-slate-400">
                      Price
                    </Text>
                    <Text className="mt-1 text-2xl font-bold text-slate-900">
                      ₹{service.price}
                    </Text>
                  </View>
                </View>
              </Section>

              <Section
                title="Choose Date"
                subtitle="Select your preferred service date."
              >
                <View className="flex-row flex-wrap gap-2">
                  {dates.map((date) => {
                    const selected = selectedDateId === date.id;
                    return (
                      <Pressable
                        key={date.id}
                        onPress={() => {
                          setSelectedDateId(date.id);
                          setError("");
                        }}
                        style={{ minWidth: 82 }}
                        className={
                          selected
                            ? "items-center rounded-2xl border-2 border-blue-600 bg-blue-50 px-3 py-3"
                            : "items-center rounded-2xl border border-slate-200 bg-white px-3 py-3"
                        }
                      >
                        <Text className={selected ? "text-sm font-semibold text-blue-600" : "text-sm font-semibold text-slate-500"}>
                          {date.day}
                        </Text>
                        <Text className={selected ? "mt-1 font-bold text-blue-700" : "mt-1 font-bold text-slate-900"}>
                          {date.date}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Section>

              <Section
                title="Choose Time"
                subtitle="Unavailable slots cannot be selected."
              >
                <View className="flex-row flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const selected = selectedTimeId === slot.id;
                    return (
                      <Pressable
                        key={slot.id}
                        disabled={!slot.available}
                        onPress={() => {
                          setSelectedTimeId(slot.id);
                          setError("");
                        }}
                        className={
                          !slot.available
                            ? "rounded-xl border border-slate-200 bg-slate-100 px-3 py-3 opacity-50"
                            : selected
                              ? "rounded-xl border-2 border-blue-600 bg-blue-50 px-3 py-3"
                              : "rounded-xl border border-slate-200 bg-white px-3 py-3"
                        }
                      >
                        <Text className={!slot.available ? "text-xs font-semibold text-slate-400" : selected ? "text-xs font-bold text-blue-700" : "text-xs font-semibold text-slate-700"}>
                          {slot.label}
                        </Text>
                        {!slot.available ? (
                          <Text className="mt-1 text-xs text-slate-400">
                            Unavailable
                          </Text>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </Section>

              <Section
                title="Service Address"
                subtitle="Where should the professional visit?"
              >
                <View className="gap-3">
                  {savedAddresses.map((address) => {
                    const selected = selectedAddressId === address.id;
                    return (
                      <Pressable
                        key={address.id}
                        onPress={() => {
                          setSelectedAddressId(address.id);
                          setError("");
                        }}
                        className={
                          selected
                            ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-4"
                            : "rounded-2xl border border-slate-200 bg-white p-4"
                        }
                      >
                        <Text className="font-bold text-slate-900">
                          {selected ? "◉ " : "○ "}{address.label}
                        </Text>
                        <Text className="mt-1 leading-6 text-slate-600">
                          {address.fullAddress}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View className="mt-4 flex-row flex-wrap gap-5">
                  <Pressable onPress={() => router.push("/addresses/new")}>
                    <Text className="font-semibold text-blue-600">
                      + Add Address
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => router.push("/addresses")}>
                    <Text className="font-semibold text-blue-600">
                      Manage Addresses →
                    </Text>
                  </Pressable>
                </View>
              </Section>

              <Section
                title="Describe Your Requirement"
                subtitle="Tell the provider what work is required."
              >
                <TextInput
                  value={problem}
                  onChangeText={(value) => {
                    setProblem(value);
                    setError("");
                  }}
                  placeholder="Example: The washing machine is not spinning..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  style={styles.problemInput}
                />
                <Text className="mt-2 text-right text-xs text-slate-400">
                  {problem.length}/500
                </Text>
              </Section>

              <Section
                title="Additional Note"
                subtitle="Optional instructions for the professional."
              >
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Example: Please call before arriving."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                  maxLength={250}
                  style={[styles.problemInput, { minHeight: 90 }]}
                />
                <Text className="mt-2 text-right text-xs text-slate-400">
                  {notes.length}/250
                </Text>
              </Section>

              <Section
                title="Payment Preference"
                subtitle="Choose how you want to pay."
              >
                {(
                  [
                    {
                      id: "online",
                      title: "Pay Online",
                      detail: "Continue to the payment screen.",
                    },
                    {
                      id: "after_service",
                      title: "Pay After Service",
                      detail: "Keep payment pending for now.",
                    },
                  ] as const
                ).map((option) => {
                  const selected = paymentPreference === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => setPaymentPreference(option.id)}
                      className={
                        selected
                          ? "mb-3 rounded-2xl border-2 border-blue-600 bg-blue-50 p-4"
                          : "mb-3 rounded-2xl border border-slate-200 bg-white p-4"
                      }
                    >
                      <Text className="font-bold text-slate-900">
                        {selected ? "◉ " : "○ "}{option.title}
                      </Text>
                      <Text className="mt-1 leading-5 text-slate-500">
                        {option.detail}
                      </Text>
                    </Pressable>
                  );
                })}
              </Section>
            </View>

            {/* BOOKING SUMMARY */}
            <View style={[cardStyle, isWide && { flexGrow: 1, flexBasis: 300 }]}>
              <View className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
                <Text className="text-xl font-bold text-slate-900">
                  Booking Summary
                </Text>

                <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Professional
                  </Text>
                  <Text className="mt-2 font-bold text-slate-900">
                    {service.providerName}
                  </Text>
                  <Text className="mt-1 text-sm text-slate-500">
                    ⭐ {service.providerRating}
                  </Text>
                </View>

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

                <View className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Date & Time
                  </Text>
                  <Text className="mt-2 leading-6 text-slate-800">
                    {selectedDate ? selectedDate.fullDate : "Select date"}
                  </Text>
                  <Text className="mt-1 leading-6 text-slate-500">
                    {selectedTime ? selectedTime.label : "Select time"}
                  </Text>
                </View>

                <View className="mt-3 rounded-2xl bg-slate-50 p-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Address
                  </Text>
                  <Text className="mt-2 leading-6 text-slate-700">
                    {selectedAddress
                      ? selectedAddress.fullAddress
                      : "Select service address"}
                  </Text>
                </View>

                <View className="mt-5">
                  <PriceRow label="Service Price" value={`₹${service.price}`} />
                  <PriceRow label="Service Charge" value={`₹${serviceCharge}`} />
                  {discount > 0 ? (
                    <PriceRow
                      label="Discount"
                      value={`− ₹${discount}`}
                      positive
                    />
                  ) : null}
                  <View className="my-3 h-px bg-slate-200" />
                  <PriceRow label="Total" value={`₹${totalAmount}`} bold />
                </View>

                <Pressable
                  disabled={submitting}
                  onPress={createBooking}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && !submitting ? { opacity: 0.85 } : null,
                    submitting ? { opacity: 0.6 } : null,
                  ]}
                >
                  <Text className="text-center font-bold text-white">
                    {submitting
                      ? "Creating Booking..."
                      : paymentPreference === "online"
                        ? `Continue to Payment · ₹${totalAmount}`
                        : `Confirm Booking · ₹${totalAmount}`}
                  </Text>
                </Pressable>

                <Text className="mt-4 text-center text-xs leading-5 text-slate-400">
                  By confirming, you agree to ServiGo's service terms and
                  cancellation policy.
                </Text>
              </View>

              <View className="mt-4 rounded-3xl bg-slate-900 p-5">
                <Text className="text-lg font-bold text-white">
                  ServiGo Protection
                </Text>
                <View className="mt-4 gap-3">
                  <Text className="leading-6 text-slate-300">
                    ✓ Verified service professionals
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
                  onPress={() => router.push("/support")}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  problemInput: {
    width: "100%",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
    fontSize: 15,
    lineHeight: 23,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as object)
      : {}),
  },
  primaryButton: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#2563EB",
  },
});
