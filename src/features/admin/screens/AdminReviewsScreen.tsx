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

type ReviewStatus =
  | "published"
  | "hidden"
  | "reported";

type ReviewFilter =
  | "all"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1"
  | "reported"
  | "hidden";

type Review = {
  id: number;
  bookingId: number;
  customerName: string;
  customerInitials: string;
  providerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  status: ReviewStatus;
  reportReason?: string;
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

const initialReviews: Review[] = [
  {
    id: 1,
    bookingId: 1003,
    customerName: "Neha Verma",
    customerInitials: "NV",
    providerName: "Rahul Provider",
    serviceName: "Washing Machine Repair",
    rating: 5,
    comment:
      "Very professional service. The washing machine is working perfectly now.",
    date: "17 Sep 2026",
    status: "published",
  },
  {
    id: 2,
    bookingId: 1004,
    customerName: "Karan Singh",
    customerInitials: "KS",
    providerName: "Vikas Kumar",
    serviceName: "Plumber",
    rating: 5,
    comment:
      "Provider arrived on time and completed the work properly.",
    date: "17 Sep 2026",
    status: "published",
  },
  {
    id: 3,
    bookingId: 1007,
    customerName: "Pooja Mehta",
    customerInitials: "PM",
    providerName: "Amit Sharma",
    serviceName: "Home Cleaning",
    rating: 4,
    comment:
      "Good cleaning service. Overall satisfied with the work.",
    date: "16 Sep 2026",
    status: "published",
  },
  {
    id: 4,
    bookingId: 1008,
    customerName: "Deepak Jain",
    customerInitials: "DJ",
    providerName: "Rohit Verma",
    serviceName: "Electrician",
    rating: 2,
    comment:
      "Service took longer than expected and the issue needed another visit.",
    date: "15 Sep 2026",
    status: "reported",
    reportReason:
      "Provider reported inappropriate or misleading feedback.",
  },
  {
    id: 5,
    bookingId: 1009,
    customerName: "Anjali Sharma",
    customerInitials: "AS",
    providerName: "Sandeep Singh",
    serviceName: "AC Repair",
    rating: 4,
    comment:
      "Good service and clear explanation of the AC problem.",
    date: "14 Sep 2026",
    status: "published",
  },
  {
    id: 6,
    bookingId: 1010,
    customerName: "Mayank Gupta",
    customerInitials: "MG",
    providerName: "Rahul Provider",
    serviceName: "Appliance Inspection",
    rating: 5,
    comment:
      "Very helpful and professional. Recommended.",
    date: "13 Sep 2026",
    status: "published",
  },
  {
    id: 7,
    bookingId: 1011,
    customerName: "Ritika Jain",
    customerInitials: "RJ",
    providerName: "Manoj Sharma",
    serviceName: "Painting",
    rating: 1,
    comment:
      "Poor experience. Work quality was not as expected.",
    date: "12 Sep 2026",
    status: "hidden",
  },
  {
    id: 8,
    bookingId: 1012,
    customerName: "Aryan Mehta",
    customerInitials: "AM",
    providerName: "Ajay Meena",
    serviceName: "Carpenter",
    rating: 5,
    comment:
      "Excellent work and very clean finishing.",
    date: "11 Sep 2026",
    status: "published",
  },
];

const filters: {
  label: string;
  value: ReviewFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "5 Star",
      value: "5",
    },
    {
      label: "4 Star",
      value: "4",
    },
    {
      label: "3 Star",
      value: "3",
    },
    {
      label: "2 Star",
      value: "2",
    },
    {
      label: "1 Star",
      value: "1",
    },
    {
      label: "Reported",
      value: "reported",
    },
    {
      label: "Hidden",
      value: "hidden",
    },
  ];

function StarRating({
  rating,
}: {
  rating: number;
}) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <Text
            key={star}
            className={
              star <= rating
                ? "text-lg text-amber-500"
                : "text-lg text-slate-200"
            }
          >
            ★
          </Text>
        )
      )}
    </View>
  );
}

