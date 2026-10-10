import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type ReportPeriod =
  | "week"
  | "month"
  | "year";

type ChartItem = {
  label: string;
  bookings: number;
  revenue: number;
};

type ServiceReport = {
  id: number;
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
};

type ProviderReport = {
  id: number;
  name: string;
  profession: string;
  jobs: number;
  revenue: number;
  rating: number;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/admin",
  },
  {
    label: "Users",
    icon: "👥",
    route: "/admin/users",
  },
  {
    label: "Providers",
    icon: "🧑‍🔧",
    route: "/admin/providers",
  },
  {
    label: "Services",
    icon: "🛠️",
    route: "/admin/services",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/admin/bookings",
  },
  {
    label: "Payments",
    icon: "₹",
    route: "/admin/payments",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/admin/reviews",
  },
  {
    label: "Reports",
    icon: "📊",
    route: "/admin/reports",
  },
] as const;

const weekData: ChartItem[] = [
  {
    label: "Mon",
    bookings: 18,
    revenue: 8200,
  },
  {
    label: "Tue",
    bookings: 24,
    revenue: 10800,
  },
  {
    label: "Wed",
    bookings: 20,
    revenue: 9400,
  },
  {
    label: "Thu",
    bookings: 31,
    revenue: 14200,
  },
  {
    label: "Fri",
    bookings: 28,
    revenue: 13100,
  },
  {
    label: "Sat",
    bookings: 38,
    revenue: 17600,
  },
  {
    label: "Sun",
    bookings: 34,
    revenue: 15800,
  },
];

const monthData: ChartItem[] = [
  {
    label: "W1",
    bookings: 118,
    revenue: 52400,
  },
  {
    label: "W2",
    bookings: 136,
    revenue: 61800,
  },
  {
    label: "W3",
    bookings: 149,
    revenue: 68300,
  },
  {
    label: "W4",
    bookings: 134,
    revenue: 60700,
  },
];

const yearData: ChartItem[] = [
  {
    label: "Jan",
    bookings: 342,
    revenue: 145000,
  },
  {
    label: "Feb",
    bookings: 388,
    revenue: 168000,
  },
  {
    label: "Mar",
    bookings: 426,
    revenue: 189000,
  },
  {
    label: "Apr",
    bookings: 474,
    revenue: 212000,
  },
  {
    label: "May",
    bookings: 512,
    revenue: 234000,
  },
  {
    label: "Jun",
    bookings: 548,
    revenue: 251000,
  },
  {
    label: "Jul",
    bookings: 592,
    revenue: 278000,
  },
  {
    label: "Aug",
    bookings: 631,
    revenue: 301000,
  },
  {
    label: "Sep",
    bookings: 537,
    revenue: 243200,
  },
];

const serviceReports: ServiceReport[] = [
  {
    id: 1,
    name: "Home Cleaning",
    bookings: 486,
    revenue: 242514,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Electrician",
    bookings: 418,
    revenue: 124982,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Plumber",
    bookings: 392,
    revenue: 136808,
    rating: 4.9,
  },
  {
    id: 4,
    name: "AC Repair",
    bookings: 365,
    revenue: 163885,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Washing Machine Repair",
    bookings: 348,
    revenue: 225504,
    rating: 5,
  },
];

const providerReports: ProviderReport[] = [
  {
    id: 5,
    name: "Rahul Provider",
    profession: "Appliance Technician",
    jobs: 109,
    revenue: 58300,
    rating: 5,
  },
  {
    id: 2,
    name: "Amit Sharma",
    profession: "Home Service Expert",
    jobs: 84,
    revenue: 46900,
    rating: 4.8,
  },
  {
    id: 4,
    name: "Vikas Kumar",
    profession: "Plumber",
    jobs: 73,
    revenue: 34800,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Rohit Verma",
    profession: "Electrician",
    jobs: 61,
    revenue: 28700,
    rating: 4.7,
  },
];

