import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type Period =
  | "week"
  | "month"
  | "year";

type TransactionStatus =
  | "paid"
  | "pending";

type Transaction = {
  id: number;
  bookingId: number;
  customerName: string;
  serviceName: string;
  date: string;
  amount: number;
  platformFee: number;
  earning: number;
  status: TransactionStatus;
};

const sidebarItems = [
  {
    label: "Dashboard",
    icon: "▦",
    route: "/provider",
  },
  {
    label: "Bookings",
    icon: "📅",
    route: "/provider/bookings",
  },
  {
    label: "My Services",
    icon: "🛠️",
    route: "/provider/services",
  },
  {
    label: "Availability",
    icon: "🕒",
    route: "/provider/availability",
  },
  {
    label: "Earnings",
    icon: "₹",
    route: "/provider/earnings",
  },
  {
    label: "Reviews",
    icon: "⭐",
    route: "/provider/reviews",
  },
  {
    label: "Profile",
    icon: "👤",
    route: "/provider/profile",
  },
] as const;

const weekData = [
  {
    label: "Mon",
    amount: 1200,
  },
  {
    label: "Tue",
    amount: 2200,
  },
  {
    label: "Wed",
    amount: 1700,
  },
  {
    label: "Thu",
    amount: 2900,
  },
  {
    label: "Fri",
    amount: 2500,
  },
  {
    label: "Sat",
    amount: 3600,
  },
  {
    label: "Sun",
    amount: 3100,
  },
];

const monthData = [
  {
    label: "W1",
    amount: 12500,
  },
  {
    label: "W2",
    amount: 15800,
  },
  {
    label: "W3",
    amount: 17200,
  },
  {
    label: "W4",
    amount: 14300,
  },
];

const yearData = [
  {
    label: "Jan",
    amount: 41000,
  },
  {
    label: "Feb",
    amount: 46200,
  },
  {
    label: "Mar",
    amount: 51800,
  },
  {
    label: "Apr",
    amount: 48400,
  },
  {
    label: "May",
    amount: 57600,
  },
  {
    label: "Jun",
    amount: 62500,
  },
  {
    label: "Jul",
    amount: 68100,
  },
  {
    label: "Aug",
    amount: 70400,
  },
  {
    label: "Sep",
    amount: 58300,
  },
];

const transactions: Transaction[] = [
  {
    id: 1,
    bookingId: 1003,
    customerName: "Neha Verma",
    serviceName:
      "Washing Machine Repair",
    date: "17 Sep 2026",
    amount: 599,
    platformFee: 60,
    earning: 539,
    status: "paid",
  },
  {
    id: 2,
    bookingId: 1004,
    customerName: "Karan Singh",
    serviceName:
      "Appliance Inspection",
    date: "17 Sep 2026",
    amount: 399,
    platformFee: 40,
    earning: 359,
    status: "paid",
  },
  {
    id: 3,
    bookingId: 1007,
    customerName: "Pooja Mehta",
    serviceName:
      "Washing Machine Repair",
    date: "16 Sep 2026",
    amount: 599,
    platformFee: 60,
    earning: 539,
    status: "paid",
  },
  {
    id: 4,
    bookingId: 1008,
    customerName: "Deepak Jain",
    serviceName:
      "Installation Service",
    date: "15 Sep 2026",
    amount: 499,
    platformFee: 50,
    earning: 449,
    status: "paid",
  },
  {
    id: 5,
    bookingId: 1009,
    customerName: "Anjali Sharma",
    serviceName:
      "Appliance Inspection",
    date: "14 Sep 2026",
    amount: 399,
    platformFee: 40,
    earning: 359,
    status: "pending",
  },
];

