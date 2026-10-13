
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
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

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type PaymentStatus = "pending" | "paid" | "refunded";
type FilterType = "all" | "upcoming" | "completed" | "cancelled";

type Booking = {
  id: number;
  serviceName: string;
  providerName: string;
  providerInitials: string;
  date: string;
  time: string;
  address: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

const ITEMS_PER_PAGE = 4;

const C = {
  page: "#F4F7FA",
  white: "#FFFFFF",
  text: "#172B3A",
  muted: "#738394",
  border: "#E3EAF0",
  primary: "#16796F",
  primaryDark: "#125E57",
  primaryLight: "#E6F4F1",
};

const BOOKINGS: Booking[] = [
  {
    id: 1001,
    serviceName: "Washing Machine Repair",
    providerName: "Rahul Provider",
    providerInitials: "RP",
    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    address: "Vaishali Nagar, Jaipur, Rajasthan",
    amount: 599,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 1002,
    serviceName: "Home Cleaning",
    providerName: "Amit Sharma",
    providerInitials: "AS",
    date: "22 Sep 2026",
    time: "02:00 PM - 04:00 PM",
    address: "Mansarovar, Jaipur, Rajasthan",
    amount: 499,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: 1003,
    serviceName: "Electrician",
    providerName: "Rohit Verma",
    providerInitials: "RV",
    date: "15 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    address: "Malviya Nagar, Jaipur, Rajasthan",
    amount: 249,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: 1004,
    serviceName: "Plumber",
    providerName: "Vikas Kumar",
    providerInitials: "VK",
    date: "12 Sep 2026",
    time: "04:00 PM - 05:00 PM",
    address: "C Scheme, Jaipur, Rajasthan",
    amount: 299,
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: 1005,
    serviceName: "AC Repair",
    providerName: "Sandeep Singh",
    providerInitials: "SS",
    date: "17 Sep 2026",
    time: "01:00 PM - 02:00 PM",
    address: "Jagatpura, Jaipur, Rajasthan",
    amount: 399,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: 1006,
    serviceName: "Home Cleaning",
    providerName: "Neha Sharma",
    providerInitials: "NS",
    date: "24 Sep 2026",
    time: "09:00 AM - 11:00 AM",
    address: "Tonk Road, Jaipur, Rajasthan",
    amount: 699,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 1007,
    serviceName: "Electrician",
    providerName: "Manoj Singh",
    providerInitials: "MS",
    date: "26 Sep 2026",
    time: "12:00 PM - 01:00 PM",
    address: "Pratap Nagar, Jaipur, Rajasthan",
    amount: 349,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: 1008,
    serviceName: "AC Repair",
    providerName: "Deepak Kumar",
    providerInitials: "DK",
    date: "28 Sep 2026",
    time: "03:00 PM - 04:00 PM",
    address: "Sitapura, Jaipur, Rajasthan",
    amount: 549,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: 1009,
    serviceName: "Plumber",
    providerName: "Ramesh Kumar",
    providerInitials: "RK",
    date: "30 Sep 2026",
    time: "10:00 AM - 11:00 AM",
    address: "Bani Park, Jaipur, Rajasthan",
    amount: 299,
    status: "completed",
    paymentStatus: "paid",
  },
];

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const SERVICE_ORDER = [
  "Home Cleaning",
  "Electrician",
  "Plumber",
  "AC Repair",
  "Washing Machine Repair",
];

function statusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
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

function paymentLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    pending: "Payment pending",
    paid: "Paid",
    refunded: "Refunded",
  };

  return labels[status];
}

function ServiceIcon({ serviceName }: { serviceName: string }) {
  const icon =
    serviceName === "Home Cleaning"
      ? "✦"
      : serviceName === "Electrician"
        ? "ϟ"
        : serviceName === "Plumber"
          ? "⌁"
          : serviceName === "AC Repair"
            ? "❄"
            : "⚙";

  return (
    <View style={styles.serviceIcon}>
      <Text style={styles.serviceIconText}>{icon}</Text>
    </View>
  );
}

