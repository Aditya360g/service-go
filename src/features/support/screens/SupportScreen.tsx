import { router } from "expo-router";
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

type SupportCategory =
  | "booking"
  | "payment"
  | "provider"
  | "account"
  | "refund"
  | "other";

type Priority =
  | "normal"
  | "urgent";

type SupportTicketPayload = {
  category: SupportCategory;
  subject: string;
  message: string;
  booking_id: number | null;
  priority: Priority;
};

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

const categories: {
  value: SupportCategory;
  title: string;
  description: string;
  icon: string;
}[] = [
    {
      value: "booking",
      title: "Booking",
      description:
        "Booking status, reschedule or cancellation issues.",
      icon: "📅",
    },
    {
      value: "payment",
      title: "Payment",
      description:
        "Payment failures, pending payments or receipts.",
      icon: "💳",
    },
    {
      value: "provider",
      title: "Provider",
      description:
        "Issues related to a service professional.",
      icon: "🧑‍🔧",
    },
    {
      value: "account",
      title: "Account",
      description:
        "Profile, login, verification or account questions.",
      icon: "👤",
    },
    {
      value: "refund",
      title: "Refund",
      description:
        "Cancellation refunds and payment return status.",
      icon: "↩️",
    },
    {
      value: "other",
      title: "Other",
      description:
        "Anything else you need help with.",
      icon: "💬",
    },
  ];

const faqs: FaqItem[] = [
  {
    id: 1,
    category: "Booking",
    question:
      "How can I check my booking status?",
    answer:
      "Open My Bookings and select the booking you want to view. The booking details page shows its current status, payment state, provider, date and time.",
  },
  {
    id: 2,
    category: "Booking",
    question:
      "Can I cancel a booking?",
    answer:
      "Eligible bookings can be cancelled from the booking details page. Cancellation rules and any refund eligibility depend on the booking status and ServiGo policy.",
  },
  {
    id: 3,
    category: "Payment",
    question:
      "What should I do if payment fails?",
    answer:
      "Open the booking again and retry payment. Do not retry repeatedly while a payment is still processing. If money was deducted but the booking still shows unpaid, contact support.",
  },
  {
    id: 4,
    category: "Payment",
    question:
      "Where can I see my payment status?",
    answer:
      "Payment status appears in My Bookings and on the individual booking details page.",
  },
  {
    id: 5,
    category: "Refund",
    question:
      "How long does a refund take?",
    answer:
      "After the backend and payment gateway are connected, the refund screen will show the actual refund status. Processing time may depend on the payment provider and bank.",
  },
  {
    id: 6,
    category: "Provider",
    question:
      "What if the provider does not arrive?",
    answer:
      "Check your booking details first. If the scheduled time has passed and the provider has not arrived, submit a support ticket with the booking ID.",
  },
  {
    id: 7,
    category: "Account",
    question:
      "How do I update my phone number?",
    answer:
      "Open Profile, choose Edit Profile, enter the new mobile number and save your changes.",
  },
  {
    id: 8,
    category: "Account",
    question:
      "How do I reset my password?",
    answer:
      "Use the Forgot Password flow from the login or profile security section.",
  },
];

function getCategoryDetails(
  category: SupportCategory
) {
  return categories.find(
    (item) =>
      item.value === category
  );
}

