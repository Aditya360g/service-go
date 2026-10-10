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

type Review = {
  id: number;
  bookingId: number;
  customerName: string;
  initials: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
};

type RatingFilter =
  | "all"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1";

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

const reviews: Review[] = [
  {
    id: 1,
    bookingId: 1003,
    customerName: "Neha Verma",
    initials: "NV",
    serviceName:
      "Washing Machine Repair",
    rating: 5,
    comment:
      "Very professional and completed the repair quickly. The machine is working perfectly now.",
    date: "17 Sep 2026",
  },
  {
    id: 2,
    bookingId: 1004,
    customerName: "Karan Singh",
    initials: "KS",
    serviceName:
      "Appliance Inspection",
    rating: 5,
    comment:
      "Good behaviour and clearly explained the problem before starting the work.",
    date: "17 Sep 2026",
  },
  {
    id: 3,
    bookingId: 1007,
    customerName: "Pooja Mehta",
    initials: "PM",
    serviceName:
      "Washing Machine Repair",
    rating: 4,
    comment:
      "Service was good and provider arrived on time. Overall satisfied.",
    date: "16 Sep 2026",
  },
  {
    id: 4,
    bookingId: 1008,
    customerName: "Deepak Jain",
    initials: "DJ",
    serviceName:
      "Installation Service",
    rating: 5,
    comment:
      "Installation was done properly and everything was explained clearly.",
    date: "15 Sep 2026",
  },
  {
    id: 5,
    bookingId: 1010,
    customerName: "Anjali Sharma",
    initials: "AS",
    serviceName:
      "Appliance Inspection",
    rating: 4,
    comment:
      "Good service. The inspection was detailed and useful.",
    date: "13 Sep 2026",
  },
  {
    id: 6,
    bookingId: 1011,
    customerName: "Mayank Gupta",
    initials: "MG",
    serviceName:
      "Washing Machine Repair",
    rating: 5,
    comment:
      "Quick response and very good service quality.",
    date: "12 Sep 2026",
  },
  {
    id: 7,
    bookingId: 1012,
    customerName: "Ritika Jain",
    initials: "RJ",
    serviceName:
      "Installation Service",
    rating: 3,
    comment:
      "Work was completed properly but arrival was a little late.",
    date: "10 Sep 2026",
  },
];

const ratingFilters: {
  label: string;
  value: RatingFilter;
}[] = [
    {
      label: "All Reviews",
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
  ];

function StarRating({
  rating,
  size = "normal",
}: {
  rating: number;
  size?: "small" | "normal" | "large";
}) {
  const textClass =
    size === "large"
      ? "text-2xl"
      : size === "small"
        ? "text-sm"
        : "text-lg";

  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <Text
            key={star}
            className={`${textClass} ${star <= rating
              ? "text-amber-500"
              : "text-slate-200"
              }`}
          >
            ★
          </Text>
        )
      )}
    </View>
  );
}

