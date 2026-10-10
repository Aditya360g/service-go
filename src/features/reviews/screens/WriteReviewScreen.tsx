import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type BookingReviewData = {
  bookingId: number;

  providerId: number;
  providerName: string;
  providerInitials: string;

  serviceName: string;

  date: string;
  time: string;

  amount: number;

  bookingStatus:
  | "completed"
  | "pending"
  | "confirmed"
  | "cancelled";

  alreadyReviewed: boolean;
};

type ReviewPayload = {
  booking_id: number;
  provider_id: number;

  rating: number;

  title: string;

  comment: string;

  tags: string[];

  private_feedback:
  | string
  | null;

  recommend_provider: boolean;
};

const demoBookings: BookingReviewData[] = [
  {
    bookingId: 1003,

    providerId: 2,
    providerName: "Rohit Verma",
    providerInitials: "RV",

    serviceName: "Electrician",

    date: "15 Sep 2026",
    time: "11:00 AM - 12:00 PM",

    amount: 249,

    bookingStatus: "completed",

    alreadyReviewed: false,
  },

  {
    bookingId: 1005,

    providerId: 4,
    providerName: "Sandeep Singh",
    providerInitials: "SS",

    serviceName: "AC Repair",

    date: "17 Sep 2026",
    time: "01:00 PM - 02:00 PM",

    amount: 399,

    bookingStatus: "completed",

    alreadyReviewed: false,
  },

  {
    bookingId: 1001,

    providerId: 5,
    providerName: "Rahul Provider",
    providerInitials: "RP",

    serviceName:
      "Washing Machine Repair",

    date: "20 Sep 2026",
    time: "10:00 AM - 11:00 AM",

    amount: 599,

    bookingStatus: "confirmed",

    alreadyReviewed: false,
  },
];

const ratingLabels: Record<
  number,
  string
> = {
  1: "Very Poor",
  2: "Poor",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

const reviewTags = [
  "On Time",
  "Professional",
  "Good Behaviour",
  "Quality Work",
  "Clean Work",
  "Good Communication",
  "Value for Money",
  "Quick Service",
];

function getParam(
  value?: string | string[]
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function RatingStars({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (rating: number) => void;
}) {
  return (
    <View className="flex-row gap-2">
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const selected =
            star <= rating;

          return (
            <Pressable
              key={star}
              onPress={() =>
                onChange(star)
              }
              className="p-1"
            >
              <Text
                className={
                  selected
                    ? "text-4xl text-amber-500"
                    : "text-4xl text-slate-300"
                }
              >
                ★
              </Text>
            </Pressable>
          );
        }
      )}
    </View>
  );
}