function formatCurrency(
  amount: number
) {
  return `₹${amount.toLocaleString(
    "en-IN"
  )}`;
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

export default function ProviderEarningsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [period, setPeriod] =
    useState<Period>("week");

  const chartData =
    useMemo(() => {
      if (period === "month") {
        return monthData;
      }

      if (period === "year") {
        return yearData;
      }

      return weekData;
    }, [period]);

  const maxAmount =
    Math.max(
      ...chartData.map(
        (item) => item.amount
      )
    );

  const totalChartAmount =
    chartData.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );

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
                  "/provider"
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
                  Provider Panel
                </Text>
              </View>
            </Pressable>

            <View className="gap-1">
              {sidebarItems.map(
                (item) => {
                  const active =
                    item.route ===
                    "/provider/earnings";

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
          {/* TOPBAR */}
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {isDesktop ? (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Earnings
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Track your income
                    and payouts
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              <Pressable
                onPress={() =>
                  router.push(
                    "/provider/profile"
                  )
                }
                className="flex-row items-center"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Text className="font-bold text-blue-700">
                    RP
                  </Text>
                </View>

                {isDesktop && (
                  <View className="ml-3">
                    <Text className="font-bold text-slate-900">
                      Rahul Provider
                    </Text>

                    <Text className="text-xs text-slate-400">
                      Appliance Technician
                    </Text>
                  </View>
                )}
              </Pressable>
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
                        "/provider/earnings";

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
              <View className="mb-6">
                <Text className="text-3xl font-black text-slate-900">
                  Earnings
                </Text>

                <Text className="mt-2 text-slate-500">
                  Track completed service
                  earnings and payouts.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="₹"
                  title="Total Earnings"
                  value="₹58,300"
                  subtext="September 2026"
                />

                <StatCard
                  icon="📈"
                  title="This Week"
                  value="₹17,200"
                  subtext="+18% from last week"
                />

                <StatCard
                  icon="💰"
                  title="Available Balance"
                  value="₹12,450"
                  subtext="Ready for payout"
                />

                <StatCard
                  icon="⏳"
                  title="Pending"
                  value="₹1,348"
                  subtext="Processing earnings"
                />
              </View>

              {/* EARNINGS CHART */}
              <View className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
                <View className="flex-row flex-wrap items-center justify-between gap-4">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Earnings Overview
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      {formatCurrency(
                        totalChartAmount
                      )}{" "}
                      earned in selected
                      period
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
                          ? "rounded-lg bg-blue-600 px-4 py-2.5"
                          : "rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                      }
                    >
                      <Text
                        className={
                          period ===
                            "week"
                            ? "text-sm font-bold text-white"
                            : "text-sm font-semibold text-slate-600"
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
                        period ===
                          "month"
                          ? "rounded-lg bg-blue-600 px-4 py-2.5"
                          : "rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                      }
                    >
                      <Text
                        className={
                          period ===
                            "month"
                            ? "text-sm font-bold text-white"
                            : "text-sm font-semibold text-slate-600"
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
                        period ===
                          "year"
                          ? "rounded-lg bg-blue-600 px-4 py-2.5"
                          : "rounded-lg border border-slate-200 bg-white px-4 py-2.5"
                      }
                    >
                      <Text
                        className={
                          period ===
                            "year"
                            ? "text-sm font-bold text-white"
                            : "text-sm font-semibold text-slate-600"
                        }
                      >
                        Year
                      </Text>
                    </Pressable>
                  </View>
                </View>

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
                        period === "year"
                          ? 760
                          : undefined,
                      width:
                        period === "year"
                          ? undefined
                          : "100%",
                    }}
                  >
                    {chartData.map(
                      (item) => {
                        const height =
                          Math.max(
                            40,
                            Math.round(
                              (item.amount /
                                maxAmount) *
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
                              minWidth: 52,
                            }}
                          >
                            <Text className="mb-2 text-xs font-semibold text-slate-500">
                              {item.amount >=
                                1000
                                ? `₹${(
                                  item.amount /
                                  1000
                                ).toFixed(
                                  1
                                )}K`
                                : `₹${item.amount}`}
                            </Text>

                            <View
                              className="w-10 rounded-t-xl bg-blue-500"
                              style={{
                                height,
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

              <View className="flex-row flex-wrap gap-5">
                {/* TRANSACTIONS */}
                <View
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  style={{
                    minWidth: 290,
                    flexBasis: 720,
                    flexGrow: 2,
                  }}
                >
                  <View className="border-b border-slate-100 px-5 py-5">
                    <Text className="text-lg font-bold text-slate-900">
                      Recent Earnings
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Earnings from
                      completed services
                    </Text>
                  </View>

                  {transactions.map(
                    (
                      transaction,
                      index
                    ) => (
                      <Pressable
                        key={
                          transaction.id
                        }
                        onPress={() =>
                          router.push({
                            pathname:
                              "/provider/bookings/[bookingId]",
                            params: {
                              bookingId:
                                String(
                                  transaction.bookingId
                                ),
                            },
                          })
                        }
                        className={
                          index !==
                            transactions.length -
                            1
                            ? "border-b border-slate-100 px-5 py-5"
                            : "px-5 py-5"
                        }
                      >
                        <View className="flex-row flex-wrap items-center gap-4">
                          <View className="h-11 w-11 items-center justify-center rounded-full bg-green-50">
                            <Text className="font-bold text-green-700">
                              ₹
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 170,
                              flexBasis: 220,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="font-bold text-slate-900">
                              {
                                transaction.serviceName
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              {
                                transaction.customerName
                              }{" "}
                              • Booking #
                              {
                                transaction.bookingId
                              }
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 105,
                            }}
                          >
                            <Text className="text-sm font-semibold text-slate-700">
                              {
                                transaction.date
                              }
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              Service date
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 95,
                            }}
                          >
                            <Text className="text-sm text-slate-500">
                              {formatCurrency(
                                transaction.amount
                              )}
                            </Text>

                            <Text className="mt-1 text-xs text-red-400">
                              -
                              {formatCurrency(
                                transaction.platformFee
                              )}{" "}
                              fee
                            </Text>
                          </View>

                          <View
                            style={{
                              minWidth: 95,
                            }}
                          >
                            <Text className="font-black text-slate-900">
                              {formatCurrency(
                                transaction.earning
                              )}
                            </Text>

                            <Text className="mt-1 text-xs text-slate-400">
                              Your earning
                            </Text>
                          </View>

                          <View
                            className={
                              transaction.status ===
                                "paid"
                                ? "rounded-full bg-green-50 px-3 py-1.5"
                                : "rounded-full bg-amber-50 px-3 py-1.5"
                            }
                          >
                            <Text
                              className={
                                transaction.status ===
                                  "paid"
                                  ? "text-xs font-bold text-green-700"
                                  : "text-xs font-bold text-amber-700"
                              }
                            >
                              {transaction.status ===
                                "paid"
                                ? "Paid"
                                : "Pending"}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    )
                  )}
                </View>

                {/* PAYOUT */}
                <View
                  style={{
                    minWidth: 280,
                    flexBasis: 340,
                    flexGrow: 1,
                  }}
                >
                  <View className="rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Payout Summary
                    </Text>

                    <View className="mt-5 rounded-2xl bg-slate-900 p-5">
                      <Text className="text-sm text-slate-300">
                        Available Balance
                      </Text>

                      <Text className="mt-2 text-3xl font-black text-white">
                        ₹12,450
                      </Text>

                      <Text className="mt-2 text-xs text-slate-400">
                        Eligible for next
                        payout
                      </Text>
                    </View>

                    <View className="mt-5">
                      <View className="flex-row justify-between border-b border-slate-100 py-3">
                        <Text className="text-sm text-slate-500">
                          Last Payout
                        </Text>

                        <Text className="font-bold text-slate-900">
                          ₹8,750
                        </Text>
                      </View>

                      <View className="flex-row justify-between border-b border-slate-100 py-3">
                        <Text className="text-sm text-slate-500">
                          Payout Date
                        </Text>

                        <Text className="font-semibold text-slate-900">
                          15 Sep 2026
                        </Text>
                      </View>

                      <View className="flex-row justify-between py-3">
                        <Text className="text-sm text-slate-500">
                          Status
                        </Text>

                        <Text className="font-bold text-green-600">
                          Completed
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
                    <Text className="text-lg font-bold text-slate-900">
                      Earnings Summary
                    </Text>

                    <View className="mt-5 gap-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-slate-500">
                          Completed Jobs
                        </Text>

                        <Text className="font-black text-slate-900">
                          109
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-slate-500">
                          Gross Earnings
                        </Text>

                        <Text className="font-black text-slate-900">
                          ₹64,780
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-slate-500">
                          Platform Fees
                        </Text>

                        <Text className="font-black text-red-500">
                          -₹6,480
                        </Text>
                      </View>

                      <View className="border-t border-slate-100 pt-4">
                        <View className="flex-row items-center justify-between">
                          <Text className="font-bold text-slate-900">
                            Net Earnings
                          </Text>

                          <Text className="text-xl font-black text-green-600">
                            ₹58,300
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}