export default function ProviderReviewsScreen() {
  const { width } =
    useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [search, setSearch] =
    useState("");

  const [
    ratingFilter,
    setRatingFilter,
  ] =
    useState<RatingFilter>(
      "all"
    );

  const filteredReviews =
    useMemo(() => {
      let result = [
        ...reviews,
      ];

      if (
        ratingFilter !==
        "all"
      ) {
        const rating =
          Number(
            ratingFilter
          );

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
                review.customerName,
                review.serviceName,
                review.comment,
                String(
                  review.bookingId
                ),
              ]
                .join(" ")
                .toLowerCase()
                .includes(query)
          );
      }

      return result;
    }, [
      search,
      ratingFilter,
    ]);

  const totalReviews =
    reviews.length;

  const averageRating =
    reviews.reduce(
      (sum, review) =>
        sum + review.rating,
      0
    ) / totalReviews;

  const getRatingCount = (
    rating: number
  ) =>
    reviews.filter(
      (review) =>
        review.rating ===
        rating
    ).length;

  const fiveStarCount =
    getRatingCount(5);

  const fourStarCount =
    getRatingCount(4);

  const threeStarCount =
    getRatingCount(3);

  const twoStarCount =
    getRatingCount(2);

  const oneStarCount =
    getRatingCount(1);

  const getPercentage = (
    count: number
  ) =>
    totalReviews > 0
      ? `${Math.round(
        (count /
          totalReviews) *
        100
      )}%`
      : "0%";

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
                    "/provider/reviews";

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
                    Customer ratings
                    and feedback
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
                        "/provider/reviews";

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
                  Customer Reviews
                </Text>

                <Text className="mt-2 text-slate-500">
                  See ratings and
                  feedback from your
                  customers.
                </Text>
              </View>

              {/* RATING SUMMARY */}
              <View className="mb-6 flex-row flex-wrap gap-5">
                <View
                  className="items-center justify-center rounded-2xl border border-slate-200 bg-white p-7"
                  style={{
                    minWidth: 250,
                    flexBasis: 300,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-5xl font-black text-slate-900">
                    {averageRating.toFixed(
                      1
                    )}
                  </Text>

                  <View className="mt-3">
                    <StarRating
                      rating={Math.round(
                        averageRating
                      )}
                      size="large"
                    />
                  </View>

                  <Text className="mt-3 text-sm text-slate-500">
                    Based on{" "}
                    {totalReviews}{" "}
                    reviews
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                  style={{
                    minWidth: 300,
                    flexBasis: 600,
                    flexGrow: 2,
                  }}
                >
                  {[
                    {
                      rating: 5,
                      count:
                        fiveStarCount,
                    },
                    {
                      rating: 4,
                      count:
                        fourStarCount,
                    },
                    {
                      rating: 3,
                      count:
                        threeStarCount,
                    },
                    {
                      rating: 2,
                      count:
                        twoStarCount,
                    },
                    {
                      rating: 1,
                      count:
                        oneStarCount,
                    },
                  ].map((item) => {
                    const percent =
                      totalReviews > 0
                        ? Math.round(
                          (item.count /
                            totalReviews) *
                          100
                        )
                        : 0;

                    return (
                      <View
                        key={
                          item.rating
                        }
                        className="mb-4 flex-row items-center"
                      >
                        <Text className="w-8 text-sm font-semibold text-slate-600">
                          {
                            item.rating
                          }
                        </Text>

                        <Text className="mr-3 text-amber-500">
                          ★
                        </Text>

                        <View className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <View
                            className="h-full rounded-full bg-amber-400"
                            style={{
                              width:
                                `${percent}%`,
                            }}
                          />
                        </View>

                        <Text className="ml-3 w-10 text-right text-sm font-semibold text-slate-500">
                          {
                            item.count
                          }
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* STATS */}
              <View className="mb-6 flex-row flex-wrap gap-4">
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Total Reviews
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-slate-900">
                    {totalReviews}
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    5 Star Reviews
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-green-600">
                    {fiveStarCount}
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    {getPercentage(
                      fiveStarCount
                    )}{" "}
                    of reviews
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 160,
                    flexBasis: 220,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Average Rating
                  </Text>

                  <Text className="mt-2 text-2xl font-black text-slate-900">
                    ⭐{" "}
                    {averageRating.toFixed(
                      1
                    )}
                  </Text>
                </View>
              </View>

              {/* SEARCH */}
              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <View className="flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <Text className="mr-2 text-lg text-slate-400">
                    🔎
                  </Text>

                  <TextInput
                    value={search}
                    onChangeText={
                      setSearch
                    }
                    placeholder="Search customer, service or review"
                    placeholderTextColor="#94a3b8"
                    className="flex-1 py-3.5 text-sm text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* FILTER */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                  false
                }
                className="mb-5"
              >
                <View className="flex-row gap-2">
                  {ratingFilters.map(
                    (filter) => {
                      const selected =
                        ratingFilter ===
                        filter.value;

                      return (
                        <Pressable
                          key={
                            filter.value
                          }
                          onPress={() =>
                            setRatingFilter(
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
                    Reviews
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
                    ) => (
                      <Pressable
                        key={
                          review.id
                        }
                        onPress={() =>
                          router.push({
                            pathname:
                              "/provider/bookings/[bookingId]",
                            params: {
                              bookingId:
                                String(
                                  review.bookingId
                                ),
                            },
                          })
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
                                review.initials
                              }
                            </Text>
                          </View>

                          <View className="ml-4 flex-1">
                            <View className="flex-row flex-wrap items-start justify-between gap-3">
                              <View>
                                <Text className="font-bold text-slate-900">
                                  {
                                    review.customerName
                                  }
                                </Text>

                                <Text className="mt-1 text-xs text-slate-400">
                                  {
                                    review.serviceName
                                  }{" "}
                                  • Booking #
                                  {
                                    review.bookingId
                                  }
                                </Text>
                              </View>

                              <Text className="text-xs text-slate-400">
                                {
                                  review.date
                                }
                              </Text>
                            </View>

                            <View className="mt-3">
                              <StarRating
                                rating={
                                  review.rating
                                }
                              />
                            </View>

                            <Text className="mt-3 leading-7 text-slate-600">
                              {
                                review.comment
                              }
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    )
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
                      Try changing your
                      search or rating
                      filter.
                    </Text>

                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setRatingFilter(
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