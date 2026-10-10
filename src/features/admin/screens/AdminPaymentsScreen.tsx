import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type PaymentStatus =
  | "paid"
  | "pending"
  | "refunded"
  | "failed";

type PaymentMethod =
  | "UPI"
  | "Card"
  | "Net Banking"
  | "Cash";

type PaymentFilter =
  | "all"
  | PaymentStatus;

type Payment = {
  id: string;
  bookingId: number;
  customerName: string;
  providerName: string;
  serviceName: string;
  amount: number;
  platformFee: number;
  providerAmount: number;
  method: PaymentMethod;
  date: string;
  time: string;
  status: PaymentStatus;
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

const initialPayments: Payment[] = [
  {
    id: "PAY-10001",
    bookingId: 1001,
    customerName: "Aman Sharma",
    providerName: "Rahul Provider",
    serviceName: "Washing Machine Repair",
    amount: 648,
    platformFee: 65,
    providerAmount: 583,
    method: "UPI",
    date: "20 Sep 2026",
    time: "09:42 AM",
    status: "paid",
  },
  {
    id: "PAY-10002",
    bookingId: 1002,
    customerName: "Rohit Jain",
    providerName: "Rahul Provider",
    serviceName: "Appliance Inspection",
    amount: 448,
    platformFee: 45,
    providerAmount: 403,
    method: "Card",
    date: "20 Sep 2026",
    time: "10:15 AM",
    status: "pending",
  },
  {
    id: "PAY-10003",
    bookingId: 1003,
    customerName: "Neha Verma",
    providerName: "Amit Sharma",
    serviceName: "Home Cleaning",
    amount: 548,
    platformFee: 55,
    providerAmount: 493,
    method: "UPI",
    date: "17 Sep 2026",
    time: "03:48 PM",
    status: "paid",
  },
  {
    id: "PAY-10004",
    bookingId: 1004,
    customerName: "Karan Singh",
    providerName: "Vikas Kumar",
    serviceName: "Plumber",
    amount: 348,
    platformFee: 35,
    providerAmount: 313,
    method: "Net Banking",
    date: "18 Sep 2026",
    time: "12:20 PM",
    status: "paid",
  },
  {
    id: "PAY-10005",
    bookingId: 1005,
    customerName: "Pooja Mehta",
    providerName: "Sandeep Singh",
    serviceName: "AC Repair",
    amount: 448,
    platformFee: 45,
    providerAmount: 403,
    method: "UPI",
    date: "16 Sep 2026",
    time: "05:12 PM",
    status: "refunded",
  },
  {
    id: "PAY-10006",
    bookingId: 1006,
    customerName: "Deepak Sharma",
    providerName: "Rohit Verma",
    serviceName: "Electrician",
    amount: 298,
    platformFee: 30,
    providerAmount: 268,
    method: "Card",
    date: "18 Sep 2026",
    time: "06:05 PM",
    status: "failed",
  },
  {
    id: "PAY-10007",
    bookingId: 1007,
    customerName: "Anjali Jain",
    providerName: "Manoj Sharma",
    serviceName: "Painting",
    amount: 1048,
    platformFee: 105,
    providerAmount: 943,
    method: "UPI",
    date: "18 Sep 2026",
    time: "07:30 PM",
    status: "paid",
  },
];

const filters: {
  label: string;
  value: PaymentFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Paid",
      value: "paid",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Refunded",
      value: "refunded",
    },
    {
      label: "Failed",
      value: "failed",
    },
  ];

function formatCurrency(
  amount: number
) {
  return `₹${amount.toLocaleString(
    "en-IN"
  )}`;
}

function getStatusStyle(
  status: PaymentStatus
) {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        wrapper:
          "border-green-200 bg-green-50",
        text: "text-green-700",
      };

    case "pending":
      return {
        label: "Pending",
        wrapper:
          "border-amber-200 bg-amber-50",
        text: "text-amber-700",
      };

    case "refunded":
      return {
        label: "Refunded",
        wrapper:
          "border-slate-200 bg-slate-100",
        text: "text-slate-600",
      };

    case "failed":
      return {
        label: "Failed",
        wrapper:
          "border-red-200 bg-red-50",
        text: "text-red-700",
      };
  }
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: string;
  label: string;
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
            {label}
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

