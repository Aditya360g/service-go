
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type PaymentStatus = "pending" | "paid" | "refunded";
type TimelineStatus = "completed" | "current" | "pending" | "cancelled";

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
    address: "Vaishali Nagar, Jaipur, Rajasthan",
    amount: 599,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 648,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    problem:
      "Washing machine is not spinning properly and making noise.",
    notes: "Please call before arriving.",
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
    address: "Mansarovar, Jaipur, Rajasthan",
    amount: 499,
    serviceCharge: 49,
    discount: 50,
    totalAmount: 498,
    status: "pending",
    paymentStatus: "pending",
    problem: "Need complete cleaning for 2BHK home.",
    notes: "Please bring cleaning equipment.",
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
    address: "Malviya Nagar, Jaipur, Rajasthan",
    amount: 249,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 298,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    problem: "Bedroom fan and one switch board are not working.",
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
    address: "C Scheme, Jaipur, Rajasthan",
    amount: 299,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 348,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "Online Payment",
    problem: "Kitchen sink pipe is leaking.",
    notes: "",
    createdAt: "11 Sep 2026, 05:20 PM",
    confirmedAt: "11 Sep 2026, 05:25 PM",
    cancelledAt: "12 Sep 2026, 09:00 AM",
    cancellationReason: "Customer requested cancellation.",
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
    address: "Jagatpura, Jaipur, Rajasthan",
    amount: 399,
    serviceCharge: 49,
    discount: 0,
    totalAmount: 448,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "Online Payment",
    problem: "AC cooling is low.",
    notes: "Outdoor unit is installed on balcony.",
    createdAt: "16 Sep 2026, 01:30 PM",
    confirmedAt: "16 Sep 2026, 01:36 PM",
    startedAt: "17 Sep 2026, 01:05 PM",
    completedAt: "17 Sep 2026, 01:55 PM",
  },
];

const statusConfig: Record<
  BookingStatus,
  { label: string; background: string; color: string }
> = {
  pending: {
    label: "Pending",
    background: "#FFF7E6",
    color: "#A16207",
  },
  confirmed: {
    label: "Confirmed",
    background: "#E8F2FF",
    color: "#1D4ED8",
  },
  in_progress: {
    label: "In Progress",
    background: "#F2EAFE",
    color: "#6D28D9",
  },
  completed: {
    label: "Completed",
    background: "#E8F8EF",
    color: "#15803D",
  },
  cancelled: {
    label: "Cancelled",
    background: "#FEECEC",
    color: "#B91C1C",
  },
};

const paymentConfig: Record<
  PaymentStatus,
  { label: string; background: string; color: string }
> = {
  pending: {
    label: "Payment Pending",
    background: "#FFF7E6",
    color: "#A16207",
  },
  paid: {
    label: "Paid",
    background: "#E8F8EF",
    color: "#15803D",
  },
  refunded: {
    label: "Refunded",
    background: "#F1F5F9",
    color: "#475569",
  },
};

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E5EAF0",
          borderRadius: 22,
          padding: 22,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 19,
        fontWeight: "800",
        color: "#172B3A",
        marginBottom: 18,
        letterSpacing: -0.35,
      }}
    >
      {children}
    </Text>
  );
}

function SmallLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#8493A4",
      }}
    >
      {children}
    </Text>
  );
}

