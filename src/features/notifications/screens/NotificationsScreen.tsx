
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type NotificationType =
  | "booking"
  | "payment"
  | "review"
  | "account"
  | "promotion";

type NotificationFilter = "all" | "unread" | NotificationType;

type NotificationAction =
  | { type: "booking"; bookingId: number }
  | { type: "payment"; bookingId: number }
  | { type: "review"; bookingId: number }
  | { type: "provider"; providerId: number }
  | { type: "profile" }
  | { type: "support" }
  | { type: "none" };

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionLabel?: string;
  action: NotificationAction;
};

type NotificationPreferences = {
  booking: boolean;
  payment: boolean;
  review: boolean;
  promotion: boolean;
  push: boolean;
  email: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message:
      "Your Washing Machine Repair booking has been confirmed for 20 Oct 2026 at 10:00 AM.",
    isRead: false,
    createdAt: "5 min ago",
    actionLabel: "View Booking",
    action: { type: "booking", bookingId: 1001 },
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Pending",
    message:
      "Payment is still pending for your Home Cleaning booking. Complete payment to continue.",
    isRead: false,
    createdAt: "20 min ago",
    actionLabel: "Pay Now",
    action: { type: "payment", bookingId: 1002 },
  },
  {
    id: 3,
    type: "booking",
    title: "Service Completed",
    message: "Your Electrician service has been marked as completed.",
    isRead: false,
    createdAt: "2 hours ago",
    actionLabel: "View Booking",
    action: { type: "booking", bookingId: 1003 },
  },
  {
    id: 4,
    type: "review",
    title: "Share Your Experience",
    message:
      "Rate your completed service and help other ServiGo customers.",
    isRead: true,
    createdAt: "Yesterday",
    actionLabel: "Write Review",
    action: { type: "review", bookingId: 1003 },
  },
  {
    id: 5,
    type: "payment",
    title: "Payment Successful",
    message: "Your payment of ₹648 was received successfully.",
    isRead: true,
    createdAt: "Yesterday",
    actionLabel: "View Booking",
    action: { type: "booking", bookingId: 1001 },
  },
  {
    id: 6,
    type: "account",
    title: "Email Verified",
    message:
      "Your ServiGo email address has been verified successfully.",
    isRead: true,
    createdAt: "2 days ago",
    actionLabel: "View Profile",
    action: { type: "profile" },
  },
  {
    id: 7,
    type: "promotion",
    title: "Discover Trusted Providers",
    message:
      "Explore highly rated service providers and save your favourites.",
    isRead: true,
    createdAt: "3 days ago",
    actionLabel: "Find Providers",
    action: { type: "provider", providerId: 5 },
  },
  {
    id: 8,
    type: "account",
    title: "Need a Hand?",
    message:
      "Contact ServiGo Support for booking, payment or account assistance.",
    isRead: true,
    createdAt: "4 days ago",
    actionLabel: "Contact Support",
    action: { type: "support" },
  },
];

const filters: { label: string; value: NotificationFilter }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Bookings", value: "booking" },
  { label: "Payments", value: "payment" },
  { label: "Reviews", value: "review" },
  { label: "Account", value: "account" },
  { label: "Offers", value: "promotion" },
];

const categoryMeta: Record<
  NotificationType,
  { icon: string; label: string; tint: string; color: string }
> = {
  booking: {
    icon: "▣",
    label: "Booking",
    tint: "#E8F5F1",
    color: "#16796F",
  },
  payment: {
    icon: "₹",
    label: "Payment",
    tint: "#EAF1FF",
    color: "#315FC5",
  },
  review: {
    icon: "★",
    label: "Review",
    tint: "#FFF4DD",
    color: "#A56A00",
  },
  account: {
    icon: "✓",
    label: "Account",
    tint: "#F0EAFE",
    color: "#7354B8",
  },
  promotion: {
    icon: "✦",
    label: "Offer",
    tint: "#FCEAF2",
    color: "#B83F78",
  },
};