const bookingStatus = {
  completed: 2864,
  active: 476,
  pending: 298,
  cancelled: 204,
};

function formatCurrency(
  amount: number
) {
  if (amount >= 100000) {
    return `₹${(
      amount / 100000
    ).toFixed(2)}L`;
  }

  if (amount >= 1000) {
    return `₹${(
      amount / 1000
    ).toFixed(1)}K`;
  }

  return `₹${amount}`;
}

function StatCard({
  icon,
  title,
  value,
  subtext,
}: {
  icon: string;
  title: string;
  value: string;
  subtext: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 180,
        flexBasis: 220,
        flexGrow: 1,
      }}
    >
      <View className="flex-row items-center">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
          <Text className="text-xl">
            {icon}
          </Text>
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-sm text-slate-500">
            {title}
          </Text>

          <Text className="mt-1 text-2xl font-black text-slate-900">
            {value}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-xs text-slate-400">
        {subtext}
      </Text>
    </View>
  );
}

export default function AdminReportsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [period, setPeriod] =
    useState<ReportPeriod>(
      "month"
    );

  const chartData =
    useMemo(() => {
      if (period === "week") {
        return weekData;
      }

      if (period === "year") {
        return yearData;
      }

      return monthData;
    }, [period]);

  const totalBookings =
    chartData.reduce(
      (sum, item) =>
        sum + item.bookings,
      0
    );

  const totalRevenue =
    chartData.reduce(
      (sum, item) =>
        sum + item.revenue,
      0
    );

  const averageBookingValue =
    totalBookings > 0
      ? Math.round(
        totalRevenue /
        totalBookings
      )
      : 0;

  const maxBookings =
    Math.max(
      ...chartData.map(
        (item) =>
          item.bookings
      )
    );

  const maxRevenue =
    Math.max(
      ...chartData.map(
        (item) =>
          item.revenue
      )
    );

  const totalStatusBookings =
    bookingStatus.completed +
    bookingStatus.active +
    bookingStatus.pending +
    bookingStatus.cancelled;

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className={
          isDesktop
            ? "flex-1 flex-row"
            : "flex-1"
        }
      >
        {/* SIDEBAR */}
        {isDesktop && (
          <View
            className="border-r border-slate-200 bg-white px-5 py-6"
            style={{
              width: 250,
            }}
          >
            <Pressable
              onPress={() =>
                router.replace(
                  "/admin"
                )
              }
              className="mb-8 flex-row items-center px-2"
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Text className="text-lg font-black text-white">
                  S
                </Text>
              </View>

              <View className="ml-3">
                <Text className="text-xl font-black text-slate-900">
                  ServiGo
                </Text>

                <Text className="text-xs font-semibold text-slate-400">
                  Admin Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/admin/reports";

                  return (
                    <Pressable
                      key={
                        item.label
                      }
                      onPress={() =>
                        router.push(
                          item.route
                        )
                      }
                      className={
                        active
                          ? "flex-row items-center rounded-xl bg-blue-50 px-4 py-4"
                          : "flex-row items-center rounded-xl px-4 py-4"
                      }
                    >
                      <View className="w-8 items-center">
                        <Text className="text-xl">
                          {
                            item.icon
                          }
                        </Text>
                      </View>

                      <Text
                        className={
                          active
                            ? "ml-3 font-bold text-blue-700"
                            : "ml-3 font-semibold text-slate-600"
                        }
                      >
                        {
                          item.label
                        }
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* MAIN */}
        <View className="flex-1">
          {/* HEADER */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {isDesktop ? (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Reports
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Platform analytics
                    and performance
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                  <Text className="font-bold text-white">
                    AD
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Admin
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Administrator
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {!isDesktop && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mt-4"
              >
                <View className="flex-row gap-2">
                  {sidebarItems.map(
                    (item) => {
                      const active =
                        item.route ===
                        "/admin/reports";

                      return (
                        <Pressable
                          key={
                            item.label
                          }
                          onPress={() =>
                            router.push(
                              item.route
                            )
                          }
                          className={
                            active
                              ? "rounded-full bg-blue-600 px-4 py-2.5"
                              : "rounded-full border border-slate-200 bg-white px-4 py-2.5"
                          }
                        >
                          <Text
                            className={
                              active
                                ? "font-semibold text-white"
                                : "font-semibold text-slate-600"
                            }
                          >
                            {
                              item.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 60,
            }}
          >
            <View className="p-5 md:p-8">
              {/* TITLE */}
              <View className="mb-6 flex-row flex-wrap items-end justify-between gap-4">
                <View>
                  <Text className="text-3xl font-black text-slate-900">
                    Reports & Analytics
                  </Text>

                  <Text className="mt-2 text-slate-500">
                    Monitor bookings,
                    revenue and platform
                    performance.
                  </Text>
                </View>

                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() =>
                      setPeriod(
                        "week"
                      )
                    }
                    className={
                      period === "week"
                        ? "rounded-xl bg-blue-600 px-5 py-3"
                        : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        period === "week"
                          ? "font-bold text-white"
                          : "font-semibold text-slate-600"
                      }
                    >
                      Week
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      setPeriod(
                        "month"
                      )
                    }
                    className={
                      period === "month"
                        ? "rounded-xl bg-blue-600 px-5 py-3"
                        : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        period === "month"
                          ? "font-bold text-white"
                          : "font-semibold text-slate-600"
                      }
                    >
                      Month
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      setPeriod(
                        "year"
                      )
                    }
                    className={
                      period === "year"
                        ? "rounded-xl bg-blue-600 px-5 py-3"
                        : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        period === "year"
                          ? "font-bold text-white"
                          : "font-semibold text-slate-600"
                      }
                    >
                      Year
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="📅"
                  title="Bookings"
                  value={totalBookings.toLocaleString(
                    "en-IN"
                  )}
                  subtext="Selected period"
                />

                <StatCard
                  icon="₹"
                  title="Revenue"
                  value={formatCurrency(
                    totalRevenue
                  )}
                  subtext="Gross revenue"
                />

                <StatCard
                  icon="💳"
                  title="Avg. Booking Value"
                  value={`₹${averageBookingValue}`}
                  subtext="Per booking"
                />

                <StatCard
                  icon="👥"
                  title="Total Users"
                  value="1,248"
                  subtext="Registered accounts"
                />

                <StatCard
                  icon="🧑‍🔧"
                  title="Providers"
                  value="186"
                  subtext="Platform providers"
                />
              </View>

              {/* CHARTS */}
              <View className="flex-row flex-wrap gap-5">
                {/* BOOKINGS */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 300,
                    flexBasis: 570,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Booking Performance
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Bookings in selected
                    period
                  </Text>

                  <ScrollView
                    horizontal={
                      period === "year"
                    }
                    showsHorizontalScrollIndicator={
                      false
                    }
                    className="mt-8"
                  >
                    <View
                      className="flex-row items-end gap-3"
                      style={{
                        minWidth:
                          period ===
                            "year"
                            ? 700
                            : undefined,
                        width:
                          period ===
                            "year"
                            ? undefined
                            : "100%",
                      }}
                    >
                      {chartData.map(
                        (item) => {
                          const barHeight =
                            Math.max(
                              35,
                              Math.round(
                                (item.bookings /
                                  maxBookings) *
                                180
                              )
                            );

                          return (
                            <View
                              key={
                                item.label
                              }
                              className="flex-1 items-center"
                              style={{
                                minWidth: 48,
                              }}
                            >
                              <Text className="mb-2 text-xs font-semibold text-slate-500">
                                {
                                  item.bookings
                                }
                              </Text>

                              <View
                                className="w-10 rounded-t-xl bg-blue-500"
                                style={{
                                  height:
                                    barHeight,
                                }}
                              />

                              <Text className="mt-2 text-xs font-semibold text-slate-400">
                                {
                                  item.label
                                }
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </ScrollView>
                </View>

                {/* REVENUE */}
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 300,
                    flexBasis: 570,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Revenue Performance
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    Revenue in selected
                    period
                  </Text>

                  <ScrollView
                    horizontal={
                      period === "year"
                    }
                    showsHorizontalScrollIndicator={
                      false
                    }
                    className="mt-8"
                  >
                    <View
                      className="flex-row items-end gap-3"
                      style={{
                        minWidth:
                          period ===
                            "year"
                            ? 700
                            : undefined,
                        width:
                          period ===
                            "year"
                            ? undefined
                            : "100%",
                      }}
                    >
                      {chartData.map(
                        (item) => {
                          const barHeight =
                            Math.max(
                              35,
                              Math.round(
                                (item.revenue /
                                  maxRevenue) *
                                180
                              )
                            );

                          return (
                            <View
                              key={
                                item.label
                              }
                              className="flex-1 items-center"
                              style={{
                                minWidth: 48,
                              }}
                            >
                              <Text className="mb-2 text-xs font-semibold text-slate-500">
                                {formatCurrency(
                                  item.revenue
                                )}
                              </Text>

                              <View
                                className="w-10 rounded-t-xl bg-green-500"
                                style={{
                                  height:
                                    barHeight,
                                }}
                              />

                              <Text className="mt-2 text-xs font-semibold text-slate-400">
                                {
                                  item.label
                                }
                              </Text>
                            </View>
                          );
                        }
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>

              {/* BOOKING STATUS */}
              <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
                <Text className="text-lg font-bold text-slate-900">
                  Booking Status Overview
                </Text>

                <Text className="mt-1 text-sm text-slate-500">
                  Overall platform
                  booking distribution
                </Text>

                <View className="mt-6 h-5 flex-row overflow-hidden rounded-full">
                  <View
                    className="bg-green-500"
                    style={{
                      flex:
                        bookingStatus.completed,
                    }}
                  />

                  <View
                    className="bg-blue-500"
                    style={{
                      flex:
                        bookingStatus.active,
                    }}
                  />

                  <View
                    className="bg-amber-400"
                    style={{
                      flex:
                        bookingStatus.pending,
                    }}
                  />

                  <View
                    className="bg-red-500"
                    style={{
                      flex:
                        bookingStatus.cancelled,
                    }}
                  />
                </View>

                <View className="mt-6 flex-row flex-wrap gap-4">
                  <View
                    className="rounded-xl bg-green-50 p-4"
                    style={{
                      minWidth: 150,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-sm font-semibold text-green-700">
                      Completed
                    </Text>

                    <Text className="mt-2 text-2xl font-black text-slate-900">
                      {
                        bookingStatus.completed
                      }
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      {Math.round(
                        (bookingStatus.completed /
                          totalStatusBookings) *
                        100
                      )}
                      %
                    </Text>
                  </View>

                  <View
                    className="rounded-xl bg-blue-50 p-4"
                    style={{
                      minWidth: 150,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-sm font-semibold text-blue-700">
                      Active
                    </Text>

                    <Text className="mt-2 text-2xl font-black text-slate-900">
                      {
                        bookingStatus.active
                      }
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      {Math.round(
                        (bookingStatus.active /
                          totalStatusBookings) *
                        100
                      )}
                      %
                    </Text>
                  </View>

                  <View
                    className="rounded-xl bg-amber-50 p-4"
                    style={{
                      minWidth: 150,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-sm font-semibold text-amber-700">
                      Pending
                    </Text>

                    <Text className="mt-2 text-2xl font-black text-slate-900">
                      {
                        bookingStatus.pending
                      }
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      {Math.round(
                        (bookingStatus.pending /
                          totalStatusBookings) *
                        100
                      )}
                      %
                    </Text>
                  </View>

                  <View
                    className="rounded-xl bg-red-50 p-4"
                    style={{
                      minWidth: 150,
                      flexGrow: 1,
                    }}
                  >
                    <Text className="text-sm font-semibold text-red-700">
                      Cancelled
                    </Text>

                    <Text className="mt-2 text-2xl font-black text-slate-900">
                      {
                        bookingStatus.cancelled
                      }
                    </Text>

                    <Text className="mt-1 text-xs text-slate-400">
                      {Math.round(
                        (bookingStatus.cancelled /
                          totalStatusBookings) *
                        100
                      )}
                      %
                    </Text>
                  </View>
                </View>
              </View>

              {/* SERVICE REPORT */}
              <View className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Service Performance
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Top performing
                      services
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/services"
                      )
                    }
                  >
                    <Text className="font-semibold text-blue-600">
                      Manage Services
                    </Text>
                  </Pressable>
                </View>

                {serviceReports.map(
                  (
                    service,
                    index
                  ) => (
                    <View
                      key={
                        service.id
                      }
                      className={
                        index !==
                          serviceReports.length -
                          1
                          ? "border-b border-slate-100 px-5 py-5"
                          : "px-5 py-5"
                      }
                    >
                      <View className="flex-row flex-wrap items-center gap-4">
                        <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                          <Text className="text-xl">
                            🛠️
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 180,
                            flexBasis: 260,
                            flexGrow: 1,
                          }}
                        >
                          <Text className="font-bold text-slate-900">
                            {
                              service.name
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Service #
                            {
                              service.id
                            }
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 100,
                          }}
                        >
                          <Text className="font-black text-slate-900">
                            {
                              service.bookings
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Bookings
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 120,
                          }}
                        >
                          <Text className="font-black text-green-600">
                            {formatCurrency(
                              service.revenue
                            )}
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Revenue
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 90,
                          }}
                        >
                          <Text className="font-bold text-slate-900">
                            ⭐{" "}
                            {
                              service.rating
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Rating
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                )}
              </View>

              {/* PROVIDER REPORT */}
              <View className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row items-center justify-between border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Provider Performance
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Top provider
                      activity
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      router.push(
                        "/admin/providers"
                      )
                    }
                  >
                    <Text className="font-semibold text-blue-600">
                      Manage Providers
                    </Text>
                  </Pressable>
                </View>

                {providerReports.map(
                  (
                    provider,
                    index
                  ) => (
                    <View
                      key={
                        provider.id
                      }
                      className={
                        index !==
                          providerReports.length -
                          1
                          ? "border-b border-slate-100 px-5 py-5"
                          : "px-5 py-5"
                      }
                    >
                      <View className="flex-row flex-wrap items-center gap-4">
                        <View className="h-11 w-11 items-center justify-center rounded-full bg-violet-50">
                          <Text className="font-bold text-violet-700">
                            {provider.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .slice(
                                0,
                                2
                              )
                              .join("")}
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 180,
                            flexBasis: 260,
                            flexGrow: 1,
                          }}
                        >
                          <Text className="font-bold text-slate-900">
                            {
                              provider.name
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            {
                              provider.profession
                            }
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 90,
                          }}
                        >
                          <Text className="font-black text-slate-900">
                            {
                              provider.jobs
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Jobs
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 120,
                          }}
                        >
                          <Text className="font-black text-green-600">
                            {formatCurrency(
                              provider.revenue
                            )}
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Earnings
                          </Text>
                        </View>

                        <View
                          style={{
                            minWidth: 90,
                          }}
                        >
                          <Text className="font-bold text-slate-900">
                            ⭐{" "}
                            {
                              provider.rating
                            }
                          </Text>

                          <Text className="mt-1 text-xs text-slate-400">
                            Rating
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}