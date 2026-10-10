import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type NotificationType =
  | "booking"
  | "payment"
  | "review"
  | "account"
  | "promotion";

type NotificationFilter =
  | "all"
  | "unread"
  | "booking"
  | "payment"
  | "account";

type NotificationItem = {
  id: number;

  type: NotificationType;

  title: string;
  message: string;

  isRead: boolean;

  createdAt: string;

  actionLabel?: string;

  action:
  | {
    type: "booking";
    bookingId: number;
  }
  | {
    type: "payment";
    bookingId: number;
  }
  | {
    type: "review";
    bookingId: number;
  }
  | {
    type: "provider";
    providerId: number;
  }
  | {
    type: "profile";
  }
  | {
    type: "support";
  }
  | {
    type: "none";
  };
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,

    type: "booking",

    title: "Booking Confirmed",

    message:
      "Your Washing Machine Repair booking with Rahul Provider has been confirmed for 20 Sep 2026 at 10:00 AM.",

    isRead: false,

    createdAt: "5 min ago",

    actionLabel: "View Booking",

    action: {
      type: "booking",
      bookingId: 1001,
    },
  },

  {
    id: 2,

    type: "payment",

    title: "Payment Pending",

    message:
      "Payment is still pending for your Home Cleaning booking. Complete payment to keep your booking ready.",

    isRead: false,

    createdAt: "20 min ago",

    actionLabel: "Pay Now",

    action: {
      type: "payment",
      bookingId: 1002,
    },
  },

  {
    id: 3,

    type: "booking",

    title: "Service Completed",

    message:
      "Your Electrician service with Rohit Verma has been marked as completed.",

    isRead: false,

    createdAt: "2 hours ago",

    actionLabel: "View Booking",

    action: {
      type: "booking",
      bookingId: 1003,
    },
  },

  {
    id: 4,

    type: "review",

    title: "Share Your Experience",

    message:
      "How was your Electrician service? Rate your provider and help other ServiGo customers.",

    isRead: true,

    createdAt: "3 hours ago",

    actionLabel: "Write Review",

    action: {
      type: "review",
      bookingId: 1003,
    },
  },

  {
    id: 5,

    type: "payment",

    title: "Payment Successful",

    message:
      "Your payment of ₹648 for booking #1001 was completed successfully.",

    isRead: true,

    createdAt: "Yesterday",

    actionLabel: "View Booking",

    action: {
      type: "booking",
      bookingId: 1001,
    },
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

    action: {
      type: "profile",
    },
  },

  {
    id: 7,

    type: "promotion",

    title: "Save Your Favorite Providers",

    message:
      "Add professionals you trust to Favorites so you can book them faster next time.",

    isRead: true,

    createdAt: "3 days ago",

    actionLabel: "Find Providers",

    action: {
      type: "provider",
      providerId: 5,
    },
  },

  {
    id: 8,

    type: "account",

    title: "Need Help?",

    message:
      "ServiGo Support is available for booking, payment and account-related assistance.",

    isRead: true,

    createdAt: "5 days ago",

    actionLabel: "Contact Support",

    action: {
      type: "support",
    },
  },
];

const filters: {
  label: string;
  value: NotificationFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Unread",
      value: "unread",
    },
    {
      label: "Bookings",
      value: "booking",
    },
    {
      label: "Payments",
      value: "payment",
    },
    {
      label: "Account",
      value: "account",
    },
  ];

function getNotificationIcon(
  type: NotificationType
) {
  switch (type) {
    case "booking":
      return "📅";

    case "payment":
      return "💳";

    case "review":
      return "⭐";

    case "account":
      return "👤";

    case "promotion":
      return "🎁";
  }
}

function getNotificationStyle(
  type: NotificationType
) {
  switch (type) {
    case "booking":
      return {
        wrapper:
          "bg-blue-50",
        text:
          "text-blue-700",
      };

    case "payment":
      return {
        wrapper:
          "bg-green-50",
        text:
          "text-green-700",
      };

    case "review":
      return {
        wrapper:
          "bg-amber-50",
        text:
          "text-amber-700",
      };

    case "account":
      return {
        wrapper:
          "bg-violet-50",
        text:
          "text-violet-700",
      };

    case "promotion":
      return {
        wrapper:
          "bg-pink-50",
        text:
          "text-pink-700",
      };
  }
}