function Badge({
  label,
  backgroundColor,
  color,
}: {
  label: string;
  backgroundColor: string;
  color: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  variant = "primary",
  fullWidth = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "review";
  fullWidth?: boolean;
}) {
  const buttonStyle = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
    review: styles.reviewButton,
  }[variant];

  const textStyle = {
    primary: styles.primaryButtonText,
    secondary: styles.secondaryButtonText,
    danger: styles.dangerButtonText,
    review: styles.reviewButtonText,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        buttonStyle,
        fullWidth && styles.fullWidthButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.actionButtonText, textStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const state = statusColors(booking.status);
  const payment = paymentColors(booking.paymentStatus);

  const openDetails = () => {
    router.push({
      pathname: "/bookings/[bookingId]",
      params: { bookingId: String(booking.id) },
    });
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardTop}>
        <ServiceIcon serviceName={booking.serviceName} />

        <View style={styles.cardHeading}>
          <Text style={styles.cardServiceName}>
            {booking.serviceName}
          </Text>
          <Text style={styles.bookingId}>
            Booking #{booking.id}
          </Text>
        </View>
      </View>

      <View style={styles.badgeStack}>
        <Badge
          label={statusLabel(booking.status)}
          backgroundColor={state.bg}
          color={state.text}
        />

        <Badge
          label={paymentLabel(booking.paymentStatus)}
          backgroundColor={payment.bg}
          color={payment.text}
        />
      </View>

      <View style={styles.separator} />

      <View style={styles.providerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {booking.providerInitials}
          </Text>
        </View>

        <View style={styles.providerCopy}>
          <Text style={styles.mutedLabel}>SERVICE PROVIDER</Text>
          <Text style={styles.providerName}>
            {booking.providerName}
          </Text>
        </View>
      </View>

      <View style={styles.detailGrid}>
        <Detail label="DATE" value={booking.date} />
        <Detail label="TIME" value={booking.time} />
        <Detail
          label="TOTAL PRICE"
          value={`₹${booking.amount}`}
        />
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.mutedLabel}>SERVICE ADDRESS</Text>
        <Text style={styles.addressText}>{booking.address}</Text>
      </View>

      <View style={styles.cardFooter}>
        <ActionButton
          label="View details"
          onPress={openDetails}
          fullWidth
        />

        {booking.paymentStatus === "pending" &&
          booking.status !== "cancelled" && (
            <ActionButton
              label="Pay now"
              variant="secondary"
              fullWidth
              onPress={() =>
                router.push({
                  pathname: "/payment/[bookingId]",
                  params: { bookingId: String(booking.id) },
                })
              }
            />
          )}

        {booking.status === "completed" && (
          <ActionButton
            label="Write review"
            variant="review"
            fullWidth
            onPress={() =>
              router.push({
                pathname: "/review/[bookingId]",
                params: { bookingId: String(booking.id) },
              })
            }
          />
        )}

        {(booking.status === "pending" ||
          booking.status === "confirmed") && (
            <ActionButton
              label="Manage booking"
              variant="danger"
              fullWidth
              onPress={openDetails}
            />
          )}
      </View>
    </View>
  );
}