function ActionButton({
  title,
  onPress,
  variant = "primary",
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "soft" | "danger" | "outline" | "warning";
}) {
  const variants = {
    primary: {
      backgroundColor: "#16796F",
      borderColor: "#16796F",
      color: "#FFFFFF",
    },
    soft: {
      backgroundColor: "#E9F6F3",
      borderColor: "#D4ECE6",
      color: "#14685F",
    },
    danger: {
      backgroundColor: "#FFF1F0",
      borderColor: "#F8D6D3",
      color: "#B42318",
    },
    outline: {
      backgroundColor: "#FFFFFF",
      borderColor: "#E1E7ED",
      color: "#344456",
    },
    warning: {
      backgroundColor: "#E8A23A",
      borderColor: "#E8A23A",
      color: "#FFFFFF",
    },
  };

  const selected = variants[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 13,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: selected.borderColor,
        backgroundColor: selected.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.78 : 1,
      })}
    >
      <Text
        style={{
          color: selected.color,
          fontSize: 14,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function InfoBox({
  label,
  value,
  compact,
}: {
  label: string;
  value: string;
  compact: boolean;
}) {
  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: compact ? "100%" : 180,
        minWidth: 0,
        padding: 16,
        backgroundColor: "#F6F9FB",
        borderRadius: 15,
      }}
    >
      <SmallLabel>{label}</SmallLabel>
      <Text
        style={{
          marginTop: 8,
          color: "#263A4B",
          fontSize: 14,
          fontWeight: "700",
          lineHeight: 21,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={{
            color: star <= Math.round(rating) ? "#E8A23A" : "#D5DEE6",
            fontSize: 17,
          }}
        >
          ★
        </Text>
      ))}
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 9,
      }}
    >
      <Text
        style={{
          flex: 1,
          color: bold ? "#172B3A" : "#718096",
          fontSize: bold ? 15 : 14,
          fontWeight: bold ? "800" : "500",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: "#172B3A",
          fontSize: bold ? 19 : 14,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function getTimeline(booking: Booking): TimelineItem[] {
  if (booking.status === "cancelled") {
    return [
      {
        title: "Booking Created",
        description: "Your service booking was created.",
        time: booking.createdAt,
        status: "completed",
      },
      {
        title: "Booking Confirmed",
        description: "The provider accepted your booking.",
        time: booking.confirmedAt,
        status: booking.confirmedAt ? "completed" : "pending",
      },
      {
        title: "Booking Cancelled",
        description:
          booking.cancellationReason ?? "The booking was cancelled.",
        time: booking.cancelledAt,
        status: "cancelled",
      },
    ];
  }

  return [
    {
      title: "Booking Created",
      description: "Your service request was created successfully.",
      time: booking.createdAt,
      status: "completed",
    },
    {
      title: "Provider Confirmation",
      description: booking.confirmedAt
        ? "The provider accepted your booking."
        : "Waiting for provider confirmation.",
      time: booking.confirmedAt,
      status: booking.status === "pending" ? "current" : "completed",
    },
    {
      title: "Service Started",
      description: booking.startedAt
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
      description: booking.completedAt
        ? "The service was completed successfully."
        : "Completion will appear here after the service.",
      time: booking.completedAt,
      status: booking.status === "completed" ? "completed" : "pending",
    },
  ];
}

function Timeline({
  items,
}: {
  items: TimelineItem[];
}) {
  const colors: Record<TimelineStatus, string> = {
    completed: "#16835E",
    current: "#16796F",
    pending: "#A0ACB8",
    cancelled: "#C53C3C",
  };

  return (
    <View>
      {items.map((item, index) => {
        const color = colors[item.status];
        const last = index === items.length - 1;

        return (
          <View
            key={`${item.title}-${index}`}
            style={{ flexDirection: "row", gap: 13 }}
          >
            <View style={{ alignItems: "center", width: 30 }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: `${color}18`,
                  borderWidth: 1,
                  borderColor: `${color}35`,
                }}
              >
                <Text style={{ color, fontWeight: "900", fontSize: 15 }}>
                  {item.status === "completed"
                    ? "✓"
                    : item.status === "cancelled"
                      ? "×"
                      : "•"}
                </Text>
              </View>

              {!last && (
                <View
                  style={{
                    flex: 1,
                    width: 1,
                    minHeight: 42,
                    backgroundColor: "#E3E9EF",
                  }}
                />
              )}
            </View>

            <View style={{ flex: 1, paddingBottom: last ? 0 : 22 }}>
              <Text
                style={{
                  color: "#263A4B",
                  fontSize: 14,
                  fontWeight: "800",
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  color: "#718096",
                  fontSize: 13,
                  lineHeight: 20,
                }}
              >
                {item.description}
              </Text>
              {!!item.time && (
                <Text
                  style={{
                    marginTop: 5,
                    color: "#9AA6B2",
                    fontSize: 11,
                    lineHeight: 16,
                  }}
                >
                  {item.time}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string | string[];
  }>();

  const { width } = useWindowDimensions();

  const compact = width < 480;
  const desktop = width >= 1000;
  const horizontalPadding =
    width < 380 ? 14 : width < 700 ? 18 : width < 1100 ? 26 : 34;

  const bookingIdParam = Array.isArray(params.bookingId)
    ? params.bookingId[0]
    : params.bookingId;

  const bookingId = Number(bookingIdParam);

  const [cancelledLocally, setCancelledLocally] = useState(false);

  const booking = useMemo(
    () => bookings.find((item) => item.id === bookingId),
    [bookingId]
  );

  if (!booking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F4F7F9",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Card style={{ width: "100%", maxWidth: 500, padding: 28 }}>
          <Text style={{ textAlign: "center", fontSize: 44 }}>📋</Text>
          <Text
            style={{
              marginTop: 14,
              textAlign: "center",
              fontSize: 24,
              fontWeight: "900",
              color: "#172B3A",
            }}
          >
            Booking not found
          </Text>
          <Text
            style={{
              marginTop: 9,
              textAlign: "center",
              lineHeight: 23,
              color: "#718096",
            }}
          >
            We couldn't find this booking. It may have been removed or the
            booking ID is incorrect.
          </Text>
          <View style={{ marginTop: 22 }}>
            <ActionButton
              title="View My Bookings"
              onPress={() => router.replace("/bookings")}
            />
          </View>
        </Card>
      </View>
    );
  }

  const effectiveStatus: BookingStatus = cancelledLocally
    ? "cancelled"
    : booking.status;

  const bookingBadge = statusConfig[effectiveStatus];
  const paymentBadge = paymentConfig[booking.paymentStatus];

  const effectiveBooking: Booking = {
    ...booking,
    status: effectiveStatus,
    cancellationReason: cancelledLocally
      ? "Cancelled by customer."
      : booking.cancellationReason,
    cancelledAt: cancelledLocally ? "Just now" : booking.cancelledAt,
  };

  const timeline = getTimeline(effectiveBooking);

  const canCancel =
    effectiveStatus === "pending" || effectiveStatus === "confirmed";

  const openProvider = () => {
    router.push({
      pathname: "/providers/[providerId]",
      params: { providerId: String(booking.providerId) },
    });
  };

  const openPayment = () => {
    router.push({
      pathname: "/payment/[bookingId]",
      params: { bookingId: String(booking.id) },
    });
  };

  const openReview = () => {
    router.push({
      pathname: "/review/[bookingId]",
      params: { bookingId: String(booking.id) },
    });
  };

  const bookAgain = () => {
    router.push({
      pathname: "/booking/[providerServiceId]",
      params: {
        providerServiceId: String(booking.providerServiceId),
        providerId: String(booking.providerId),
      },
    });
  };

  const cancelBooking = () => {
    const performCancel = () => {
      setCancelledLocally(true);

      if (Platform.OS === "web") {
        window.alert("Booking cancelled successfully.");
      }
    };

    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm("Are you sure you want to cancel this booking?")
      ) {
        performCancel();
      }
      return;
    }

    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "Keep Booking", style: "cancel" },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: performCancel,
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F7F9" }}>
      {/* No page-level navbar: your app's global navbar stays separate. */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: compact ? 20 : 30,
          paddingBottom: 44,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 1500,
            alignSelf: "center",
          }}
        >
          {/* Heading and status */}
          <View
            style={{
              flexDirection: compact ? "column" : "row",
              alignItems: compact ? "stretch" : "flex-start",
              justifyContent: "space-between",
              gap: 18,
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  color: "#16796F",
                  fontSize: 12,
                  fontWeight: "900",
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                BOOKING #{booking.id}
              </Text>

              <Text
                style={{
                  marginTop: 9,
                  fontSize: compact ? 25 : width < 800 ? 29 : 34,
                  lineHeight: compact ? 32 : 42,
                  fontWeight: "900",
                  letterSpacing: -0.8,
                  color: "#172B3A",
                }}
              >
                {booking.serviceName}
              </Text>

              <Text
                style={{
                  marginTop: 8,
                  maxWidth: 720,
                  fontSize: 14,
                  lineHeight: 23,
                  color: "#718096",
                }}
              >
                {booking.serviceDescription}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
              }}
            >
              <View
                style={{
                  borderRadius: 100,
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  backgroundColor: bookingBadge.background,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: bookingBadge.color,
                  }}
                >
                  {bookingBadge.label}
                </Text>
              </View>

              <View
                style={{
                  borderRadius: 100,
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  backgroundColor: paymentBadge.background,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "800",
                    color: paymentBadge.color,
                  }}
                >
                  {paymentBadge.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Schedule */}
          <Card style={{ marginBottom: 22 }}>
            <SectionTitle>Service Schedule</SectionTitle>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <InfoBox
                label="Date"
                value={`📅 ${booking.date}`}
                compact={compact}
              />
              <InfoBox
                label="Time"
                value={`🕐 ${booking.time}`}
                compact={compact}
              />
              <InfoBox
                label="Booking ID"
                value={`#${booking.id}`}
                compact={compact}
              />
              <InfoBox
                label="Booked On"
                value={booking.createdAt}
                compact={compact}
              />
            </View>
          </Card>

          {/* Main content + sidebar */}
          <View
            style={{
              flexDirection: desktop ? "row" : "column",
              alignItems: "stretch",
              gap: 22,
            }}
          >
            {/* Left/main column */}
            <View style={{ flex: 1.65, minWidth: 0, gap: 22 }}>
              {/* Provider */}
              <Card>
                <SectionTitle>Service Professional</SectionTitle>

                <View
                  style={{
                    flexDirection: compact ? "column" : "row",
                    alignItems: compact ? "flex-start" : "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 22,
                      backgroundColor: "#E3F3EF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 21,
                        fontWeight: "900",
                        color: "#16796F",
                      }}
                    >
                      {booking.providerInitials}
                    </Text>
                  </View>

                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "900",
                        color: "#172B3A",
                      }}
                    >
                      {booking.providerName}
                    </Text>

                    <View
                      style={{
                        marginTop: 7,
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 7,
                      }}
                    >
                      <RatingStars rating={booking.providerRating} />
                      <Text
                        style={{
                          color: "#344456",
                          fontWeight: "800",
                          fontSize: 13,
                        }}
                      >
                        {booking.providerRating.toFixed(1)}
                      </Text>
                    </View>

                    <Text
                      style={{
                        marginTop: 7,
                        color: "#718096",
                        fontSize: 13,
                      }}
                    >
                      {booking.providerExperience} experience
                    </Text>
                  </View>

                  <View style={compact ? { width: "100%" } : undefined}>
                    <ActionButton
                      title="View Profile"
                      variant="soft"
                      onPress={openProvider}
                    />
                  </View>
                </View>
              </Card>

              {/* Address */}
              <Card>
                <SectionTitle>Service Address</SectionTitle>

                <View
                  style={{
                    backgroundColor: "#F6F9FB",
                    borderRadius: 16,
                    padding: 17,
                  }}
                >
                  <View
                    style={{
                      alignSelf: "flex-start",
                      paddingHorizontal: 11,
                      paddingVertical: 6,
                      borderRadius: 100,
                      backgroundColor: "#E0F2EE",
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#16796F",
                        fontSize: 11,
                        fontWeight: "900",
                      }}
                    >
                      {booking.addressLabel}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "#344456",
                      fontSize: 14,
                      lineHeight: 24,
                    }}
                  >
                    📍 {booking.address}
                  </Text>
                </View>
              </Card>

              {/* Service requirement */}
              <Card>
                <SectionTitle>Service Requirement</SectionTitle>

                <SmallLabel>Problem / Requirement</SmallLabel>
                <Text
                  style={{
                    marginTop: 9,
                    color: "#435466",
                    fontSize: 14,
                    lineHeight: 24,
                  }}
                >
                  {booking.problem || "No problem description provided."}
                </Text>

                {!!booking.notes && (
                  <View
                    style={{
                      marginTop: 17,
                      padding: 16,
                      borderRadius: 15,
                      backgroundColor: "#FFF8E9",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "900",
                        letterSpacing: 0.8,
                        color: "#A16207",
                        textTransform: "uppercase",
                      }}
                    >
                      Additional Note
                    </Text>
                    <Text
                      style={{
                        marginTop: 7,
                        color: "#7C5416",
                        fontSize: 13,
                        lineHeight: 22,
                      }}
                    >
                      {booking.notes}
                    </Text>
                  </View>
                )}
              </Card>

              {/* Timeline */}
              <Card>
                <SectionTitle>Booking Timeline</SectionTitle>
                <Timeline items={timeline} />
              </Card>
            </View>

            {/* Right/sidebar column */}
            <View
              style={{
                width: desktop ? 350 : "100%",
                maxWidth: desktop ? 350 : undefined,
                flexShrink: 0,
                gap: 22,
              }}
            >
              {/* Price summary */}
              <Card>
                <SectionTitle>Price Summary</SectionTitle>

                <PriceRow
                  label="Service Price"
                  value={`₹${booking.amount}`}
                />
                <PriceRow
                  label="Service Charge"
                  value={`₹${booking.serviceCharge}`}
                />

                {booking.discount > 0 && (
                  <PriceRow
                    label="Discount"
                    value={`− ₹${booking.discount}`}
                  />
                )}

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#E7ECF0",
                    marginVertical: 9,
                  }}
                />

                <PriceRow
                  label="Total"
                  value={`₹${booking.totalAmount}`}
                  bold
                />

                <View
                  style={{
                    marginTop: 13,
                    padding: 15,
                    borderRadius: 14,
                    backgroundColor: "#F6F9FB",
                  }}
                >
                  <SmallLabel>Payment Status</SmallLabel>
                  <Text
                    style={{
                      marginTop: 7,
                      color: paymentBadge.color,
                      fontSize: 14,
                      fontWeight: "900",
                    }}
                  >
                    {paymentBadge.label}
                  </Text>

                  {!!booking.paymentMethod && (
                    <Text
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        color: "#718096",
                      }}
                    >
                      {booking.paymentMethod}
                    </Text>
                  )}
                </View>

                {booking.paymentStatus === "pending" &&
                  effectiveStatus !== "cancelled" && (
                    <View style={{ marginTop: 16 }}>
                      <ActionButton
                        title={`Pay ₹${booking.totalAmount}`}
                        onPress={openPayment}
                      />
                    </View>
                  )}
              </Card>

              {/* Booking actions */}
              <Card>
                <SectionTitle>Booking Actions</SectionTitle>

                <View style={{ gap: 11 }}>
                  {effectiveStatus === "completed" && (
                    <>
                      <ActionButton
                        title="★ Write a Review"
                        variant="warning"
                        onPress={openReview}
                      />
                      <ActionButton
                        title="Book Again"
                        variant="soft"
                        onPress={bookAgain}
                      />
                    </>
                  )}

                  {effectiveStatus === "cancelled" && (
                    <ActionButton
                      title="Book Again"
                      onPress={bookAgain}
                    />
                  )}

                  {canCancel && (
                    <ActionButton
                      title="Cancel Booking"
                      variant="danger"
                      onPress={cancelBooking}
                    />
                  )}

                  <ActionButton
                    title="Need Help?"
                    variant="outline"
                    onPress={() => router.push("/support")}
                  />

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push("/bookings")}
                    style={({ pressed }) => ({
                      paddingVertical: 12,
                      alignItems: "center",
                      opacity: pressed ? 0.65 : 1,
                    })}
                  >
                    <Text
                      style={{
                        color: "#16796F",
                        fontSize: 13,
                        fontWeight: "900",
                      }}
                    >
                      View All Bookings →
                    </Text>
                  </Pressable>
                </View>
              </Card>

              {/* Support note */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#D7EBE5",
                  backgroundColor: "#EAF6F2",
                  borderRadius: 20,
                  padding: 19,
                }}
              >
                <Text style={{ fontSize: 21 }}>💬</Text>
                <Text
                  style={{
                    marginTop: 9,
                    fontSize: 15,
                    fontWeight: "900",
                    color: "#17433D",
                  }}
                >
                  Need assistance?
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    color: "#52756F",
                    fontSize: 13,
                    lineHeight: 21,
                  }}
                >
                  Have a question about your service? Visit support for help
                  with your booking.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push("/support")}
                  style={({ pressed }) => ({
                    marginTop: 13,
                    opacity: pressed ? 0.65 : 1,
                  })}
                >
                  <Text
                    style={{
                      color: "#16796F",
                      fontSize: 13,
                      fontWeight: "900",
                    }}
                  >
                    Contact Support →
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