export default function WriteReviewScreen() {
  const params =
    useLocalSearchParams<{
      bookingId?:
      | string
      | string[];
    }>();

  const bookingId =
    Number(
      getParam(
        params.bookingId
      )
    );

  const booking =
    useMemo(
      () =>
        demoBookings.find(
          (item) =>
            item.bookingId ===
            bookingId
        ),
      [bookingId]
    );

  const [rating, setRating] =
    useState(0);

  const [title, setTitle] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [
    privateFeedback,
    setPrivateFeedback,
  ] = useState("");

  const [
    selectedTags,
    setSelectedTags,
  ] = useState<string[]>([]);

  const [
    recommendProvider,
    setRecommendProvider,
  ] = useState(true);

  const [error, setError] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            ⭐
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Booking not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            We couldn't find a booking
            for this review.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/bookings"
              )
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View My Bookings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (
    booking.bookingStatus !==
    "completed"
  ) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            ⏳
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Review not available yet
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            You can review this service
            after the booking is marked
            as completed.
          </Text>

          <Pressable
            onPress={() =>
              router.replace({
                pathname:
                  "/bookings/[bookingId]",
                params: {
                  bookingId:
                    String(
                      booking.bookingId
                    ),
                },
              })
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View Booking
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (
    booking.alreadyReviewed
  ) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{
            maxWidth: 520,
          }}
        >
          <Text className="text-center text-5xl">
            ✅
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Review already submitted
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            You have already reviewed
            this completed service.
          </Text>

          <Pressable
            onPress={() =>
              router.replace(
                "/bookings"
              )
            }
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              View My Bookings
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-green-200 bg-white p-8"
          style={{
            maxWidth: 560,
          }}
        >
          <View className="items-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Text className="text-4xl font-bold text-green-700">
                ✓
              </Text>
            </View>

            <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
              Review Submitted
            </Text>

            <Text className="mt-2 text-center leading-6 text-slate-500">
              Thanks for sharing your
              experience with ServiGo.
            </Text>

            <View className="mt-5">
              <RatingStars
                rating={rating}
                onChange={() => { }}
              />
            </View>

            <Text className="mt-2 font-bold text-amber-600">
              {ratingLabels[rating]}
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/bookings"
                )
              }
              className="mt-7 w-full items-center rounded-xl bg-blue-600 px-5 py-4"
            >
              <Text className="font-bold text-white">
                Back to My Bookings
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname:
                    "/providers/[providerId]",
                  params: {
                    providerId:
                      String(
                        booking.providerId
                      ),
                  },
                })
              }
              className="mt-2 px-5 py-3"
            >
              <Text className="font-semibold text-blue-600">
                View Provider Profile
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const toggleTag = (
    tag: string
  ) => {
    setSelectedTags(
      (current) => {
        if (
          current.includes(tag)
        ) {
          return current.filter(
            (item) =>
              item !== tag
          );
        }

        return [
          ...current,
          tag,
        ];
      }
    );
  };

  const validateReview =
    () => {
      if (rating < 1) {
        setError(
          "Please select a rating."
        );

        return false;
      }

      if (
        title.trim().length <
        3
      ) {
        setError(
          "Please enter a short review title."
        );

        return false;
      }

      if (
        comment.trim().length <
        10
      ) {
        setError(
          "Please write at least 10 characters about your experience."
        );

        return false;
      }

      setError("");

      return true;
    };

  const handleSubmitReview =
    async () => {
      if (!validateReview()) {
        return;
      }

      setSubmitting(true);

      try {
        const payload: ReviewPayload =
        {
          booking_id:
            booking.bookingId,

          provider_id:
            booking.providerId,

          rating,

          title:
            title.trim(),

          comment:
            comment.trim(),

          tags:
            selectedTags,

          private_feedback:
            privateFeedback.trim() ||
            null,

          recommend_provider:
            recommendProvider,
        };

        /*
          ===================================
          BACKEND INTEGRATION LATER
          ===================================

          await reviewsApi.createReview(
            payload
          );

          Example:

          POST /reviews

          {
            booking_id: 1003,
            provider_id: 2,
            rating: 5,
            title: "...",
            comment: "...",
            tags: [...],
            private_feedback: "...",
            recommend_provider: true
          }

          Backend should verify:
          - booking belongs to current user
          - booking is completed
          - booking has not already
            been reviewed
          - rating is 1 to 5

          UI ko rewrite nahi karna.
        */

        console.log(
          "Review payload:",
          payload
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              600
            )
        );

        setSubmitted(true);
      } catch (reviewError) {
        console.error(
          "Review submit error:",
          reviewError
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to submit review."
          );
        } else {
          Alert.alert(
            "Unable to Submit",
            "Something went wrong while submitting your review."
          );
        }
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {/* HEADER */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1000,
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
          maxWidth: 900,
        }}
      >
        {/* PAGE HEADING */}
        <View className="mb-7">
          <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Customer Review
          </Text>

          <Text className="mt-2 text-3xl font-bold text-slate-900">
            Rate Your Service
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Your feedback helps improve
            ServiGo and helps other
            customers choose the right
            professional.
          </Text>
        </View>

        {/* BOOKING SUMMARY */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="mb-5 text-xl font-bold text-slate-900">
            Service Completed
          </Text>

          <View className="flex-row flex-wrap items-center gap-5">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl font-bold text-blue-700">
                {
                  booking.providerInitials
                }
              </Text>
            </View>

            <View
              style={{
                minWidth: 220,
                flexBasis: 420,
                flexGrow: 1,
              }}
            >
              <Text className="text-xl font-bold text-slate-900">
                {booking.serviceName}
              </Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname:
                      "/providers/[providerId]",
                    params: {
                      providerId:
                        String(
                          booking.providerId
                        ),
                    },
                  })
                }
              >
                <Text className="mt-1 font-semibold text-blue-600">
                  {booking.providerName}
                </Text>
              </Pressable>

              <Text className="mt-3 text-sm text-slate-500">
                📅 {booking.date}
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                🕐 {booking.time}
              </Text>
            </View>

            <View className="rounded-2xl bg-green-50 px-5 py-4">
              <Text className="text-xs font-semibold uppercase tracking-wider text-green-700">
                Status
              </Text>

              <Text className="mt-1 font-bold text-green-700">
                ✓ Completed
              </Text>

              <Text className="mt-2 text-sm text-green-700">
                ₹{booking.amount}
              </Text>
            </View>
          </View>
        </View>

        {/* RATING */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Overall Rating
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            How was your experience
            with this service?
          </Text>

          <View className="mt-6 items-center">
            <RatingStars
              rating={rating}
              onChange={(value) => {
                setRating(value);
                setError("");
              }}
            />

            <Text
              className={
                rating > 0
                  ? "mt-3 text-lg font-bold text-amber-600"
                  : "mt-3 text-sm text-slate-400"
              }
            >
              {rating > 0
                ? ratingLabels[rating]
                : "Tap a star to rate"}
            </Text>

            {rating > 0 && (
              <Text className="mt-1 text-sm text-slate-500">
                {rating}/5
              </Text>
            )}
          </View>
        </View>

        {/* QUICK TAGS */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            What Did You Like?
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Choose any points that
            describe your experience.
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            {reviewTags.map(
              (tag) => {
                const selected =
                  selectedTags.includes(
                    tag
                  );

                return (
                  <Pressable
                    key={tag}
                    onPress={() =>
                      toggleTag(tag)
                    }
                    className={
                      selected
                        ? "rounded-full bg-blue-600 px-5 py-3"
                        : "rounded-full border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        selected
                          ? "font-semibold text-white"
                          : "font-semibold text-slate-600"
                      }
                    >
                      {selected
                        ? `✓ ${tag}`
                        : tag}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        </View>

        {/* REVIEW TITLE */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Review Title
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            Give your review a short
            title.
          </Text>

          <View className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <TextInput
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setError("");
              }}
              placeholder="Example: Excellent and professional service"
              placeholderTextColor="#94a3b8"
              maxLength={80}
              className="py-4 text-base text-slate-900 outline-none"
            />
          </View>

          <Text className="mt-2 text-right text-xs text-slate-400">
            {title.length}/80
          </Text>
        </View>

        {/* COMMENT */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Write Your Review
          </Text>

          <Text className="mt-1 text-sm leading-5 text-slate-500">
            Tell other customers about
            the quality of service,
            professionalism and your
            overall experience.
          </Text>

          <View className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <TextInput
              value={comment}
              onChangeText={(value) => {
                setComment(value);
                setError("");
              }}
              placeholder="Share your experience..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              maxLength={1000}
              className="min-h-[160px] py-3 text-base leading-7 text-slate-900 outline-none"
            />
          </View>

          <Text className="mt-2 text-right text-xs text-slate-400">
            {comment.length}/1000
          </Text>
        </View>

        {/* RECOMMEND */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Would You Recommend This
            Provider?
          </Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            <Pressable
              onPress={() =>
                setRecommendProvider(
                  true
                )
              }
              className={
                recommendProvider
                  ? "rounded-xl bg-green-600 px-6 py-4"
                  : "rounded-xl border border-slate-200 bg-white px-6 py-4"
              }
            >
              <Text
                className={
                  recommendProvider
                    ? "font-bold text-white"
                    : "font-bold text-slate-700"
                }
              >
                👍 Yes, Recommend
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setRecommendProvider(
                  false
                )
              }
              className={
                !recommendProvider
                  ? "rounded-xl bg-red-600 px-6 py-4"
                  : "rounded-xl border border-slate-200 bg-white px-6 py-4"
              }
            >
              <Text
                className={
                  !recommendProvider
                    ? "font-bold text-white"
                    : "font-bold text-slate-700"
                }
              >
                👎 No
              </Text>
            </Pressable>
          </View>
        </View>

        {/* PRIVATE FEEDBACK */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-xl font-bold text-slate-900">
            Private Feedback
          </Text>

          <Text className="mt-1 text-sm leading-5 text-slate-500">
            Optional feedback for
            ServiGo. This will not be
            shown publicly on the
            provider profile.
          </Text>

          <View className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <TextInput
              value={privateFeedback}
              onChangeText={
                setPrivateFeedback
              }
              placeholder="Tell ServiGo anything else we should know..."
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              maxLength={500}
              className="min-h-[110px] py-3 text-base leading-6 text-slate-900 outline-none"
            />
          </View>

          <Text className="mt-2 text-right text-xs text-slate-400">
            {privateFeedback.length}/500
          </Text>
        </View>

        {/* ERROR */}
        {!!error && (
          <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <Text className="font-semibold text-red-700">
              {error}
            </Text>
          </View>
        )}

        {/* PREVIEW */}
        {rating > 0 &&
          comment.trim().length >
          0 && (
            <View className="mb-6 rounded-3xl bg-slate-900 p-6">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Review Preview
              </Text>

              <View className="mt-4 flex-row flex-wrap items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                  <Text className="font-bold text-white">
                    YOU
                  </Text>
                </View>

                <View>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Text
                          key={star}
                          className={
                            star <=
                              rating
                              ? "text-xl text-amber-400"
                              : "text-xl text-slate-600"
                          }
                        >
                          ★
                        </Text>
                      )
                    )}
                  </View>

                  <Text className="mt-1 text-sm text-slate-400">
                    {ratingLabels[rating]}
                  </Text>
                </View>
              </View>

              {!!title.trim() && (
                <Text className="mt-5 text-lg font-bold text-white">
                  {title.trim()}
                </Text>
              )}

              <Text className="mt-2 leading-7 text-slate-300">
                {comment.trim()}
              </Text>

              {selectedTags.length >
                0 && (
                  <View className="mt-5 flex-row flex-wrap gap-2">
                    {selectedTags.map(
                      (tag) => (
                        <View
                          key={tag}
                          className="rounded-full bg-slate-800 px-3 py-1.5"
                        >
                          <Text className="text-xs font-semibold text-slate-300">
                            {tag}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}
            </View>
          )}

        {/* ACTIONS */}
        <View className="flex-row flex-wrap justify-end gap-3">
          <Pressable
            disabled={submitting}
            onPress={() =>
              router.back()
            }
            className="rounded-xl border border-slate-200 bg-white px-6 py-4"
          >
            <Text className="font-bold text-slate-700">
              Cancel
            </Text>
          </Pressable>

          <Pressable
            disabled={submitting}
            onPress={
              handleSubmitReview
            }
            className={
              submitting
                ? "rounded-xl bg-blue-400 px-7 py-4"
                : "rounded-xl bg-blue-600 px-7 py-4"
            }
          >
            <Text className="font-bold text-white">
              {submitting
                ? "Submitting Review..."
                : "Submit Review"}
            </Text>
          </Pressable>
        </View>

        <Text className="mt-5 text-center text-xs leading-5 text-slate-400">
          Public reviews may appear on
          the provider's ServiGo profile.
          Private feedback is visible
          only to ServiGo.
        </Text>
      </View>
    </ScrollView>
  );
}