export default function BookingsScreen() {
  const { width } = useWindowDimensions();

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const columns =
    width >= 1100 ? 3 : width >= 720 ? 2 : 1;

  const horizontalPadding =
    width < 360 ? 12 : width < 720 ? 16 : 28;

  const filteredBookings = useMemo(() => {
    let result = [...BOOKINGS];

    if (activeFilter === "upcoming") {
      result = result.filter((booking) =>
        ["pending", "confirmed", "in_progress"].includes(
          booking.status
        )
      );
    } else if (activeFilter === "completed") {
      result = result.filter(
        (booking) => booking.status === "completed"
      );
    } else if (activeFilter === "cancelled") {
      result = result.filter(
        (booking) => booking.status === "cancelled"
      );
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((booking) =>
        [
          booking.serviceName,
          booking.providerName,
          booking.address,
          String(booking.id),
        ].some((value) => value.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBookings = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;

    return filteredBookings.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredBookings, safePage]);

  const groupedBookings = useMemo(
    () =>
      SERVICE_ORDER.map((serviceName) => ({
        serviceName,
        bookings: paginatedBookings.filter(
          (booking) => booking.serviceName === serviceName
        ),
      })).filter((group) => group.bookings.length > 0),
    [paginatedBookings]
  );

  const upcomingCount = BOOKINGS.filter((booking) =>
    ["pending", "confirmed", "in_progress"].includes(
      booking.status
    )
  ).length;

  const completedCount = BOOKINGS.filter(
    (booking) => booking.status === "completed"
  ).length;

  const cancelledCount = BOOKINGS.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.page}
        translucent={false}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <View style={styles.pageHeading}>
            <View style={styles.headingCopy}>
              <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>
              <Text style={styles.pageTitle}>My Bookings</Text>
              <Text style={styles.subtitle}>
                All your services and appointments, organised in one place.
              </Text>
            </View>
          </View>

          {/* Dedicated button styles prevent the white background issue. */}

          <View style={styles.bookServiceWrap}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/services")}
              style={({ pressed }) => [
                styles.bookServiceButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.bookServiceButtonText}>
                + Book a service
              </Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            {[
              { label: "Total bookings", value: BOOKINGS.length },
              { label: "Upcoming", value: upcomingCount },
              { label: "Completed", value: completedCount },
              { label: "Cancelled", value: cancelledCount },
            ].map((stat) => (
              <View
                key={stat.label}
                style={[
                  styles.statCell,
                  { width: columns === 1 ? "48%" : undefined },
                ]}
              >
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>

            <TextInput
              value={search}
              onChangeText={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              placeholder="Search service, provider or ID"
              placeholderTextColor="#91A0AE"
              style={styles.searchInput}
              accessibilityLabel="Search bookings"
              returnKeyType="search"
            />

            {search.length > 0 && (
              <Pressable
                onPress={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                hitSlop={8}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filters}
          >
            {FILTERS.map((filter) => {
              const selected = activeFilter === filter.value;

              return (
                <Pressable
                  key={filter.value}
                  accessibilityRole="button"
                  onPress={() => {
                    setActiveFilter(filter.value);
                    setCurrentPage(1);
                  }}
                  style={[
                    styles.filterButton,
                    selected && styles.selectedFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selected && styles.selectedFilterText,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.listHeading}>
            <View style={styles.headingCopy}>
              <Text style={styles.sectionTitle}>
                Services & bookings
              </Text>

              <Text style={styles.resultText}>
                {filteredBookings.length}{" "}
                {filteredBookings.length === 1
                  ? "booking"
                  : "bookings"}{" "}
                found
              </Text>
            </View>

            <Text style={styles.pageIndicator}>
              {safePage}/{totalPages}
            </Text>
          </View>

          {paginatedBookings.length > 0 ? (
            <View style={styles.serviceGroups}>
              {groupedBookings.map((group) => (
                <View
                  key={group.serviceName}
                  style={styles.serviceSection}
                >
                  <View style={styles.serviceSectionHeading}>
                    <View style={styles.sectionAccent} />

                    <Text style={styles.serviceSectionTitle}>
                      {group.serviceName}
                    </Text>

                    <View style={styles.countPill}>
                      <Text style={styles.countPillText}>
                        {group.bookings.length}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.cardGrid,
                      columns === 2 && styles.twoColumns,
                      columns === 3 && styles.threeColumns,
                    ]}
                  >
                    {group.bookings.map((booking) => (
                      <View
                        key={booking.id}
                        style={[
                          styles.cardCell,
                          columns === 2 && styles.twoColumnCell,
                          columns === 3 && styles.threeColumnCell,
                        ]}
                      >
                        <BookingCard booking={booking} />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>▤</Text>

              <Text style={styles.emptyTitle}>
                No bookings found
              </Text>

              <Text style={styles.emptyText}>
                Try changing your search or selecting another filter.
              </Text>

              <ActionButton
                label="Clear filters"
                onPress={() => {
                  setSearch("");
                  setActiveFilter("all");
                  setCurrentPage(1);
                }}
              />
            </View>
          )}

          {filteredBookings.length > ITEMS_PER_PAGE && (
            <View style={styles.pagination}>
              <Pressable
                accessibilityRole="button"
                disabled={safePage === 1}
                onPress={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                style={[
                  styles.paginationButton,
                  safePage === 1 && styles.disabledButton,
                ]}
              >
                <Text style={styles.paginationText}>
                  ← Previous
                </Text>
              </Pressable>

              <Text style={styles.paginationLabel}>
                Page {safePage} of {totalPages}
              </Text>

              <Pressable
                accessibilityRole="button"
                disabled={safePage === totalPages}
                onPress={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                style={[
                  styles.paginationButton,
                  safePage === totalPages && styles.disabledButton,
                ]}
              >
                <Text style={styles.paginationText}>Next →</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.supportRow}>
            <Text style={styles.supportText}>
              Need help with a booking?{" "}
            </Text>

            <Pressable
              onPress={() => router.push("/support")}
              hitSlop={8}
            >
              <Text style={styles.supportLink}>
                Contact support
              </Text>
            </Pressable>
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
    paddingTop: 16,
    paddingBottom: 36,
  },
  page: {
    width: "100%",
    maxWidth: 1500,
    alignSelf: "center",
  },
  pageHeading: {
    width: "100%",
    marginBottom: 14,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: C.primary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: C.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: C.muted,
  },

  /* Book a service: explicit green background and white text */
  bookServiceWrap: {
    width: "100%",
    marginBottom: 18,
  },
  bookServiceButton: {
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#16796F",
    backgroundColor: "#16796F",
    alignItems: "center",
    justifyContent: "center",
  },
  bookServiceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },
  statCell: {
    flexGrow: 1,
    flexBasis: "22%",
    minWidth: 0,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  statNumber: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
    color: C.primary,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    color: C.muted,
  },
  searchBox: {
    width: "100%",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    marginBottom: 14,
  },
  searchIcon: {
    fontSize: 23,
    color: C.muted,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
    fontSize: 14,
    color: C.text,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.primary,
    paddingLeft: 8,
  },
  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 18,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    paddingBottom: 3,
    gap: 8,
  },
  filterButton: {
    minHeight: 39,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  selectedFilter: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#637587",
  },
  selectedFilterText: {
    color: "#FFFFFF",
  },
  listHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "800",
    color: C.text,
    flexShrink: 1,
  },
  resultText: {
    fontSize: 12,
    lineHeight: 18,
    color: C.muted,
    marginTop: 4,
  },
  pageIndicator: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "700",
  },
  serviceGroups: {
    width: "100%",
  },
  serviceSection: {
    width: "100%",
    marginBottom: 22,
  },
  serviceSectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 22,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  serviceSectionTitle: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: C.text,
  },
  countPill: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 7,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primaryLight,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.primaryDark,
  },
  cardGrid: {
    width: "100%",
    flexDirection: "column",
  },
  twoColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  threeColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardCell: {
    width: "100%",
    minWidth: 0,
    marginBottom: 12,
  },
  twoColumnCell: {
    width: "48.5%",
  },
  threeColumnCell: {
    width: "32%",
  },
  bookingCard: {
    width: "100%",
    minWidth: 0,
    backgroundColor: C.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    shadowColor: "#1D3344",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  serviceIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: C.primaryLight,
  },
  serviceIconText: {
    fontSize: 21,
    fontWeight: "800",
    color: C.primary,
  },
  cardHeading: {
    flex: 1,
    minWidth: 0,
  },
  cardServiceName: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
    color: C.text,
    flexShrink: 1,
  },
  bookingId: {
    fontSize: 11,
    lineHeight: 16,
    color: C.muted,
    marginTop: 4,
  },
  badgeStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: "100%",
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "800",
  },
  separator: {
    height: 1,
    backgroundColor: "#EDF1F4",
    marginVertical: 14,
  },
  providerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 39,
    height: 39,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: C.primaryLight,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.primaryDark,
  },
  providerCopy: {
    flex: 1,
    minWidth: 0,
  },
  mutedLabel: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#8493A0",
  },
  providerName: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
    color: C.text,
    marginTop: 4,
    flexShrink: 1,
  },
  detailGrid: {
    width: "100%",
    gap: 12,
  },
  detailItem: {
    width: "100%",
    minWidth: 0,
  },
  detailLabel: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#8493A0",
  },
  detailValue: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: "700",
    color: "#34495A",
    marginTop: 4,
    flexShrink: 1,
  },
  addressBox: {
    padding: 11,
    marginTop: 15,
    backgroundColor: "#F6F9FA",
    borderRadius: 11,
  },
  addressText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#405365",
    marginTop: 6,
    flexShrink: 1,
  },
  cardFooter: {
    width: "100%",
    gap: 8,
    marginTop: 15,
  },
  actionButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullWidthButton: {
    width: "100%",
    alignSelf: "stretch",
  },
  actionButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: C.primaryLight,
    borderColor: "#C7E6E0",
  },
  secondaryButtonText: {
    color: C.primaryDark,
  },
  dangerButton: {
    backgroundColor: "#FFF4F3",
    borderColor: "#F5D5D1",
  },
  dangerButtonText: {
    color: "#B63838",
  },
  reviewButton: {
    backgroundColor: "#FFF7E6",
    borderColor: "#F1E0B8",
  },
  reviewButtonText: {
    color: "#996515",
  },
  pressed: {
    opacity: 0.75,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  paginationButton: {
    minHeight: 41,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 13,
    borderRadius: 10,
    backgroundColor: C.primary,
  },
  paginationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  paginationLabel: {
    color: C.text,
    fontSize: 12,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.4,
  },
  emptyCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 25,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 32,
    color: C.primary,
  },
  emptyTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: C.muted,
    marginTop: 8,
    marginBottom: 18,
  },
  supportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  supportText: {
    fontSize: 12,
    lineHeight: 19,
    color: C.muted,
  },
  supportLink: {
    fontSize: 12,
    lineHeight: 19,
    fontWeight: "800",
    color: C.primary,
  },
});