export default function NotificationsScreen() {
  const [
    notifications,
    setNotifications,
  ] =
    useState<NotificationItem[]>(
      initialNotifications
    );

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<NotificationFilter>(
      "all"
    );

  const [
    updatingId,
    setUpdatingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    markingAll,
    setMarkingAll,
  ] = useState(false);

  const unreadCount =
    notifications.filter(
      (item) =>
        !item.isRead
    ).length;

  const filteredNotifications =
    useMemo(() => {
      if (
        activeFilter ===
        "all"
      ) {
        return notifications;
      }

      if (
        activeFilter ===
        "unread"
      ) {
        return notifications.filter(
          (item) =>
            !item.isRead
        );
      }

      return notifications.filter(
        (item) =>
          item.type ===
          activeFilter
      );
    }, [
      notifications,
      activeFilter,
    ]);

  const markAsRead =
    async (
      notificationId: number
    ) => {
      const target =
        notifications.find(
          (item) =>
            item.id ===
            notificationId
        );

      if (
        !target ||
        target.isRead
      ) {
        return;
      }

      setUpdatingId(
        notificationId
      );

      try {
        /*
          BACKEND INTEGRATION LATER

          await notificationsApi.markAsRead(
            notificationId
          );

          Example:
          PATCH /notifications/:id/read

          UI same rahegi.
        */

        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                  notificationId
                  ? {
                    ...item,
                    isRead: true,
                  }
                  : item
            )
        );
      } catch (error) {
        console.error(
          "Mark notification read error:",
          error
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  const markAsUnread =
    async (
      notificationId: number
    ) => {
      setUpdatingId(
        notificationId
      );

      try {
        /*
          Optional backend:

          PATCH /notifications/:id/unread
        */

        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                  notificationId
                  ? {
                    ...item,
                    isRead: false,
                  }
                  : item
            )
        );
      } catch (error) {
        console.error(
          "Mark unread error:",
          error
        );
      } finally {
        setUpdatingId(
          null
        );
      }
    };

  const markAllAsRead =
    async () => {
      if (
        unreadCount === 0
      ) {
        return;
      }

      setMarkingAll(true);

      try {
        /*
          BACKEND INTEGRATION LATER

          await notificationsApi.markAllAsRead();

          Example:
          PATCH /notifications/read-all
        */

        setNotifications(
          (current) =>
            current.map(
              (item) => ({
                ...item,
                isRead: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Mark all read error:",
          error
        );

        if (
          Platform.OS ===
          "web"
        ) {
          window.alert(
            "Unable to update notifications."
          );
        } else {
          Alert.alert(
            "Unable to Update",
            "Could not mark notifications as read."
          );
        }
      } finally {
        setMarkingAll(
          false
        );
      }
    };

  const performDelete =
    async (
      notificationId: number
    ) => {
      setDeletingId(
        notificationId
      );

      try {
        /*
          BACKEND INTEGRATION LATER

          await notificationsApi.deleteNotification(
            notificationId
          );

          DELETE /notifications/:id
        */

        setNotifications(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                notificationId
            )
        );
      } catch (error) {
        console.error(
          "Delete notification error:",
          error
        );

        if (
          Platform.OS ===
          "web"
        ) {
          window.alert(
            "Unable to delete notification."
          );
        } else {
          Alert.alert(
            "Unable to Delete",
            "Could not delete this notification."
          );
        }
      } finally {
        setDeletingId(
          null
        );
      }
    };

  const handleDelete = (
    notification: NotificationItem
  ) => {
    if (
      Platform.OS ===
      "web"
    ) {
      const confirmed =
        window.confirm(
          "Delete this notification?"
        );

      if (confirmed) {
        performDelete(
          notification.id
        );
      }

      return;
    }

    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style:
            "destructive",

          onPress: () =>
            performDelete(
              notification.id
            ),
        },
      ]
    );
  };

  const openNotificationAction =
    async (
      notification: NotificationItem
    ) => {
      await markAsRead(
        notification.id
      );

      const action =
        notification.action;

      switch (action.type) {
        case "booking":
          router.push({
            pathname:
              "/bookings/[bookingId]",

            params: {
              bookingId:
                String(
                  action.bookingId
                ),
            },
          });
          return;

        case "payment":
          router.push({
            pathname:
              "/payment/[bookingId]",

            params: {
              bookingId:
                String(
                  action.bookingId
                ),
            },
          });
          return;

        case "review":
          router.push({
            pathname:
              "/review/[bookingId]",

            params: {
              bookingId:
                String(
                  action.bookingId
                ),
            },
          });
          return;

        case "provider":
          router.push({
            pathname:
              "/providers/[providerId]",

            params: {
              providerId:
                String(
                  action.providerId
                ),
            },
          });
          return;

        case "profile":
          router.push(
            "/profile"
          );
          return;

        case "support":
          router.push(
            "/support"
          );
          return;

        case "none":
          return;
      }
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
      {/* HEADER */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1050,
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
          maxWidth: 1050,
        }}
      >
        {/* HEADING */}
        <View className="mb-7 flex-row flex-wrap items-end justify-between gap-5">
          <View
            style={{
              minWidth: 240,
              flexBasis: 600,
              flexGrow: 1,
            }}
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Customer Updates
            </Text>

            <View className="mt-2 flex-row flex-wrap items-center gap-3">
              <Text className="text-3xl font-bold text-slate-900">
                Notifications
              </Text>

              {unreadCount > 0 && (
                <View className="rounded-full bg-red-500 px-3 py-1">
                  <Text className="text-xs font-bold text-white">
                    {unreadCount} unread
                  </Text>
                </View>
              )}
            </View>

            <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
              Stay updated on bookings,
              payments, reviews and
              account activity.
            </Text>
          </View>

          <Pressable
            disabled={
              unreadCount ===
              0 ||
              markingAll
            }
            onPress={
              markAllAsRead
            }
            className={
              unreadCount ===
                0 ||
                markingAll
                ? "rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 opacity-60"
                : "rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
            }
          >
            <Text
              className={
                unreadCount ===
                  0
                  ? "font-semibold text-slate-400"
                  : "font-semibold text-blue-700"
              }
            >
              {markingAll
                ? "Updating..."
                : "Mark All as Read"}
            </Text>
          </Pressable>
        </View>

        {/* STATS */}
        <View className="mb-6 flex-row flex-wrap gap-4">
          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-slate-900">
              {
                notifications.length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Total Notifications
            </Text>
          </View>

          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-red-600">
              {unreadCount}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Unread
            </Text>
          </View>

          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-blue-600">
              {
                notifications.filter(
                  (item) =>
                    item.type ===
                    "booking"
                ).length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Booking Updates
            </Text>
          </View>
        </View>

        {/* FILTERS */}
        <View className="mb-7 flex-row flex-wrap gap-2">
          {filters.map(
            (filter) => {
              const selected =
                activeFilter ===
                filter.value;

              return (
                <Pressable
                  key={
                    filter.value
                  }
                  onPress={() =>
                    setActiveFilter(
                      filter.value
                    )
                  }
                  className={
                    selected
                      ? "rounded-full bg-blue-600 px-5 py-2.5"
                      : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
                  }
                >
                  <Text
                    className={
                      selected
                        ? "font-semibold text-white"
                        : "font-semibold text-slate-600"
                    }
                  >
                    {
                      filter.label
                    }

                    {filter.value ===
                      "unread" &&
                      unreadCount >
                      0 &&
                      ` (${unreadCount})`}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* RESULT COUNT */}
        <View className="mb-5">
          <Text className="text-xl font-bold text-slate-900">
            Recent Updates
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            {
              filteredNotifications.length
            }{" "}
            {filteredNotifications.length ===
              1
              ? "notification"
              : "notifications"}
          </Text>
        </View>

        {/* NOTIFICATION LIST */}
        {filteredNotifications.length >
          0 ? (
          <View className="gap-4">
            {filteredNotifications.map(
              (
                notification
              ) => {
                const style =
                  getNotificationStyle(
                    notification.type
                  );

                const updating =
                  updatingId ===
                  notification.id;

                const deleting =
                  deletingId ===
                  notification.id;

                return (
                  <View
                    key={
                      notification.id
                    }
                    className={
                      notification.isRead
                        ? "rounded-3xl border border-slate-200 bg-white p-6"
                        : "rounded-3xl border-2 border-blue-200 bg-blue-50/30 p-6"
                    }
                  >
                    <View className="flex-row items-start gap-4">
                      {/* ICON */}
                      <View
                        className={`h-14 w-14 items-center justify-center rounded-2xl ${style.wrapper}`}
                      >
                        <Text className="text-2xl">
                          {getNotificationIcon(
                            notification.type
                          )}
                        </Text>
                      </View>

                      {/* CONTENT */}
                      <View className="flex-1">
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Text className="text-lg font-bold text-slate-900">
                            {
                              notification.title
                            }
                          </Text>

                          {!notification.isRead && (
                            <View className="rounded-full bg-blue-600 px-2.5 py-1">
                              <Text className="text-[10px] font-bold uppercase text-white">
                                New
                              </Text>
                            </View>
                          )}

                          <View
                            className={`rounded-full px-3 py-1 ${style.wrapper}`}
                          >
                            <Text
                              className={`text-xs font-bold capitalize ${style.text}`}
                            >
                              {
                                notification.type
                              }
                            </Text>
                          </View>
                        </View>

                        <Text className="mt-2 max-w-3xl leading-6 text-slate-600">
                          {
                            notification.message
                          }
                        </Text>

                        <Text className="mt-3 text-xs text-slate-400">
                          {
                            notification.createdAt
                          }
                        </Text>

                        {/* ACTIONS */}
                        <View className="mt-5 flex-row flex-wrap gap-2">
                          {notification.actionLabel &&
                            notification.action
                              .type !==
                            "none" && (
                              <Pressable
                                disabled={
                                  updating
                                }
                                onPress={() =>
                                  openNotificationAction(
                                    notification
                                  )
                                }
                                className="rounded-xl bg-blue-600 px-5 py-3"
                              >
                                <Text className="font-bold text-white">
                                  {
                                    notification.actionLabel
                                  }
                                </Text>
                              </Pressable>
                            )}

                          {!notification.isRead ? (
                            <Pressable
                              disabled={
                                updating
                              }
                              onPress={() =>
                                markAsRead(
                                  notification.id
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-white px-5 py-3"
                            >
                              <Text className="font-semibold text-slate-700">
                                {updating
                                  ? "Updating..."
                                  : "Mark as Read"}
                              </Text>
                            </Pressable>
                          ) : (
                            <Pressable
                              disabled={
                                updating
                              }
                              onPress={() =>
                                markAsUnread(
                                  notification.id
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-white px-5 py-3"
                            >
                              <Text className="font-semibold text-slate-600">
                                {updating
                                  ? "Updating..."
                                  : "Mark Unread"}
                              </Text>
                            </Pressable>
                          )}

                          <Pressable
                            disabled={
                              deleting
                            }
                            onPress={() =>
                              handleDelete(
                                notification
                              )
                            }
                            className={
                              deleting
                                ? "rounded-xl border border-red-200 bg-red-50 px-5 py-3 opacity-60"
                                : "rounded-xl border border-red-200 bg-red-50 px-5 py-3"
                            }
                          >
                            <Text className="font-semibold text-red-600">
                              {deleting
                                ? "Deleting..."
                                : "Delete"}
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        ) : (
          /* EMPTY STATE */
          <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-16">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <Text className="text-5xl">
                🔔
              </Text>
            </View>

            <Text className="mt-6 text-center text-2xl font-bold text-slate-900">
              {notifications.length ===
                0
                ? "No notifications yet"
                : activeFilter ===
                  "unread"
                  ? "You're all caught up"
                  : "No notifications found"}
            </Text>

            <Text className="mt-2 max-w-lg text-center leading-6 text-slate-500">
              {notifications.length ===
                0
                ? "Booking updates, payments and account notifications will appear here."
                : activeFilter ===
                  "unread"
                  ? "You don't have any unread notifications right now."
                  : "There are no notifications in this category."}
            </Text>

            {notifications.length >
              0 ? (
              <Pressable
                onPress={() =>
                  setActiveFilter(
                    "all"
                  )
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  View All Notifications
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() =>
                  router.push("/")
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  Back to Home
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* INFO */}
        <View className="mt-7 rounded-3xl bg-slate-900 p-7">
          <View className="flex-row flex-wrap items-center justify-between gap-5">
            <View
              style={{
                minWidth: 220,
                flexBasis: 550,
                flexGrow: 1,
              }}
            >
              <Text className="text-xl font-bold text-white">
                Need help with an update?
              </Text>

              <Text className="mt-2 max-w-2xl leading-6 text-slate-300">
                If you have questions
                about a booking,
                payment or account
                notification, ServiGo
                Support can help.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push(
                  "/support"
                )
              }
              className="rounded-xl bg-white px-6 py-4"
            >
              <Text className="font-bold text-slate-900">
                Contact Support
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}