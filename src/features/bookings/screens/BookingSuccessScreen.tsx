
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type PaymentStatus = "pending" | "paid" | "refunded";

type BookingData = {
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

const C = {
  page: "#F4F7FA",
  white: "#FFFFFF",
  text: "#172B3A",
  muted: "#738394",
  border: "#E3EAF0",
  primary: "#16796F",
  primaryDark: "#125E57",
  greenLight: "#E6F4F1",
  green: "#16804A",
  greenBg: "#E6F6EC",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
  slate: "#172B3A",
};

const demoBookings: BookingData[] = [
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
    problem: "Washing machine is not spinning properly and making noise.",
    notes: "Please call before arriving.",
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
    problem: "Need complete cleaning for 2BHK home.",
    notes: "Please bring cleaning equipment.",
    servicePrice: 499,
    serviceCharge: 49,
    discount: 50,
    totalAmount: 498,
    bookingStatus: "pending",
    paymentStatus: "pending",
    createdAt: "18 Sep 2026, 11:30 AM",
  },
];

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function formatBookingStatus(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status];
}

function formatPaymentStatus(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    pending: "Payment Pending",
    paid: "Paid",
    refunded: "Refunded",
  };
  return labels[status];
}

function statusColors(status: BookingStatus) {
  const colors: Record<BookingStatus, { bg: string; text: string }> = {
    pending: { bg: "#FFF3D8", text: "#95610C" },
    confirmed: { bg: "#E8F2FF", text: "#245FB5" },
    in_progress: { bg: "#F0EAFE", text: "#7047B8" },
    completed: { bg: "#E6F6EC", text: "#237847" },
    cancelled: { bg: "#FDECEC", text: "#B63838" },
  };
  return colors[status];
}

function paymentColors(status: PaymentStatus) {
  const colors: Record<PaymentStatus, { bg: string; text: string }> = {
    pending: { bg: "#FFF3D8", text: "#95610C" },
    paid: { bg: "#E6F6EC", text: "#237847" },
    refunded: { bg: "#EEF1F4", text: "#5D6B78" },
  };
  return colors[status];
}