const initialPreferences: NotificationPreferences = {
  booking: true,
  payment: true,
  review: true,
  promotion: false,
  push: true,
  email: false,
};

export default function NotificationsScreen() {
  const { width } = useWindowDimensions();

  const isWide = width >= 900;
  const isSmall = width < 390;

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  const [activeFilter, setActiveFilter] =
    useState<NotificationFilter>("all");

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] =
    useState<NotificationPreferences>(initialPreferences);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((item) => {
        if (activeFilter === "unread") return !item.isRead;
        if (activeFilter === "all") return true;
        return item.type === activeFilter;
      }),
    [notifications, activeFilter],
  );

  const totalBookings = notifications.filter(
    (item) => item.type === "booking",
  ).length;

  const updatePreference = (key: keyof NotificationPreferences) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
  };

  const markAsUnread = (id: number) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isRead: false } : item,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
  };

  const deleteNotification = (id: number) => {
    const remove = () => {
      setNotifications((current) =>
        current.filter((item) => item.id !== id),
      );
      setExpandedId((current) => (current === id ? null : current));
    };

    if (Platform.OS === "web") {
      remove();
      return;
    }

    Alert.alert(
      "Delete notification?",
      "This notification will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: remove },
      ],
    );
  };

  const openNotificationAction = (notification: NotificationItem) => {
    markAsRead(notification.id);

    switch (notification.action.type) {
      case "booking":
        router.push({
          pathname: "/bookings/[bookingId]",
          params: { bookingId: String(notification.action.bookingId) },
        });
        break;

      case "payment":
        router.push({
          pathname: "/payment/[bookingId]",
          params: { bookingId: String(notification.action.bookingId) },
        });
        break;

      case "review":
        router.push({
          pathname: "/review/[bookingId]",
          params: { bookingId: String(notification.action.bookingId) },
        });
        break;

      case "provider":
        router.push({
          pathname: "/providers/[providerId]",
          params: { providerId: String(notification.action.providerId) },
        });
        break;

      case "profile":
        router.push("/profile");
        break;

      case "support":
        router.push("/support");
        break;

      case "none":
        break;
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
    markAsRead(id);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: isSmall ? 14 : isWide ? 28 : 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Global navbar is already part of the app. */}

      <View
        style={[
          styles.container,
          {
            maxWidth: isWide ? 1440 : 900,
            paddingTop: isWide ? 32 : 22,
          },
        ]}
      >
        <View style={[styles.pageHeading, isWide && styles.pageHeadingWide]}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>YOUR SERVIGO ACTIVITY</Text>
            <Text style={[styles.pageTitle, isSmall && styles.pageTitleSmall]}>
              Notifications
            </Text>
            <Text style={styles.subtitle}>
              Booking updates, payments and important account alerts — all in
              one place.
            </Text>
          </View>

          <View
            style={[
              styles.headingActions,
              !isWide && styles.headingActionsFull,
            ]}
          >
            <Pressable
              onPress={() => setShowSettings((current) => !current)}
              style={[
                styles.secondaryButton,
                !isWide && styles.actionButtonFull,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                {showSettings ? "Close settings" : "⚙ Preferences"}
              </Text>
            </Pressable>

            <Pressable
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
              style={[
                styles.primaryButton,
                !isWide && styles.actionButtonFull,
                unreadCount === 0 && styles.disabledButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>✓ Mark all as read</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.statsGrid, isWide && styles.statsGridWide]}>
          <StatCard
            label="Total notifications"
            value={notifications.length}
            note="Across all updates"
          />
          <StatCard
            label="Unread"
            value={unreadCount}
            note={unreadCount ? "Needs your attention" : "You're all caught up"}
            accent={unreadCount > 0}
          />
          <StatCard
            label="Booking updates"
            value={totalBookings}
            note="Booking status changes"
          />
        </View>

        {showSettings && (
          <View style={styles.settingsCard}>
            <View style={styles.settingsHeader}>
              <View style={styles.headingCopy}>
                <Text style={styles.sectionTitle}>
                  Notification preferences
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Choose which updates you want to receive.
                </Text>
              </View>
              <Text style={styles.settingsIcon}>⚙</Text>
            </View>

            <Text style={styles.preferenceGroupTitle}>
              IN-APP NOTIFICATIONS
            </Text>

            <View style={styles.preferenceGrid}>
              <PreferenceRow
                title="Booking updates"
                description="Confirmations and service status"
                value={preferences.booking}
                onPress={() => updatePreference("booking")}
              />
              <PreferenceRow
                title="Payment alerts"
                description="Pending and successful payments"
                value={preferences.payment}
                onPress={() => updatePreference("payment")}
              />
              <PreferenceRow
                title="Review reminders"
                description="Rate your completed service"
                value={preferences.review}
                onPress={() => updatePreference("review")}
              />
              <PreferenceRow
                title="Offers and promotions"
                description="Deals and provider suggestions"
                value={preferences.promotion}
                onPress={() => updatePreference("promotion")}
              />
            </View>

            <Text style={[styles.preferenceGroupTitle, { marginTop: 18 }]}>
              DELIVERY CHANNELS
            </Text>

            <View style={styles.preferenceGrid}>
              <PreferenceRow
                title="Push notifications"
                description="Device alerts when supported"
                value={preferences.push}
                onPress={() => updatePreference("push")}
              />
              <PreferenceRow
                title="Email notifications"
                description="Important updates by email"
                value={preferences.email}
                onPress={() => updatePreference("email")}
              />
            </View>

            <Text style={styles.settingsFootnote}>
              These preferences currently exist only in screen state. Saving
              them permanently and enabling push/email delivery requires
              backend integration.
            </Text>
          </View>
        )}

        <View style={styles.filterSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.headingCopy}>
              <Text style={styles.sectionTitle}>Recent updates</Text>
              <Text style={styles.sectionSubtitle}>
                {filteredNotifications.length}{" "}
                {filteredNotifications.length === 1
                  ? "notification"
                  : "notifications"}
              </Text>
            </View>

            {activeFilter !== "all" && (
              <Pressable
                onPress={() => setActiveFilter("all")}
                style={styles.clearFilter}
              >
                <Text style={styles.clearFilterText}>Clear filter ×</Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => {
              const selected = activeFilter === filter.value;

              return (
                <Pressable
                  key={filter.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveFilter(filter.value)}
                  style={[
                    styles.filterChip,
                    selected && styles.filterChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selected && styles.filterTextSelected,
                    ]}
                  >
                    {filter.label}
                    {filter.value === "unread" && unreadCount > 0
                      ? ` ${unreadCount}`
                      : ""}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {filteredNotifications.length > 0 ? (
          <View style={styles.notificationList}>
            {filteredNotifications.map((notification) => {
              const meta = categoryMeta[notification.type];
              const expanded = expandedId === notification.id;

              return (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadCard,
                  ]}
                >
                  <Pressable
                    onPress={() => toggleExpanded(notification.id)}
                    style={styles.notificationMain}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: meta.tint },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryIconText,
                          { color: meta.color },
                        ]}
                      >
                        {meta.icon}
                      </Text>
                    </View>

                    <View style={styles.notificationContent}>
                      <View style={styles.notificationTitleRow}>
                        <Text style={styles.notificationTitle}>
                          {notification.title}
                        </Text>
                        {!notification.isRead && <View style={styles.unreadDot} />}
                      </View>

                      <Text
                        style={styles.notificationMessage}
                        numberOfLines={expanded ? undefined : 2}
                      >
                        {notification.message}
                      </Text>

                      <View style={styles.notificationMetaRow}>
                        <View
                          style={[
                            styles.categoryPill,
                            { backgroundColor: meta.tint },
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryPillText,
                              { color: meta.color },
                            ]}
                          >
                            {meta.label}
                          </Text>
                        </View>
                        <Text style={styles.timeText}>
                          {notification.createdAt}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.expandChevron}>
                      {expanded ? "⌃" : "⌄"}
                    </Text>
                  </Pressable>

                  {expanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.detailLabel}>DETAILS</Text>
                      <Text style={styles.detailMessage}>
                        {notification.message}
                      </Text>

                      <View
                        style={[
                          styles.cardActions,
                          !isWide && styles.cardActionsStack,
                        ]}
                      >
                        {notification.actionLabel &&
                          notification.action.type !== "none" && (
                            <Pressable
                              onPress={() =>
                                openNotificationAction(notification)
                              }
                              style={styles.primaryButton}
                            >
                              <Text style={styles.primaryButtonText}>
                                {notification.actionLabel} →
                              </Text>
                            </Pressable>
                          )}

                        <Pressable
                          onPress={() =>
                            notification.isRead
                              ? markAsUnread(notification.id)
                              : markAsRead(notification.id)
                          }
                          style={styles.secondaryButton}
                        >
                          <Text style={styles.secondaryButtonText}>
                            {notification.isRead
                              ? "Mark as unread"
                              : "Mark as read"}
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => deleteNotification(notification.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconWrap}>
              <Text style={styles.emptyIcon}>✓</Text>
            </View>
            <Text style={styles.emptyTitle}>
              {activeFilter === "unread"
                ? "You're all caught up"
                : "No notifications here"}
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === "unread"
                ? "There are no unread updates right now."
                : "Try another filter or check back later."}
            </Text>
            <Pressable
              onPress={() => setActiveFilter("all")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                View all notifications
              </Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.supportCard, isWide && styles.supportCardWide]}>
          <View style={styles.supportCopy}>
            <Text style={styles.supportTitle}>
              Need help with an update?
            </Text>
            <Text style={styles.supportText}>
              Get assistance with your booking, payment or account notification
              from ServiGo Support.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/support")}
            style={styles.supportButton}
          >
            <Text style={styles.supportButtonText}>Contact support →</Text>
          </Pressable>
        </View>

        <Text style={styles.footerNote}>
          Sample notifications are displayed until the notifications API is
          connected.
        </Text>
      </View>
    </ScrollView>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  note: string;
  accent?: boolean;
};

function StatCard({ label, value, note, accent = false }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>
        {value}
      </Text>
      <Text style={styles.statNote}>{note}</Text>
    </View>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  value: boolean;
  onPress: () => void;
};

function PreferenceRow({
  title,
  description,
  value,
  onPress,
}: PreferenceRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={styles.preferenceRow}
    >
      <View style={styles.preferenceTextWrap}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>

      <View style={[styles.switchTrack, value && styles.switchTrackOn]}>
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F9F6",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 36,
  },
  container: {
    width: "100%",
    alignSelf: "center",
    paddingBottom: 24,
  },
  pageHeading: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 20,
    marginBottom: 24,
  },
  pageHeadingWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  headingCopy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    color: "#16796F",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  pageTitle: {
    color: "#173D38",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  pageTitleSmall: {
    fontSize: 28,
  },
  subtitle: {
    color: "#71827E",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 560,
  },
  headingActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  headingActionsFull: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  primaryButton: {
    minHeight: 44,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#16796F",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCE9E4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#28534C",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  actionButtonFull: {
    width: "100%",
  },
  disabledButton: {
    opacity: 0.45,
  },
  statsGrid: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 26,
  },
  statsGridWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFEB",
  },
  statLabel: {
    color: "#71827E",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
  },
  statValue: {
    color: "#173D38",
    fontSize: 29,
    fontWeight: "800",
    marginBottom: 5,
  },
  statValueAccent: {
    color: "#16796F",
  },
  statNote: {
    color: "#82918D",
    fontSize: 11,
    lineHeight: 16,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2ECE7",
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  settingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  settingsIcon: {
    width: 42,
    height: 42,
    lineHeight: 42,
    textAlign: "center",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#E8F5F1",
    color: "#16796F",
    fontSize: 21,
  },
  sectionTitle: {
    color: "#173D38",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: "#7A8985",
    fontSize: 13,
    lineHeight: 20,
  },
  preferenceGroupTitle: {
    color: "#82918D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 10,
  },
  preferenceGrid: {
    flexDirection: "column",
    gap: 10,
  },
  preferenceRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: "#E8EFEB",
    borderRadius: 14,
    backgroundColor: "#FCFDFC",
  },
  preferenceTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  preferenceTitle: {
    color: "#294740",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
  },
  preferenceDescription: {
    color: "#84918D",
    fontSize: 11,
    lineHeight: 16,
  },
  switchTrack: {
    width: 43,
    height: 25,
    padding: 3,
    borderRadius: 20,
    backgroundColor: "#D9E2DE",
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: "#16796F",
  },
  switchThumb: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
  settingsFootnote: {
    color: "#84918D",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 18,
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  clearFilter: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E8F5F1",
  },
  clearFilterText: {
    color: "#16796F",
    fontSize: 12,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 6,
    paddingRight: 8,
  },
  filterChip: {
    minHeight: 38,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#DCE8E2",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipSelected: {
    borderColor: "#16796F",
    backgroundColor: "#16796F",
  },
  filterText: {
    color: "#5F746D",
    fontSize: 12,
    fontWeight: "700",
  },
  filterTextSelected: {
    color: "#FFFFFF",
  },
  notificationList: {
    gap: 12,
  },
  notificationCard: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5EDE8",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },
  unreadCard: {
    borderColor: "#B8DCD1",
    backgroundColor: "#FEFFFE",
  },
  notificationMain: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    padding: 16,
  },
  categoryIcon: {
    width: 43,
    height: 43,
    flexShrink: 0,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconText: {
    fontSize: 20,
    fontWeight: "800",
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  notificationTitle: {
    flexShrink: 1,
    color: "#24443D",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#16796F",
  },
  notificationMessage: {
    color: "#75857F",
    fontSize: 12,
    lineHeight: 19,
  },
  notificationMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 12,
  },
  categoryPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: "800",
  },
  timeText: {
    color: "#96A29E",
    fontSize: 10,
  },
  expandChevron: {
    color: "#7D9189",
    fontSize: 21,
    paddingLeft: 2,
    paddingTop: 3,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#EDF2EF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,
    backgroundColor: "#FCFDFC",
  },
  detailLabel: {
    color: "#82918D",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  detailMessage: {
    color: "#536B63",
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 9,
  },
  cardActionsStack: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  deleteButton: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0D8D8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#B54747",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 38,
    borderWidth: 1,
    borderColor: "#E4ECE7",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  emptyIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#E8F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyIcon: {
    color: "#16796F",
    fontSize: 27,
    fontWeight: "800",
  },
  emptyTitle: {
    color: "#24443D",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 7,
  },
  emptyText: {
    maxWidth: 300,
    color: "#82918D",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 20,
  },
  supportCard: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 18,
    padding: 20,
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: "#E8F5F1",
  },
  supportCardWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supportCopy: {
    flex: 1,
    minWidth: 0,
  },
  supportTitle: {
    color: "#204A42",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 7,
  },
  supportText: {
    color: "#658078",
    fontSize: 12,
    lineHeight: 19,
  },
  supportButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  supportButtonText: {
    color: "#16796F",
    fontSize: 12,
    fontWeight: "800",
  },
  footerNote: {
    color: "#98A49F",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 20,
  },
});