export default function SupportScreen() {
  const [
    faqSearch,
    setFaqSearch,
  ] = useState("");

  const [
    openFaqId,
    setOpenFaqId,
  ] =
    useState<number | null>(
      null
    );

  const [
    category,
    setCategory,
  ] =
    useState<SupportCategory>(
      "booking"
    );

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    bookingId,
    setBookingId,
  ] = useState("");

  const [
    priority,
    setPriority,
  ] =
    useState<Priority>(
      "normal"
    );

  const [error, setError] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submittedTicketId,
    setSubmittedTicketId,
  ] =
    useState<string | null>(
      null
    );

  const filteredFaqs =
    useMemo(() => {
      const query =
        faqSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return faqs;
      }

      return faqs.filter(
        (faq) =>
          [
            faq.category,
            faq.question,
            faq.answer,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [faqSearch]);

  const validateTicket =
    () => {
      if (
        subject.trim().length <
        4
      ) {
        setError(
          "Please enter a clear subject."
        );

        return false;
      }

      if (
        message.trim().length <
        10
      ) {
        setError(
          "Please describe your issue in at least 10 characters."
        );

        return false;
      }

      if (
        bookingId.trim() &&
        !/^\d+$/.test(
          bookingId.trim()
        )
      ) {
        setError(
          "Booking ID should contain numbers only."
        );

        return false;
      }

      setError("");

      return true;
    };

  const handleSubmitTicket =
    async () => {
      if (!validateTicket()) {
        return;
      }

      setSubmitting(true);

      try {
        const payload: SupportTicketPayload =
        {
          category,

          subject:
            subject.trim(),

          message:
            message.trim(),

          booking_id:
            bookingId.trim()
              ? Number(
                bookingId.trim()
              )
              : null,

          priority,
        };

        /*
          ==================================
          BACKEND INTEGRATION LATER
          ==================================

          await supportApi.createTicket(
            payload
          );

          Example:

          POST /support/tickets

          {
            category: "booking",
            subject: "...",
            message: "...",
            booking_id: 1001,
            priority: "normal"
          }

          Backend should automatically
          attach the logged-in user ID.

          UI ko rewrite nahi karna padega.
        */

        console.log(
          "Support ticket:",
          payload
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              600
            )
        );

        const ticketId =
          `SG-${Math.floor(
            100000 +
            Math.random() *
            900000
          )}`;

        setSubmittedTicketId(
          ticketId
        );

        setSubject("");
        setMessage("");
        setBookingId("");
        setPriority(
          "normal"
        );
        setCategory(
          "booking"
        );
      } catch (supportError) {
        console.error(
          "Support ticket error:",
          supportError
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to submit support request."
          );
        } else {
          Alert.alert(
            "Unable to Submit",
            "Something went wrong while creating your support ticket."
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
            maxWidth: 1100,
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
          maxWidth: 1100,
        }}
      >
        {/* HERO */}
        <View className="mb-7 rounded-3xl bg-blue-600 p-7 md:p-9">
          <View className="flex-row flex-wrap items-center gap-6">
            <View
              style={{
                minWidth: 240,
                flexBasis: 600,
                flexGrow: 1,
              }}
            >
              <Text className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                ServiGo Help Center
              </Text>

              <Text className="mt-2 text-3xl font-bold text-white">
                How can we help?
              </Text>

              <Text className="mt-3 max-w-2xl text-base leading-7 text-blue-100">
                Find quick answers or
                create a support request
                for booking, payment,
                provider and account
                issues.
              </Text>
            </View>

            <View className="h-24 w-24 items-center justify-center rounded-3xl bg-white">
              <Text className="text-5xl">
                🎧
              </Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View className="mb-7 flex-row flex-wrap gap-4">
          <Pressable
            onPress={() =>
              router.push(
                "/bookings"
              )
            }
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 190,
              flexBasis: 240,
              flexGrow: 1,
            }}
          >
            <Text className="text-3xl">
              📅
            </Text>

            <Text className="mt-3 text-lg font-bold text-slate-900">
              My Bookings
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              Check booking and payment
              status.
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push(
                "/profile"
              )
            }
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 190,
              flexBasis: 240,
              flexGrow: 1,
            }}
          >
            <Text className="text-3xl">
              👤
            </Text>

            <Text className="mt-3 text-lg font-bold text-slate-900">
              My Account
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              Manage profile and account
              settings.
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push(
                "/notifications"
              )
            }
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 190,
              flexBasis: 240,
              flexGrow: 1,
            }}
          >
            <Text className="text-3xl">
              🔔
            </Text>

            <Text className="mt-3 text-lg font-bold text-slate-900">
              Notifications
            </Text>

            <Text className="mt-1 text-sm leading-5 text-slate-500">
              View recent booking and
              account updates.
            </Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-6">
          {/* LEFT */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 650,
              flexGrow: 2,
            }}
          >
            {/* FAQ */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </Text>

              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Search common questions
                before creating a support
                ticket.
              </Text>

              <View className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4">
                <TextInput
                  value={
                    faqSearch
                  }
                  onChangeText={
                    setFaqSearch
                  }
                  placeholder="Search help topics..."
                  placeholderTextColor="#94a3b8"
                  className="py-4 text-base text-slate-900 outline-none"
                />
              </View>

              <View className="mt-5 gap-3">
                {filteredFaqs.length >
                  0 ? (
                  filteredFaqs.map(
                    (faq) => {
                      const open =
                        openFaqId ===
                        faq.id;

                      return (
                        <Pressable
                          key={faq.id}
                          onPress={() =>
                            setOpenFaqId(
                              open
                                ? null
                                : faq.id
                            )
                          }
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <View className="flex-row items-start">
                            <View className="flex-1">
                              <Text className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                {
                                  faq.category
                                }
                              </Text>

                              <Text className="mt-2 font-bold leading-6 text-slate-900">
                                {
                                  faq.question
                                }
                              </Text>
                            </View>

                            <Text className="ml-4 text-xl text-slate-400">
                              {open
                                ? "−"
                                : "+"}
                            </Text>
                          </View>

                          {open && (
                            <Text className="mt-4 border-t border-slate-100 pt-4 leading-7 text-slate-600">
                              {
                                faq.answer
                              }
                            </Text>
                          )}
                        </Pressable>
                      );
                    }
                  )
                ) : (
                  <View className="items-center rounded-2xl bg-slate-50 p-8">
                    <Text className="text-4xl">
                      🔎
                    </Text>

                    <Text className="mt-3 font-bold text-slate-900">
                      No FAQ found
                    </Text>

                    <Text className="mt-1 text-center text-sm text-slate-500">
                      Try another search
                      or submit a support
                      request below.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* SUPPORT FORM */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-2xl font-bold text-slate-900">
                Create Support Request
              </Text>

              <Text className="mt-2 text-sm leading-6 text-slate-500">
                Tell us what happened and
                include a booking ID when
                the issue is related to a
                service.
              </Text>

              {/* SUCCESS */}
              {submittedTicketId && (
                <View className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
                  <Text className="font-bold text-green-800">
                    ✓ Support request
                    submitted
                  </Text>

                  <Text className="mt-2 text-sm leading-6 text-green-700">
                    Ticket ID:{" "}
                    {submittedTicketId}
                  </Text>

                  <Text className="mt-1 text-sm leading-6 text-green-700">
                    Keep this ID for
                    reference when
                    contacting support.
                  </Text>
                </View>
              )}

              {/* CATEGORY */}
              <Text className="mt-6 text-sm font-bold text-slate-700">
                Issue Category
              </Text>

              <View className="mt-3 flex-row flex-wrap gap-3">
                {categories.map(
                  (item) => {
                    const selected =
                      category ===
                      item.value;

                    return (
                      <Pressable
                        key={
                          item.value
                        }
                        onPress={() => {
                          setCategory(
                            item.value
                          );
                          setError(
                            ""
                          );
                        }}
                        className={
                          selected
                            ? "rounded-2xl border-2 border-blue-600 bg-blue-50 p-4"
                            : "rounded-2xl border border-slate-200 bg-white p-4"
                        }
                        style={{
                          minWidth: 180,
                          flexBasis: 200,
                          flexGrow: 1,
                        }}
                      >
                        <Text className="text-2xl">
                          {item.icon}
                        </Text>

                        <Text
                          className={
                            selected
                              ? "mt-2 font-bold text-blue-700"
                              : "mt-2 font-bold text-slate-900"
                          }
                        >
                          {item.title}
                        </Text>

                        <Text className="mt-1 text-xs leading-5 text-slate-500">
                          {
                            item.description
                          }
                        </Text>
                      </Pressable>
                    );
                  }
                )}
              </View>

              {/* BOOKING ID */}
              <View className="mt-6">
                <Text className="mb-2 text-sm font-bold text-slate-700">
                  Booking ID
                  (Optional)
                </Text>

                <View className="rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <TextInput
                    value={
                      bookingId
                    }
                    onChangeText={(
                      value
                    ) => {
                      setBookingId(
                        value.replace(
                          /\D/g,
                          ""
                        )
                      );

                      setError("");
                    }}
                    placeholder="Example: 1001"
                    placeholderTextColor="#94a3b8"
                    keyboardType="number-pad"
                    maxLength={20}
                    className="py-4 text-base text-slate-900 outline-none"
                  />
                </View>
              </View>

              {/* SUBJECT */}
              <View className="mt-5">
                <Text className="mb-2 text-sm font-bold text-slate-700">
                  Subject *
                </Text>

                <View className="rounded-xl border border-slate-200 bg-slate-50 px-4">
                  <TextInput
                    value={
                      subject
                    }
                    onChangeText={(
                      value
                    ) => {
                      setSubject(
                        value
                      );

                      setError("");
                    }}
                    placeholder="Short summary of your issue"
                    placeholderTextColor="#94a3b8"
                    maxLength={120}
                    className="py-4 text-base text-slate-900 outline-none"
                  />
                </View>

                <Text className="mt-2 text-right text-xs text-slate-400">
                  {subject.length}/120
                </Text>
              </View>

              {/* MESSAGE */}
              <View className="mt-5">
                <Text className="mb-2 text-sm font-bold text-slate-700">
                  Describe the Issue *
                </Text>

                <View className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                  <TextInput
                    value={
                      message
                    }
                    onChangeText={(
                      value
                    ) => {
                      setMessage(
                        value
                      );

                      setError("");
                    }}
                    placeholder="Explain what happened and what help you need..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    textAlignVertical="top"
                    maxLength={1500}
                    className="min-h-[160px] py-3 text-base leading-7 text-slate-900 outline-none"
                  />
                </View>

                <Text className="mt-2 text-right text-xs text-slate-400">
                  {message.length}/1500
                </Text>
              </View>

              {/* PRIORITY */}
              <View className="mt-5">
                <Text className="mb-3 text-sm font-bold text-slate-700">
                  Priority
                </Text>

                <View className="flex-row flex-wrap gap-3">
                  <Pressable
                    onPress={() =>
                      setPriority(
                        "normal"
                      )
                    }
                    className={
                      priority ===
                        "normal"
                        ? "rounded-xl border-2 border-blue-600 bg-blue-50 px-5 py-3"
                        : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        priority ===
                          "normal"
                          ? "font-bold text-blue-700"
                          : "font-bold text-slate-700"
                      }
                    >
                      Normal
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      setPriority(
                        "urgent"
                      )
                    }
                    className={
                      priority ===
                        "urgent"
                        ? "rounded-xl border-2 border-red-600 bg-red-50 px-5 py-3"
                        : "rounded-xl border border-slate-200 bg-white px-5 py-3"
                    }
                  >
                    <Text
                      className={
                        priority ===
                          "urgent"
                          ? "font-bold text-red-700"
                          : "font-bold text-slate-700"
                      }
                    >
                      Urgent
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* CURRENT CATEGORY */}
              <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Selected Category
                </Text>

                <Text className="mt-2 font-bold text-slate-900">
                  {
                    getCategoryDetails(
                      category
                    )?.icon
                  }{" "}
                  {
                    getCategoryDetails(
                      category
                    )?.title
                  }
                </Text>
              </View>

              {!!error && (
                <View className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <Text className="font-semibold text-red-700">
                    {error}
                  </Text>
                </View>
              )}

              <Pressable
                disabled={
                  submitting
                }
                onPress={
                  handleSubmitTicket
                }
                className={
                  submitting
                    ? "mt-6 items-center rounded-xl bg-blue-400 px-6 py-4"
                    : "mt-6 items-center rounded-xl bg-blue-600 px-6 py-4"
                }
              >
                <Text className="font-bold text-white">
                  {submitting
                    ? "Submitting Request..."
                    : "Submit Support Request"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* RIGHT */}
          <View
            style={{
              minWidth: 280,
              flexBasis: 340,
              flexGrow: 1,
            }}
          >
            {/* CONTACT OPTIONS */}
            <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-xl font-bold text-slate-900">
                Contact Options
              </Text>

              <Text className="mt-2 text-sm leading-6 text-slate-500">
                These options are ready
                for real contact details
                when production support is
                connected.
              </Text>

              <View className="mt-5 gap-3">
                <View className="rounded-2xl bg-slate-50 p-4">
                  <Text className="text-2xl">
                    💬
                  </Text>

                  <Text className="mt-2 font-bold text-slate-900">
                    Support Ticket
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-slate-500">
                    Best for booking,
                    payment and account
                    issues.
                  </Text>
                </View>

                <View className="rounded-2xl bg-slate-50 p-4">
                  <Text className="text-2xl">
                    ✉️
                  </Text>

                  <Text className="mt-2 font-bold text-slate-900">
                    Email Support
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-slate-500">
                    Production support
                    email can be connected
                    here later.
                  </Text>
                </View>

                <View className="rounded-2xl bg-slate-50 p-4">
                  <Text className="text-2xl">
                    📞
                  </Text>

                  <Text className="mt-2 font-bold text-slate-900">
                    Phone Support
                  </Text>

                  <Text className="mt-1 text-sm leading-5 text-slate-500">
                    Customer helpline can
                    be enabled when the
                    service goes live.
                  </Text>
                </View>
              </View>
            </View>

            {/* EMERGENCY NOTE */}
            <View className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <Text className="text-lg font-bold text-amber-900">
                Urgent Service Issue?
              </Text>

              <Text className="mt-2 text-sm leading-6 text-amber-800">
                Add your booking ID and
                choose Urgent priority
                when the issue needs
                immediate ServiGo support
                attention.
              </Text>
            </View>

            {/* SELF SERVICE */}
            <View className="mb-6 rounded-3xl bg-slate-900 p-6">
              <Text className="text-xl font-bold text-white">
                Self-Service
              </Text>

              <Text className="mt-2 text-sm leading-6 text-slate-300">
                Many common issues can be
                managed directly from your
                account.
              </Text>

              <View className="mt-5 gap-3">
                <Pressable
                  onPress={() =>
                    router.push(
                      "/bookings"
                    )
                  }
                  className="rounded-xl bg-slate-800 px-5 py-4"
                >
                  <Text className="font-semibold text-white">
                    📅 Manage Bookings
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/addresses"
                    )
                  }
                  className="rounded-xl bg-slate-800 px-5 py-4"
                >
                  <Text className="font-semibold text-white">
                    📍 Manage Addresses
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/profile/edit"
                    )
                  }
                  className="rounded-xl bg-slate-800 px-5 py-4"
                >
                  <Text className="font-semibold text-white">
                    👤 Edit Profile
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/forgot-password"
                    )
                  }
                  className="rounded-xl bg-slate-800 px-5 py-4"
                >
                  <Text className="font-semibold text-white">
                    🔐 Reset Password
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* SUPPORT INFO */}
            <View className="rounded-3xl border border-slate-200 bg-white p-6">
              <Text className="text-lg font-bold text-slate-900">
                Support Tips
              </Text>

              <View className="mt-4 gap-3">
                <Text className="leading-6 text-slate-600">
                  ✓ Include your booking
                  ID whenever possible.
                </Text>

                <Text className="leading-6 text-slate-600">
                  ✓ Explain what happened
                  clearly.
                </Text>

                <Text className="leading-6 text-slate-600">
                  ✓ Do not share passwords,
                  OTPs or card CVV.
                </Text>

                <Text className="leading-6 text-slate-600">
                  ✓ Use Urgent priority
                  only for time-sensitive
                  service issues.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}