function ActionButton({
  label,
  onPress,
  variant = "primary",
  fullWidth = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primaryButton,
        variant === "secondary" && styles.secondaryButton,
        variant === "outline" && styles.outlineButton,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" && styles.primaryButtonText,
          variant === "secondary" && styles.secondaryButtonText,
          variant === "outline" && styles.outlineButtonText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
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
    <View style={styles.infoCard}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, bold && styles.boldPriceLabel]}>
        {label}
      </Text>
      <Text
        style={[
          styles.priceValue,
          bold && styles.boldPriceValue,
          positive && styles.discountValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function BookingSuccessScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1000;
  const isWide = width >= 680;
  const horizontalPadding = width < 380 ? 12 : width < 700 ? 16 : 28;

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

  const bookingId = Number(getParam(params.bookingId));

  const booking = useMemo<BookingData | undefined>(() => {
    const existing = demoBookings.find((item) => item.id === bookingId);
    if (existing) return existing;

    if (!bookingId || Number.isNaN(bookingId)) return undefined;

    const servicePrice = Number(getParam(params.servicePrice)) || 0;
    const serviceCharge = Number(getParam(params.serviceCharge)) || 0;
    const discount = Number(getParam(params.discount)) || 0;
    const suppliedTotal = Number(getParam(params.totalAmount));
    const totalAmount =
      Number.isFinite(suppliedTotal) && suppliedTotal > 0
        ? suppliedTotal
        : Math.max(servicePrice + serviceCharge - discount, 0);

    const rawPayment = getParam(params.paymentStatus);
    const paymentStatus: PaymentStatus =
      rawPayment === "paid"
        ? "paid"
        : rawPayment === "refunded"
          ? "refunded"
          : "pending";

    const providerName = getParam(params.providerName) || "ServiGo Expert";
    const providerInitials =
      providerName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase() || "SG";

    return {
      id: bookingId,
      serviceName: getParam(params.serviceName) || "Home Service",
      providerId: Number(getParam(params.providerId)) || 1,
      providerServiceId: Number(getParam(params.providerServiceId)) || 1,
      providerName,
      providerInitials,
      date: getParam(params.date) || "Scheduled date",
      time: getParam(params.time) || "Scheduled time",
      addressLabel: "Home",
      address: getParam(params.address) || "Service address",
      problem: getParam(params.problem),
      notes: getParam(params.notes),
      servicePrice,
      serviceCharge,
      discount,
      totalAmount,
      bookingStatus: "pending",
      paymentStatus,
      paymentMethod: paymentStatus === "paid" ? "Online Payment" : undefined,
      createdAt: "Just now",
    };
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

  const goHome = () => router.replace("/");
  const goBookings = () => router.replace("/bookings");
  const goServices = () => router.push("/services");
  const goSupport = () => router.push("/support");

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={C.page} />
        <View style={styles.notFoundWrap}>
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundIcon}>📋</Text>
            <Text style={styles.notFoundTitle}>Booking not found</Text>
            <Text style={styles.bodyText}>
              We couldn't find the booking confirmation details.
            </Text>
            <ActionButton label="View My Bookings" onPress={goBookings} fullWidth />
            <ActionButton label="Go to Home" onPress={goHome} variant="outline" fullWidth />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const bookingState = statusColors(booking.bookingStatus);
  const paymentState = paymentColors(booking.paymentStatus);

  const openBookingDetails = () =>
    router.replace({
      pathname: "/bookings/[bookingId]",
      params: { bookingId: String(booking.id) },
    });

  const openPayment = () =>
    router.push({
      pathname: "/payment/[bookingId]",
      params: { bookingId: String(booking.id) },
    });

  const openProvider = () =>
    router.push({
      pathname: "/providers/[providerId]",
      params: { providerId: String(booking.providerId) },
    });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.page} />

      {/* No navbar: content starts directly with the booking confirmation. */}
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.page, { maxWidth: 1440 }]}>
          {/* Success banner */}
          <View style={styles.hero}>
            <View style={styles.successCircle}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.heroTitle}>Booking Successful!</Text>
            <Text style={styles.heroDescription}>
              Your service booking has been created successfully. Track its
              progress anytime from My Bookings.
            </Text>
            <View style={styles.bookingNumber}>
              <Text style={styles.bookingNumberText}>Booking #{booking.id}</Text>
            </View>
          </View>

          {/* Booking status */}
          <View style={styles.panel}>
            <View
              style={[
                styles.statusHeader,
                !isWide && styles.statusHeaderMobile,
              ]}
            >
              <View style={styles.statusHeadingCopy}>
                <Text style={styles.label}>BOOKED SERVICE</Text>
                <Text style={styles.serviceTitle}>{booking.serviceName}</Text>
                <Text style={styles.mutedText}>
                  Booking created {booking.createdAt}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadges,
                  !isWide && styles.statusBadgesMobile,
                ]}
              >
                <View style={[styles.badge, { backgroundColor: bookingState.bg }]}>
                  <Text style={[styles.badgeText, { color: bookingState.text }]}>
                    {formatBookingStatus(booking.bookingStatus)}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: paymentState.bg }]}>
                  <Text style={[styles.badgeText, { color: paymentState.text }]}>
                    {formatPaymentStatus(booking.paymentStatus)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date, time and booking ID */}
          <Panel title="Booking Details">
            <View style={[styles.infoGrid, !isWide && styles.infoGridMobile]}>
              <InfoCard icon="📅" label="SERVICE DATE" value={booking.date} />
              <InfoCard icon="🕒" label="TIME SLOT" value={booking.time} />
              <InfoCard icon="📋" label="BOOKING ID" value={`#${booking.id}`} />
            </View>
          </Panel>

          {/* Main content and payment sidebar */}
          <View
            style={[
              styles.contentColumns,
              !isDesktop && styles.contentColumnsStacked,
            ]}
          >
            <View style={styles.mainColumn}>
              <Panel title="Service Professional">
                <View style={styles.providerRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {booking.providerInitials}
                    </Text>
                  </View>
                  <View style={styles.providerCopy}>
                    <Text style={styles.providerName}>{booking.providerName}</Text>
                    <Text style={styles.mutedText}>{booking.serviceName}</Text>
                    <Text style={styles.providerVerified}>✓ ServiGo Provider</Text>
                  </View>
                  <ActionButton
                    label="View Provider"
                    variant="secondary"
                    onPress={openProvider}
                  />
                </View>
              </Panel>

              <Panel title="Service Address">
                <View style={styles.addressCard}>
                  <View style={styles.addressLabel}>
                    <Text style={styles.addressLabelText}>
                      {booking.addressLabel}
                    </Text>
                  </View>
                  <Text style={styles.addressText}>📍 {booking.address}</Text>
                </View>
              </Panel>

              {(booking.problem || booking.notes) && (
                <Panel title="Service Requirement">
                  {!!booking.problem && (
                    <View style={styles.requirementBlock}>
                      <Text style={styles.label}>PROBLEM / REQUIREMENT</Text>
                      <Text style={styles.bodyText}>{booking.problem}</Text>
                    </View>
                  )}
                  {!!booking.notes && (
                    <View style={styles.noteBox}>
                      <Text style={styles.noteTitle}>NOTE FOR PROVIDER</Text>
                      <Text style={styles.noteText}>{booking.notes}</Text>
                    </View>
                  )}
                </Panel>
              )}
            </View>

            <View style={styles.sidebar}>
              <Panel title="Payment Summary">
                <PriceRow label="Service Price" value={`₹${booking.servicePrice}`} />
                <PriceRow label="Service Charge" value={`₹${booking.serviceCharge}`} />
                {booking.discount > 0 && (
                  <PriceRow
                    label="Discount"
                    value={`− ₹${booking.discount}`}
                    positive
                  />
                )}
                <View style={styles.divider} />
                <PriceRow label="Total Amount" value={`₹${booking.totalAmount}`} bold />

                <View style={[styles.paymentBox, { backgroundColor: paymentState.bg }]}>
                  <Text style={[styles.label, { color: paymentState.text }]}>
                    PAYMENT STATUS
                  </Text>
                  <Text style={[styles.paymentStatusText, { color: paymentState.text }]}>
                    {formatPaymentStatus(booking.paymentStatus)}
                  </Text>
                  {!!booking.paymentMethod && (
                    <Text style={styles.mutedText}>{booking.paymentMethod}</Text>
                  )}
                </View>

                {booking.paymentStatus === "pending" && (
                  <ActionButton
                    label="Continue to Payment"
                    onPress={openPayment}
                    fullWidth
                  />
                )}
              </Panel>

              <Panel title="What happens next?">
                {[
                  {
                    number: "1",
                    title: "Provider Confirmation",
                    text: "Your provider receives the request and confirms the booking.",
                  },
                  {
                    number: "2",
                    title: "Professional Arrives",
                    text: "The professional visits your address at the selected time.",
                  },
                  {
                    number: "3",
                    title: "Service Completion",
                    text: "Your booking status will be updated when the service is complete.",
                  },
                  {
                    number: "4",
                    title: "Rate & Review",
                    text: "Share your experience after service completion.",
                  },
                ].map((step) => (
                  <View key={step.number} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{step.number}</Text>
                    </View>
                    <View style={styles.stepCopy}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.text}</Text>
                    </View>
                  </View>
                ))}
              </Panel>
            </View>
          </View>

          {/* Bottom actions */}
          <View style={styles.bottomCta}>
            <Text style={styles.bottomCtaTitle}>You're all set!</Text>
            <Text style={styles.bottomCtaText}>
              Track provider confirmation, payment and service progress from
              your booking details.
            </Text>
            <View style={styles.bottomButtons}>
              <ActionButton label="View Booking" onPress={openBookingDetails} />
              <ActionButton label="My Bookings" onPress={goBookings} variant="outline" />
            </View>
          </View>

          <View style={styles.footerActions}>
            <ActionButton
              label="+ Book Another Service"
              onPress={goServices}
              variant="secondary"
            />
            <ActionButton label="Need Help?" onPress={goSupport} variant="outline" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.page,
  },
  screen: {
    flex: 1,
    width: "100%",
    backgroundColor: C.page,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
    paddingBottom: 36,
  },
  page: {
    width: "100%",
    alignSelf: "center",
  },
  hero: {
    alignItems: "center",
    backgroundColor: C.green,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 34,
    marginBottom: 18,
  },
  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  successCheck: {
    fontSize: 43,
    fontWeight: "800",
    color: C.green,
  },
  heroTitle: {
    marginTop: 18,
    color: C.white,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
  },
  heroDescription: {
    maxWidth: 620,
    marginTop: 10,
    color: "#E9FFF1",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  bookingNumber: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: "#12683C",
  },
  bookingNumberText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
  },
  panel: {
    width: "100%",
    padding: 20,
    marginBottom: 18,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  panelTitle: {
    color: C.text,
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "800",
    marginBottom: 17,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
  },
  statusHeaderMobile: {
    flexDirection: "column",
  },
  statusHeadingCopy: {
    flex: 1,
    minWidth: 0,
  },
  serviceTitle: {
    color: C.text,
    fontSize: 23,
    lineHeight: 31,
    fontWeight: "800",
    marginTop: 7,
  },
  label: {
    color: "#83919F",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  mutedText: {
    marginTop: 5,
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  statusBadges: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadgesMobile: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoGridMobile: {
    flexDirection: "column",
  },
  infoCard: {
    flex: 1,
    flexBasis: 170,
    minWidth: 0,
    padding: 16,
    borderRadius: 15,
    backgroundColor: "#F5F8FA",
  },
  infoIcon: {
    fontSize: 23,
  },
  infoValue: {
    marginTop: 5,
    color: C.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "800",
  },
  contentColumns: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  contentColumnsStacked: {
    flexDirection: "column",
  },
  mainColumn: {
    flex: 2,
    flexBasis: 0,
    minWidth: 0,
    width: "100%",
  },
  sidebar: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    width: "100%",
  },
  providerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 13,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.greenLight,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: C.primaryDark,
  },
  providerCopy: {
    flex: 1,
    minWidth: 140,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
  },
  providerVerified: {
    marginTop: 7,
    alignSelf: "flex-start",
    color: C.primaryDark,
    backgroundColor: C.greenLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: "hidden",
    fontSize: 10,
    fontWeight: "800",
  },
  addressCard: {
    backgroundColor: "#F5F8FA",
    borderRadius: 15,
    padding: 16,
  },
  addressLabel: {
    alignSelf: "flex-start",
    borderRadius: 15,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  addressLabelText: {
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: "800",
  },
  addressText: {
    marginTop: 12,
    color: "#405365",
    fontSize: 14,
    lineHeight: 23,
  },
  requirementBlock: {
    marginBottom: 14,
  },
  bodyText: {
    marginTop: 8,
    color: "#536577",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },
  noteBox: {
    backgroundColor: "#FFF7E6",
    padding: 14,
    borderRadius: 13,
  },
  noteTitle: {
    color: "#95610C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  noteText: {
    color: "#79521A",
    marginTop: 7,
    fontSize: 13,
    lineHeight: 21,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 9,
  },
  priceLabel: {
    flex: 1,
    color: C.muted,
    fontSize: 13,
  },
  priceValue: {
    color: "#34495A",
    fontSize: 13,
    fontWeight: "700",
  },
  boldPriceLabel: {
    color: C.text,
    fontWeight: "800",
  },
  boldPriceValue: {
    color: C.text,
    fontSize: 21,
    fontWeight: "800",
  },
  discountValue: {
    color: C.green,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 9,
  },
  paymentBox: {
    marginTop: 15,
    marginBottom: 15,
    padding: 14,
    borderRadius: 13,
  },
  paymentStatusText: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "800",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginBottom: 19,
  },
  stepNumber: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: C.blueLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: C.blue,
    fontSize: 12,
    fontWeight: "800",
  },
  stepCopy: {
    flex: 1,
    minWidth: 0,
  },
  stepTitle: {
    color: C.text,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
  },
  stepDescription: {
    marginTop: 4,
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  primaryButtonText: {
    color: C.white,
  },
  secondaryButton: {
    backgroundColor: C.greenLight,
    borderColor: "#C7E6E0",
  },
  secondaryButtonText: {
    color: C.primaryDark,
  },
  outlineButton: {
    backgroundColor: C.white,
    borderColor: C.border,
  },
  outlineButtonText: {
    color: C.text,
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  fullWidth: {
    width: "100%",
    marginTop: 10,
  },
  pressed: {
    opacity: 0.72,
  },
  bottomCta: {
    marginTop: 2,
    marginBottom: 18,
    padding: 24,
    borderRadius: 21,
    backgroundColor: "#172B3A",
  },
  bottomCtaTitle: {
    color: C.white,
    fontSize: 25,
    lineHeight: 33,
    fontWeight: "800",
  },
  bottomCtaText: {
    marginTop: 8,
    maxWidth: 650,
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 22,
  },
  bottomButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  footerActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 12,
  },
  notFoundWrap: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundCard: {
    width: "100%",
    maxWidth: 480,
    padding: 26,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
  },
  notFoundIcon: {
    fontSize: 42,
  },
  notFoundTitle: {
    marginTop: 16,
    color: C.text,
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
  },
});