export default function AdminPaymentsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [payments, setPayments] =
    useState<Payment[]>(
      initialPayments
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<PaymentFilter>(
      "all"
    );

  const filteredPayments =
    useMemo(() => {
      let result = [
        ...payments,
      ];

      if (filter !== "all") {
        result =
          result.filter(
            (payment) =>
              payment.status ===
              filter
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (payment) =>
              [
                payment.id,
                payment.bookingId,
                payment.customerName,
                payment.providerName,
                payment.serviceName,
                payment.method,
                payment.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      payments,
      search,
      filter,
    ]);

  const totalProcessed =
    payments
      .filter(
        (payment) =>
          payment.status ===
          "paid"
      )
      .reduce(
        (total, payment) =>
          total +
          payment.amount,
        0
      );

  const platformRevenue =
    payments
      .filter(
        (payment) =>
          payment.status ===
          "paid"
      )
      .reduce(
        (total, payment) =>
          total +
          payment.platformFee,
        0
      );

  const providerPayouts =
    payments
      .filter(
        (payment) =>
          payment.status ===
          "paid"
      )
      .reduce(
        (total, payment) =>
          total +
          payment.providerAmount,
        0
      );

  const refundAmount =
    payments
      .filter(
        (payment) =>
          payment.status ===
          "refunded"
      )
      .reduce(
        (total, payment) =>
          total +
          payment.amount,
        0
      );

  const pendingCount =
    payments.filter(
      (payment) =>
        payment.status ===
        "pending"
    ).length;

  const handleRefund = (
    paymentId: string
  ) => {
    setPayments(
      (current) =>
        current.map(
          (payment) =>
            payment.id ===
              paymentId
              ? {
                ...payment,
                status:
                  "refunded",
              }
              : payment
        )
    );
  };

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
                    "/admin/payments";

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
                    Payments
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage transactions
                    and refunds
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
                        "/admin/payments";

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
                  Payments
                </Text>

                <Text className="mt-2 text-slate-500">
                  Track customer
                  payments, provider
                  payouts and refunds.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="₹"
                  label="Total Processed"
                  value={formatCurrency(
                    totalProcessed
                  )}
                  subtext="Successful payments"
                />

                <StatCard
                  icon="💰"
                  label="Platform Revenue"
                  value={formatCurrency(
                    platformRevenue
                  )}
                  subtext="Platform fees collected"
                />

                <StatCard
                  icon="🧑‍🔧"
                  label="Provider Payouts"
                  value={formatCurrency(
                    providerPayouts
                  )}
                  subtext="Provider earnings"
                />

                <StatCard
                  icon="↩"
                  label="Refunded"
                  value={formatCurrency(
                    refundAmount
                  )}
                  subtext="Refund amount"
                />

                <StatCard
                  icon="⏳"
                  label="Pending"
                  value={String(
                    pendingCount
                  )}
                  subtext="Payments processing"
                />
              </View>

              {/* SEARCH */}
              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={
                      setSearch
                    }
                    placeholder="Search payment, booking, customer or provider"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* FILTERS */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mb-5"
              >
                <View className="flex-row gap-2">
                  {filters.map(
                    (item) => {
                      const selected =
                        filter ===
                        item.value;

                      return (
                        <Pressable
                          key={
                            item.value
                          }
                          onPress={() =>
                            setFilter(
                              item.value
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
                              item.label
                            }
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>
              </ScrollView>

              {/* PAYMENT LIST */}
              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="border-b border-slate-100 px-5 py-5">
                  <Text className="text-lg font-bold text-slate-900">
                    Transactions
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {
                      filteredPayments.length
                    }{" "}
                    transactions found
                  </Text>
                </View>

                {filteredPayments.length >
                  0 ? (
                  filteredPayments.map(
                    (
                      payment,
                      index
                    ) => {
                      const status =
                        getStatusStyle(
                          payment.status
                        );

                      return (
                        <View
                          key={
                            payment.id
                          }
                          className={
                            index !==
                              filteredPayments.length -
                              1
                              ? "border-b border-slate-100 px-5 py-5"
                              : "px-5 py-5"
                          }
                        >
                          <View className="flex-row flex-wrap items-center gap-4">
                            {/* PAYMENT ID */}
                            <View
                              style={{
                                minWidth: 115,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                {
                                  payment.id
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Booking #
                                {
                                  payment.bookingId
                                }
                              </Text>
                            </View>

                            {/* CUSTOMER */}
                            <View
                              style={{
                                minWidth: 150,
                                flexBasis: 180,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-bold text-slate-900">
                                {
                                  payment.customerName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Customer
                              </Text>
                            </View>

                            {/* SERVICE */}
                            <View
                              style={{
                                minWidth: 170,
                                flexBasis: 210,
                                flexGrow: 1,
                              }}
                            >
                              <Text className="font-semibold text-slate-800">
                                {
                                  payment.serviceName
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-blue-600">
                                {
                                  payment.providerName
                                }
                              </Text>
                            </View>

                            {/* DATE */}
                            <View
                              style={{
                                minWidth: 110,
                              }}
                            >
                              <Text className="text-sm font-semibold text-slate-700">
                                {
                                  payment.date
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                {
                                  payment.time
                                }
                              </Text>
                            </View>

                            {/* METHOD */}
                            <View
                              style={{
                                minWidth: 90,
                              }}
                            >
                              <Text className="font-semibold text-slate-700">
                                {
                                  payment.method
                                }
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Method
                              </Text>
                            </View>

                            {/* AMOUNT */}
                            <View
                              style={{
                                minWidth: 95,
                              }}
                            >
                              <Text className="font-black text-slate-900">
                                {formatCurrency(
                                  payment.amount
                                )}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Total
                              </Text>
                            </View>

                            {/* FEE */}
                            <View
                              style={{
                                minWidth: 95,
                              }}
                            >
                              <Text className="font-bold text-green-600">
                                {formatCurrency(
                                  payment.platformFee
                                )}
                              </Text>

                              <Text className="mt-1 text-xs text-slate-400">
                                Platform fee
                              </Text>
                            </View>

                            {/* STATUS */}
                            <View
                              className={`rounded-full border px-3 py-1.5 ${status.wrapper}`}
                            >
                              <Text
                                className={`text-xs font-bold ${status.text}`}
                              >
                                {
                                  status.label
                                }
                              </Text>
                            </View>

                            {/* ACTION */}
                            <View
                              style={{
                                minWidth: 120,
                              }}
                            >
                              {payment.status ===
                                "paid" ? (
                                <Pressable
                                  onPress={() =>
                                    handleRefund(
                                      payment.id
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5"
                                >
                                  <Text className="text-center text-xs font-bold text-red-600">
                                    Refund
                                  </Text>
                                </Pressable>
                              ) : (
                                <View className="rounded-lg bg-slate-50 px-3 py-2.5">
                                  <Text className="text-center text-xs font-semibold text-slate-400">
                                    No Action
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      );
                    }
                  )
                ) : (
                  <View className="items-center px-5 py-16">
                    <Text className="text-5xl">
                      ₹
                    </Text>

                    <Text className="mt-4 text-xl font-bold text-slate-900">
                      No payments found
                    </Text>

                    <Text className="mt-2 text-sm text-slate-500">
                      Change search or
                      payment filter.
                    </Text>

                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setFilter(
                          "all"
                        );
                      }}
                      className="mt-5 rounded-xl bg-blue-600 px-5 py-3"
                    >
                      <Text className="font-bold text-white">
                        Clear Filters
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>

              {/* SUMMARY */}
              <View className="mt-5 flex-row flex-wrap gap-5">
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  style={{
                    minWidth: 280,
                    flexBasis: 500,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Revenue Split
                  </Text>

                  <View className="mt-5">
                    <View className="flex-row justify-between border-b border-slate-100 py-3">
                      <Text className="text-sm text-slate-500">
                        Gross Payments
                      </Text>

                      <Text className="font-bold text-slate-900">
                        {formatCurrency(
                          totalProcessed
                        )}
                      </Text>
                    </View>

                    <View className="flex-row justify-between border-b border-slate-100 py-3">
                      <Text className="text-sm text-slate-500">
                        Provider Share
                      </Text>

                      <Text className="font-bold text-slate-900">
                        {formatCurrency(
                          providerPayouts
                        )}
                      </Text>
                    </View>

                    <View className="flex-row justify-between py-3">
                      <Text className="text-sm text-slate-500">
                        Platform Revenue
                      </Text>

                      <Text className="font-black text-green-600">
                        {formatCurrency(
                          platformRevenue
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  style={{
                    minWidth: 280,
                    flexBasis: 400,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-lg font-bold text-slate-900">
                    Payment Status
                  </Text>

                  <View className="mt-5 gap-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-slate-500">
                        Successful
                      </Text>

                      <Text className="font-black text-green-600">
                        {
                          payments.filter(
                            (item) =>
                              item.status ===
                              "paid"
                          ).length
                        }
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-slate-500">
                        Pending
                      </Text>

                      <Text className="font-black text-amber-600">
                        {
                          payments.filter(
                            (item) =>
                              item.status ===
                              "pending"
                          ).length
                        }
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-slate-500">
                        Refunded
                      </Text>

                      <Text className="font-black text-slate-600">
                        {
                          payments.filter(
                            (item) =>
                              item.status ===
                              "refunded"
                          ).length
                        }
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-slate-500">
                        Failed
                      </Text>

                      <Text className="font-black text-red-600">
                        {
                          payments.filter(
                            (item) =>
                              item.status ===
                              "failed"
                          ).length
                        }
                      </Text>
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