function getStatusStyle(
  status: ReviewStatus
) {
  switch (status) {
    case "published":
      return {
        label: "Published",
        wrapper:
          "border-green-200 bg-green-50",
        text: "text-green-700",
      };

    case "hidden":
      return {
        label: "Hidden",
        wrapper:
          "border-slate-200 bg-slate-100",
        text: "text-slate-600",
      };

    case "reported":
      return {
        label: "Reported",
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
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View
      className="rounded-2xl border border-slate-200 bg-white p-5"
      style={{
        minWidth: 170,
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

        <View className="ml-4">
          <Text className="text-2xl font-black text-slate-900">
            {value}
          </Text>

          <Text className="text-sm text-slate-500">
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function AdminReviewsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [reviews, setReviews] =
    useState<Review[]>(
      initialReviews
    );

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<ReviewFilter>(
      "all"
    );

  const filteredReviews =
    useMemo(() => {
      let result = [
        ...reviews,
      ];

      if (
        filter === "reported"
      ) {
        result =
          result.filter(
            (review) =>
              review.status ===
              "reported"
          );
      } else if (
        filter === "hidden"
      ) {
        result =
          result.filter(
            (review) =>
              review.status ===
              "hidden"
          );
      } else if (
        filter !== "all"
      ) {
        const rating =
          Number(filter);

        result =
          result.filter(
            (review) =>
              review.rating ===
              rating
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (review) =>
              [
                review.id,
                review.bookingId,
                review.customerName,
                review.providerName,
                review.serviceName,
                review.comment,
                review.status,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      reviews,
      search,
      filter,
    ]);

  const totalReviews =
    reviews.length;

  const publishedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "published"
    ).length;

  const reportedCount =
    reviews.filter(
      (review) =>
        review.status ===
        "reported"
    ).length;

  const hiddenCount =
    reviews.filter(
      (review) =>
        review.status ===
        "hidden"
    ).length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce(
        (sum, review) =>
          sum +
          review.rating,
        0
      ) / totalReviews
      : 0;

  const getRatingCount = (
    rating: number
  ) =>
    reviews.filter(
      (review) =>
        review.rating ===
        rating
    ).length;

  const publishReview = (
    reviewId: number
  ) => {
    setReviews(
      (current) =>
        current.map(
          (review) =>
            review.id ===
              reviewId
              ? {
                ...review,
                status:
                  "published",
                reportReason:
                  undefined,
              }
              : review
        )
    );
  };

  const hideReview = (
    reviewId: number
  ) => {
    setReviews(
      (current) =>
        current.map(
          (review) =>
            review.id ===
              reviewId
              ? {
                ...review,
                status:
                  "hidden",
              }
              : review
        )
    );
  };

  const deleteReview = (
    reviewId: number
  ) => {
    setReviews(
      (current) =>
        current.filter(
          (review) =>
            review.id !==
            reviewId
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
                    "/admin/reviews";

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
                    Reviews
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage customer feedback
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
                        "/admin/reviews";

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
                  Manage Reviews
                </Text>

                <Text className="mt-2 text-slate-500">
                  Monitor customer ratings
                  and review reports.
                </Text>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <StatCard
                  icon="⭐"
                  label="Total Reviews"
                  value={String(
                    totalReviews
                  )}
                />

                <StatCard
                  icon="★"
                  label="Average Rating"
                  value={averageRating.toFixed(
                    1
                  )}
                />

                <StatCard
                  icon="✓"
                  label="Published"
                  value={String(
                    publishedCount
                  )}
                />

                <StatCard
                  icon="⚠"
                  label="Reported"
                  value={String(
                    reportedCount
                  )}
                />

                <StatCard
                  icon="🚫"
                  label="Hidden"
                  value={String(
                    hiddenCount
                  )}
                />
              </View>

              {/* RATING BREAKDOWN */}
              <View className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
                <Text className="text-lg font-bold text-slate-900">
                  Rating Breakdown
                </Text>

                <View className="mt-5 gap-4">
                  {[5, 4, 3, 2, 1].map(
                    (rating) => {
                      const count =
                        getRatingCount(
                          rating
                        );

                      const remaining =
                        Math.max(
                          totalReviews -
                          count,
                          0
                        );

                      return (
                        <View
                          key={rating}
                          className="flex-row items-center"
                        >
                          <Text className="w-5 font-semibold text-slate-600">
                            {rating}
                          </Text>

                          <Text className="mr-3 text-amber-500">
                            ★
                          </Text>

                          <View className="h-2 flex-1 flex-row overflow-hidden rounded-full bg-slate-100">
                            {count > 0 && (
                              <View
                                className="h-full bg-amber-400"
                                style={{
                                  flex:
                                    count,
                                }}
                              />
                            )}

                            {remaining >
                              0 && (
                                <View
                                  style={{
                                    flex:
                                      remaining,
                                  }}
                                />
                              )}
                          </View>

                          <Text className="ml-3 w-8 text-right text-sm font-semibold text-slate-500">
                            {count}
                          </Text>
                        </View>
                      );
                    }
                  )}
                </View>
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
                    placeholder="Search customer, provider, service, booking or review"
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

              {/* REVIEW LIST */}
              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="border-b border-slate-100 px-5 py-5">
                  <Text className="text-lg font-bold text-slate-900">
                    Review List
                  </Text>

                  <Text className="mt-1 text-sm text-slate-500">
                    {
                      filteredReviews.length
                    }{" "}
                    reviews found
                  </Text>
                </View>

                {filteredReviews.length >
                  0 ? (
                  filteredReviews.map(
                    (
                      review,
                      index
                    ) => {
                      const status =
                        getStatusStyle(
                          review.status
                        );

                      return (
                        <View
                          key={
                            review.id
                          }
                          className={
                            index !==
                              filteredReviews.length -
                              1
                              ? "border-b border-slate-100 px-5 py-6"
                              : "px-5 py-6"
                          }
                        >
                          <View className="flex-row items-start">
                            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                              <Text className="font-bold text-blue-700">
                                {
                                  review.customerInitials
                                }
                              </Text>
                            </View>

                            <View className="ml-4 flex-1">
                              <View className="flex-row flex-wrap items-start justify-between gap-4">
                                <View
                                  style={{
                                    minWidth: 200,
                                    flexGrow: 1,
                                  }}
                                >
                                  <Text className="font-bold text-slate-900">
                                    {
                                      review.customerName
                                    }
                                  </Text>

                                  <Text className="mt-1 text-xs text-slate-400">
                                    Booking #
                                    {
                                      review.bookingId
                                    }{" "}
                                    •{" "}
                                    {
                                      review.date
                                    }
                                  </Text>
                                </View>

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
                              </View>

                              <View className="mt-3">
                                <StarRating
                                  rating={
                                    review.rating
                                  }
                                />
                              </View>

                              <Text className="mt-3 text-sm leading-6 text-slate-600">
                                {
                                  review.comment
                                }
                              </Text>

                              <View className="mt-4 flex-row flex-wrap gap-5">
                                <View>
                                  <Text className="text-xs text-slate-400">
                                    Provider
                                  </Text>

                                  <Text className="mt-1 text-sm font-semibold text-slate-800">
                                    {
                                      review.providerName
                                    }
                                  </Text>
                                </View>

                                <View>
                                  <Text className="text-xs text-slate-400">
                                    Service
                                  </Text>

                                  <Text className="mt-1 text-sm font-semibold text-slate-800">
                                    {
                                      review.serviceName
                                    }
                                  </Text>
                                </View>
                              </View>

                              {review.status ===
                                "reported" &&
                                review.reportReason && (
                                  <View className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                                    <Text className="text-xs font-bold uppercase text-red-500">
                                      Report Reason
                                    </Text>

                                    <Text className="mt-2 text-sm leading-6 text-red-700">
                                      {
                                        review.reportReason
                                      }
                                    </Text>
                                  </View>
                                )}

                              <View className="mt-5 flex-row flex-wrap gap-2">
                                {review.status !==
                                  "published" && (
                                    <Pressable
                                      onPress={() =>
                                        publishReview(
                                          review.id
                                        )
                                      }
                                      className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5"
                                    >
                                      <Text className="text-xs font-bold text-green-700">
                                        Publish
                                      </Text>
                                    </Pressable>
                                  )}

                                {review.status !==
                                  "hidden" && (
                                    <Pressable
                                      onPress={() =>
                                        hideReview(
                                          review.id
                                        )
                                      }
                                      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5"
                                    >
                                      <Text className="text-xs font-bold text-amber-700">
                                        Hide
                                      </Text>
                                    </Pressable>
                                  )}

                                <Pressable
                                  onPress={() =>
                                    deleteReview(
                                      review.id
                                    )
                                  }
                                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5"
                                >
                                  <Text className="text-xs font-bold text-red-600">
                                    Delete
                                  </Text>
                                </Pressable>

                                <Pressable
                                  onPress={() =>
                                    router.push(
                                      "/admin/bookings"
                                    )
                                  }
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5"
                                >
                                  <Text className="text-xs font-bold text-blue-700">
                                    View Booking
                                  </Text>
                                </Pressable>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  )
                ) : (
                  <View className="items-center px-5 py-16">
                    <Text className="text-5xl">
                      ⭐
                    </Text>

                    <Text className="mt-4 text-xl font-bold text-slate-900">
                      No reviews found
                    </Text>

                    <Text className="mt-2 text-center text-sm text-slate-500">
                      Change search or
                      filter.
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
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}