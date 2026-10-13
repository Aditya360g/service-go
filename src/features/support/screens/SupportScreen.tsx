
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

type SupportCategory =
  | "booking"
  | "payment"
  | "provider"
  | "account"
  | "refund"
  | "other";

type Priority = "normal" | "urgent";

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

const C = {
  background: "#F4F8F7",
  white: "#FFFFFF",
  primary: "#16796F",
  primaryDark: "#125C54",
  primaryLight: "#E8F4F1",
  text: "#183B36",
  secondary: "#687D78",
  muted: "#8A9A96",
  border: "#E1EAE7",
  danger: "#B42318",
  dangerLight: "#FFF1F0",
  success: "#18794E",
  successLight: "#EAF8F0",
  warning: "#8A5B12",
  warningLight: "#FFF7E7",
  dark: "#193B35",
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
      description: "Booking status, rescheduling or cancellation.",
      icon: "▦",
    },
    {
      value: "payment",
      title: "Payment",
      description: "Payment failures, receipts or pending payments.",
      icon: "₹",
    },
    {
      value: "provider",
      title: "Service provider",
      description: "Questions about your service professional.",
      icon: "♙",
    },
    {
      value: "account",
      title: "Account",
      description: "Login, profile or account settings.",
      icon: "◎",
    },
    {
      value: "refund",
      title: "Refund",
      description: "Refund eligibility and return status.",
      icon: "↩",
    },
    {
      value: "other",
      title: "Other",
      description: "Anything else you need help with.",
      icon: "✳",
    },
  ];

const faqs: FaqItem[] = [
  {
    id: 1,
    category: "Booking",
    question: "How can I check my booking status?",
    answer:
      "Open My Bookings and select the booking you want to view. Your booking details will show its status, service provider, scheduled date and time.",
  },
  {
    id: 2,
    category: "Booking",
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Open the booking details page to review the available options. Cancellation and rescheduling depend on the booking status and applicable service policy.",
  },
  {
    id: 3,
    category: "Payment",
    question: "What should I do if my payment fails?",
    answer:
      "Check your booking and payment status before trying again. If money was deducted but the booking still shows unpaid, create a support request.",
  },
  {
    id: 4,
    category: "Payment",
    question: "Where can I find my payment receipt?",
    answer:
      "Once payment features are connected, your booking details and payment history can show relevant payment information and receipts.",
  },
  {
    id: 5,
    category: "Refund",
    question: "How long does a refund take?",
    answer:
      "Refund timing depends on the payment provider, bank and refund policy. Contact support with your booking ID if you need help checking a refund.",
  },
  {
    id: 6,
    category: "Provider",
    question: "What if my service provider does not arrive?",
    answer:
      "Check the scheduled appointment details first. If the appointment time has passed, create a support request and include your booking ID.",
  },
  {
    id: 7,
    category: "Account",
    question: "How do I update my phone number?",
    answer:
      "Open your Profile and choose Edit Profile. Account functionality must be connected before profile changes can be saved.",
  },
  {
    id: 8,
    category: "Account",
    question: "How can I reset my password?",
    answer:
      "Use the Forgot Password option on the login screen. Password reset functionality requires the authentication backend to be connected.",
  },
];

function AppButton({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.button,
        secondary && s.buttonSecondary,
        disabled && s.buttonDisabled,
        pressed && !disabled && s.pressed,
      ]}
    >
      <Text
        style={[
          s.buttonText,
          secondary && s.buttonSecondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={s.sectionHeading}>
      <Text style={s.sectionTitle}>{title}</Text>
      {subtitle ? (
        <Text style={s.sectionSubtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export default function SupportScreen() {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 960;
  const isSmall = width < 390;

  const [faqSearch, setFaqSearch] = useState("");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const [category, setCategory] =
    useState<SupportCategory>("booking");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] =
    useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    const query = faqSearch.trim().toLowerCase();

    if (!query) return faqs;

    return faqs.filter((faq) =>
      [faq.category, faq.question, faq.answer]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [faqSearch]);

  const selectedCategory = categories.find(
    (item) => item.value === category
  );

  function showMessage(title: string, description: string) {
    if (Platform.OS === "web") {
      // Alert.alert is not consistently displayed by web browsers.
      if (typeof window !== "undefined") {
        window.alert(`${title}\n\n${description}`);
      }
    } else {
      Alert.alert(title, description);
    }
  }

  function navigate(path: string) {
    router.push(path as never);
  }

  function scrollToForm() {
    setError("");
    showMessage(
      "Create a support request",
      "Complete the support form on this page."
    );
  }

  function validateForm() {
    if (subject.trim().length < 4) {
      setError("Please enter a subject with at least 4 characters.");
      return false;
    }

    if (message.trim().length < 10) {
      setError("Please describe your issue in at least 10 characters.");
      return false;
    }

    if (
      bookingId.trim() &&
      !/^\d+$/.test(bookingId.trim())
    ) {
      setError("Booking ID should contain numbers only.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmitTicket() {
    if (submitting || !validateForm()) return;

    setSubmitting(true);

    try {
      // Frontend demo only. Connect POST /support/tickets later.
      const payload = {
        category,
        subject: subject.trim(),
        message: message.trim(),
        booking_id: bookingId.trim()
          ? Number(bookingId.trim())
          : null,
        priority,
      };

      console.log("Demo support ticket:", payload);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const ticketId = `SG-${Date.now().toString().slice(-6)}`;

      setSubmittedTicketId(ticketId);
      setSubject("");
      setMessage("");
      setBookingId("");
      setPriority("normal");
      setCategory("booking");
      setError("");

      showMessage(
        "Demo request created",
        `Reference ${ticketId} was created locally. It has not been sent to a server.`
      );
    } catch (e) {
      console.error("Support demo error:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.page}>
        {/* No duplicate navbar on this screen. */}

        {/* HERO */}
        <View style={[s.hero, isSmall && s.heroSmall]}>
          <View style={s.heroContent}>
            <View style={s.eyebrow}>
              <View style={s.eyebrowDot} />
              <Text style={s.eyebrowText}>
                SERVIGO HELP CENTER
              </Text>
            </View>

            <Text
              style={[
                s.heroTitle,
                isSmall && s.heroTitleSmall,
              ]}
            >
              How can we{"\n"}help you today?
            </Text>

            <Text style={s.heroDescription}>
              Get answers, resolve service issues and find the
              help you need — all in one place.
            </Text>

            <Pressable
              onPress={() => {
                setFaqSearch("");
                setOpenFaqId(1);
              }}
              style={s.heroAction}
              accessibilityRole="button"
            >
              <Text style={s.heroActionText}>
                Explore common questions →
              </Text>
            </Pressable>
          </View>

          {!isSmall && (
            <View style={s.heroIllustration}>
              <View style={s.heroCircle}>
                <Text style={s.headset}>◖♫◗</Text>
              </View>
              <View style={s.heroBadge}>
                <Text style={s.heroBadgeText}>✓</Text>
              </View>
            </View>
          )}
        </View>

        {/* QUICK LINKS */}
        <View style={s.quickLinks}>
          {[
            {
              icon: "▦",
              title: "My Bookings",
              description: "View your service details",
              path: "/bookings",
            },
            {
              icon: "◎",
              title: "My Account",
              description: "Manage your profile",
              path: "/profile",
            },
            {
              icon: "♧",
              title: "Notifications",
              description: "See recent updates",
              path: "/notifications",
            },
          ].map((item) => (
            <Pressable
              key={item.title}
              onPress={() => navigate(item.path)}
              accessibilityRole="button"
              style={({ pressed }) => [
                s.quickCard,
                pressed && s.pressed,
              ]}
            >
              <View style={s.quickIcon}>
                <Text style={s.quickIconText}>{item.icon}</Text>
              </View>

              <View style={s.quickTextWrap}>
                <Text style={s.quickTitle}>{item.title}</Text>
                <Text style={s.quickDescription}>
                  {item.description}
                </Text>
              </View>

              <Text style={s.quickArrow}>↗</Text>
            </Pressable>
          ))}
        </View>

        {/* MAIN LAYOUT */}
        <View
          style={[
            s.contentColumns,
            isDesktop && s.contentColumnsDesktop,
          ]}
        >
          {/* LEFT COLUMN */}
          <View
            style={[
              s.mainColumn,
              isDesktop && s.mainColumnDesktop,
            ]}
          >
            {/* FAQ */}
            <View style={s.card}>
              <SectionTitle
                title="Frequently asked questions"
                subtitle="Quick answers to common questions."
              />

              <View style={s.searchBox}>
                <Text style={s.searchIcon}>⌕</Text>

                <TextInput
                  value={faqSearch}
                  onChangeText={setFaqSearch}
                  placeholder="Search help topics..."
                  placeholderTextColor={C.muted}
                  style={s.searchInput}
                  returnKeyType="search"
                  accessibilityLabel="Search frequently asked questions"
                />

                {faqSearch.length > 0 && (
                  <Pressable
                    onPress={() => setFaqSearch("")}
                    accessibilityRole="button"
                  >
                    <Text style={s.clearSearch}>✕</Text>
                  </Pressable>
                )}
              </View>

              <View style={s.faqList}>
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;

                    return (
                      <Pressable
                        key={faq.id}
                        onPress={() =>
                          setOpenFaqId(
                            isOpen ? null : faq.id
                          )
                        }
                        accessibilityRole="button"
                        accessibilityState={{ expanded: isOpen }}
                        style={s.faqItem}
                      >
                        <View style={s.faqTop}>
                          <View style={s.faqText}>
                            <Text style={s.faqCategory}>
                              {faq.category}
                            </Text>
                            <Text style={s.faqQuestion}>
                              {faq.question}
                            </Text>
                          </View>

                          <View
                            style={[
                              s.faqToggle,
                              isOpen && s.faqToggleOpen,
                            ]}
                          >
                            <Text
                              style={[
                                s.faqToggleText,
                                isOpen && s.faqToggleTextOpen,
                              ]}
                            >
                              {isOpen ? "−" : "+"}
                            </Text>
                          </View>
                        </View>

                        {isOpen && (
                          <Text style={s.faqAnswer}>
                            {faq.answer}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })
                ) : (
                  <View style={s.emptyState}>
                    <Text style={s.emptyIcon}>⌕</Text>
                    <Text style={s.emptyTitle}>
                      No answers found
                    </Text>
                    <Text style={s.emptyDescription}>
                      Try a different search term or create a
                      support request.
                    </Text>
                  </View>
                )}
              </View>

              <View style={s.faqFooter}>
                <Text style={s.faqFooterText}>
                  Still need help?
                </Text>
                <Pressable
                  onPress={scrollToForm}
                  accessibilityRole="button"
                >
                  <Text style={s.inlineLink}>
                    Contact support →
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* SUPPORT FORM */}
            <View style={s.card}>
              <SectionTitle
                title="Create a support request"
                subtitle="Tell us what happened. We'll help you find the next step."
              />

              {submittedTicketId && (
                <View style={s.successBox}>
                  <View style={s.successIcon}>
                    <Text style={s.successIconText}>✓</Text>
                  </View>

                  <View style={s.successContent}>
                    <Text style={s.successTitle}>
                      Demo request created
                    </Text>
                    <Text style={s.successDescription}>
                      Reference ID: {submittedTicketId}
                    </Text>
                    <Text style={s.successNote}>
                      This is a local demo, not a server-submitted ticket.
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setSubmittedTicketId(null)}
                    accessibilityRole="button"
                  >
                    <Text style={s.dismissText}>✕</Text>
                  </Pressable>
                </View>
              )}

              <Text style={s.label}>
                What do you need help with?
              </Text>

              <View style={s.categoryGrid}>
                {categories.map((item) => {
                  const selected = category === item.value;

                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        setCategory(item.value);
                        setError("");
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      style={[
                        s.categoryCard,
                        selected && s.categoryCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          s.categoryIcon,
                          selected && s.categoryIconSelected,
                        ]}
                      >
                        <Text
                          style={[
                            s.categoryIconText,
                            selected && s.categoryIconTextSelected,
                          ]}
                        >
                          {item.icon}
                        </Text>
                      </View>

                      <View style={s.categoryText}>
                        <Text
                          style={[
                            s.categoryTitle,
                            selected && s.categoryTitleSelected,
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text style={s.categoryDescription}>
                          {item.description}
                        </Text>
                      </View>

                      <View
                        style={[
                          s.radio,
                          selected && s.radioSelected,
                        ]}
                      >
                        {selected && <View style={s.radioInner} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <View style={s.field}>
                <View style={s.labelRow}>
                  <Text style={s.label}>Booking ID</Text>
                  <Text style={s.optional}>OPTIONAL</Text>
                </View>

                <TextInput
                  value={bookingId}
                  onChangeText={(value) => {
                    setBookingId(value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="e.g. 1001"
                  placeholderTextColor={C.muted}
                  keyboardType="number-pad"
                  maxLength={20}
                  style={s.input}
                  accessibilityLabel="Booking ID"
                />

                <Text style={s.fieldHint}>
                  Include this for booking or payment issues.
                </Text>
              </View>

              <View style={s.field}>
                <View style={s.labelRow}>
                  <Text style={s.label}>Subject</Text>
                  <Text style={s.counter}>
                    {subject.length}/120
                  </Text>
                </View>

                <TextInput
                  value={subject}
                  onChangeText={(value) => {
                    setSubject(value);
                    setError("");
                  }}
                  placeholder="Briefly describe your issue"
                  placeholderTextColor={C.muted}
                  maxLength={120}
                  style={s.input}
                  accessibilityLabel="Support request subject"
                />
              </View>

              <View style={s.field}>
                <View style={s.labelRow}>
                  <Text style={s.label}>Describe the issue</Text>
                  <Text style={s.counter}>
                    {message.length}/1500
                  </Text>
                </View>

                <TextInput
                  value={message}
                  onChangeText={(value) => {
                    setMessage(value);
                    setError("");
                  }}
                  placeholder="Explain what happened and how we can help..."
                  placeholderTextColor={C.muted}
                  multiline
                  textAlignVertical="top"
                  maxLength={1500}
                  style={[s.input, s.messageInput]}
                  accessibilityLabel="Describe the support issue"
                />

                <Text style={s.fieldHint}>
                  Please do not include passwords, OTPs or card security codes.
                </Text>
              </View>

              <View style={s.field}>
                <Text style={s.label}>Priority</Text>

                <View style={s.priorityRow}>
                  <Pressable
                    onPress={() => setPriority("normal")}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: priority === "normal",
                    }}
                    style={[
                      s.priorityButton,
                      priority === "normal" &&
                      s.priorityNormalSelected,
                    ]}
                  >
                    <Text
                      style={[
                        s.priorityText,
                        priority === "normal" &&
                        s.priorityNormalText,
                      ]}
                    >
                      ◉ Normal
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setPriority("urgent")}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: priority === "urgent",
                    }}
                    style={[
                      s.priorityButton,
                      priority === "urgent" &&
                      s.priorityUrgentSelected,
                    ]}
                  >
                    <Text
                      style={[
                        s.priorityText,
                        priority === "urgent" &&
                        s.priorityUrgentText,
                      ]}
                    >
                      ! Urgent
                    </Text>
                  </Pressable>
                </View>

                {priority === "urgent" && (
                  <Text style={s.urgentHint}>
                    Select urgent only for time-sensitive service issues.
                  </Text>
                )}
              </View>

              <View style={s.selectedCategory}>
                <Text style={s.selectedCategoryLabel}>
                  SELECTED CATEGORY
                </Text>
                <Text style={s.selectedCategoryValue}>
                  {selectedCategory?.icon} {selectedCategory?.title}
                </Text>
              </View>

              {error ? (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>! {error}</Text>
                </View>
              ) : null}

              <AppButton
                title={
                  submitting
                    ? "Creating request..."
                    : "Submit support request →"
                }
                onPress={handleSubmitTicket}
                disabled={submitting}
              />

              <Text style={s.privacyNote}>
                By submitting, you confirm that the information
                provided is accurate. Backend submission will be
                added later.
              </Text>
            </View>
          </View>

          {/* RIGHT SIDEBAR: desktop only as a side column */}
          <View
            style={[
              s.sideColumn,
              isDesktop && s.sideColumnDesktop,
            ]}
          >
            <View style={s.contactCard}>
              <SectionTitle
                title="Other ways to get help"
                subtitle="Choose the most suitable option."
              />

              <View style={s.contactItem}>
                <View style={s.contactIcon}>
                  <Text style={s.contactIconText}>✉</Text>
                </View>
                <View style={s.contactText}>
                  <Text style={s.contactTitle}>Email support</Text>
                  <Text style={s.contactDescription}>
                    For detailed questions and follow-ups.
                  </Text>
                  <Text style={s.contactStatus}>
                    Available after setup
                  </Text>
                </View>
              </View>

              <View style={s.contactDivider} />

              <View style={s.contactItem}>
                <View style={s.contactIcon}>
                  <Text style={s.contactIconText}>☏</Text>
                </View>
                <View style={s.contactText}>
                  <Text style={s.contactTitle}>Phone support</Text>
                  <Text style={s.contactDescription}>
                    Speak to the support team.
                  </Text>
                  <Text style={s.contactStatus}>
                    Helpline to be configured
                  </Text>
                </View>
              </View>

              <View style={s.contactDivider} />

              <View style={s.contactItem}>
                <View style={s.contactIcon}>
                  <Text style={s.contactIconText}>◉</Text>
                </View>
                <View style={s.contactText}>
                  <Text style={s.contactTitle}>Support ticket</Text>
                  <Text style={s.contactDescription}>
                    Keep your issue details together.
                  </Text>
                  <Text style={s.contactStatus}>
                    Frontend demo available
                  </Text>
                </View>
              </View>
            </View>

            <View style={s.urgentCard}>
              <View style={s.urgentCardHeader}>
                <View style={s.urgentMark}>
                  <Text style={s.urgentMarkText}>!</Text>
                </View>
                <Text style={s.urgentCardTitle}>
                  Need urgent help?
                </Text>
              </View>

              <Text style={s.urgentCardDescription}>
                If a service issue needs immediate attention,
                include your booking ID and select Urgent priority
                in your request.
              </Text>

              <AppButton
                title="Create a request →"
                onPress={scrollToForm}
                secondary
              />
            </View>

            <View style={s.selfServiceCard}>
              <Text style={s.selfServiceEyebrow}>
                QUICK ACCESS
              </Text>
              <Text style={s.selfServiceTitle}>
                Manage it yourself
              </Text>
              <Text style={s.selfServiceDescription}>
                Access your account and service details.
              </Text>

              {[
                { title: "My bookings", path: "/bookings", icon: "▦" },
                { title: "My profile", path: "/profile", icon: "◎" },
                { title: "Notifications", path: "/notifications", icon: "♧" },
                { title: "Manage addresses", path: "/addresses", icon: "⌖" },
                { title: "Reset password", path: "/forgot-password", icon: "⌑" },
              ].map((item) => (
                <Pressable
                  key={item.title}
                  onPress={() => navigate(item.path)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    s.selfServiceLink,
                    pressed && s.selfServiceLinkPressed,
                  ]}
                >
                  <Text style={s.selfServiceIcon}>
                    {item.icon}
                  </Text>
                  <Text style={s.selfServiceLinkText}>
                    {item.title}
                  </Text>
                  <Text style={s.selfServiceArrow}>↗</Text>
                </Pressable>
              ))}
            </View>

            <View style={s.tipsCard}>
              <Text style={s.tipsTitle}>Helpful tips</Text>
              {[
                "Include your booking ID when relevant.",
                "Describe the issue clearly.",
                "Never share passwords or OTPs.",
                "Use urgent priority only when needed.",
              ].map((tip) => (
                <View key={tip} style={s.tipRow}>
                  <Text style={s.tipCheck}>✓</Text>
                  <Text style={s.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={s.footer}>
          <Text style={s.footerBrand}>ServiGo</Text>
          <Text style={s.footerText}>
            Making everyday services simpler.
          </Text>
          <Text style={s.footerCopyright}>
            © ServiGo · Help Center
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  page: {
    width: "100%",
    maxWidth: 1600,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  hero: {
    backgroundColor: C.dark,
    borderRadius: 24,
    padding: 30,
    minHeight: 270,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 22,
  },
  heroSmall: {
    padding: 20,
    borderRadius: 20,
    minHeight: 0,
  },
  heroContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7AD6B9",
  },
  eyebrowText: {
    color: "#A8DCD0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
  },
  heroTitle: {
    color: C.white,
    fontSize: 39,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  heroTitleSmall: {
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.7,
  },
  heroDescription: {
    marginTop: 13,
    color: "#C4D8D2",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 480,
  },
  heroAction: {
    alignSelf: "flex-start",
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: "#E7F4EF",
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  heroActionText: {
    color: C.primaryDark,
    fontSize: 12,
    fontWeight: "800",
  },
  heroIllustration: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    flexShrink: 0,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#28574F",
    borderWidth: 1,
    borderColor: "#47776D",
  },
  headset: {
    fontSize: 37,
    color: "#D9F1E8",
    fontWeight: "800",
  },
  heroBadge: {
    position: "absolute",
    right: 0,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#B7E8D6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: C.dark,
  },
  heroBadgeText: {
    color: C.primaryDark,
    fontWeight: "900",
    fontSize: 15,
  },

  quickLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    flexGrow: 1,
    flexBasis: 220,
    minWidth: 0,
    minHeight: 94,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  quickIconText: {
    color: C.primary,
    fontSize: 22,
    fontWeight: "700",
  },
  quickTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  quickTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },
  quickDescription: {
    marginTop: 5,
    color: C.secondary,
    fontSize: 11,
    lineHeight: 16,
  },
  quickArrow: {
    color: C.muted,
    fontSize: 15,
  },

  contentColumns: {
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
  contentColumnsDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mainColumn: {
    width: "100%",
    gap: 20,
    minWidth: 0,
  },
  mainColumnDesktop: {
    flex: 1,
    width: undefined,
    minWidth: 0,
  },
  sideColumn: {
    width: "100%",
    gap: 20,
    minWidth: 0,
  },
  sideColumnDesktop: {
    width: 300,
    flexShrink: 0,
  },
  card: {
    width: "100%",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 22,
  },
  sectionHeading: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    marginTop: 7,
    color: C.secondary,
    fontSize: 13,
    lineHeight: 20,
  },

  searchBox: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "#F8FBFA",
    borderRadius: 13,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchIcon: {
    color: C.primary,
    fontSize: 25,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: C.text,
    fontSize: 14,
    paddingVertical: 12,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as object)
      : {}),
  },
  clearSearch: {
    color: C.secondary,
    fontSize: 15,
    padding: 5,
  },
  faqList: {
    marginTop: 14,
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  faqTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  faqText: {
    flex: 1,
    minWidth: 0,
  },
  faqCategory: {
    color: C.primary,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  faqQuestion: {
    color: C.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
  },
  faqToggle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F0F5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  faqToggleOpen: {
    backgroundColor: C.primary,
  },
  faqToggleText: {
    color: C.primary,
    fontSize: 22,
    lineHeight: 25,
    fontWeight: "500",
  },
  faqToggleTextOpen: {
    color: C.white,
  },
  faqAnswer: {
    marginTop: 13,
    color: C.secondary,
    fontSize: 13,
    lineHeight: 22,
    paddingRight: 4,
  },
  emptyState: {
    padding: 25,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 36,
    color: C.primary,
  },
  emptyTitle: {
    marginTop: 10,
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyDescription: {
    marginTop: 6,
    color: C.secondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  faqFooter: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  faqFooterText: {
    color: C.secondary,
    fontSize: 13,
  },
  inlineLink: {
    color: C.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  label: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  optional: {
    color: C.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  counter: {
    color: C.muted,
    fontSize: 11,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    flexGrow: 1,
    flexBasis: 280,
    minWidth: 0,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryCardSelected: {
    borderColor: C.primary,
    backgroundColor: "#F1F8F5",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F4",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconSelected: {
    backgroundColor: "#DDEFE9",
  },
  categoryIconText: {
    fontSize: 21,
    color: C.secondary,
    fontWeight: "700",
  },
  categoryIconTextSelected: {
    color: C.primary,
  },
  categoryText: {
    flex: 1,
    minWidth: 0,
  },
  categoryTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },
  categoryTitleSelected: {
    color: C.primaryDark,
  },
  categoryDescription: {
    color: C.secondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#C5D3CF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: C.primary,
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.primary,
  },
  field: {
    marginTop: 18,
  },
  input: {
    width: "100%",
    minHeight: 49,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    backgroundColor: "#FAFCFB",
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: C.text,
    fontSize: 14,
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as object)
      : {}),
  },
  messageInput: {
    minHeight: 140,
    paddingTop: 14,
    lineHeight: 22,
  },
  fieldHint: {
    marginTop: 7,
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
  },
  priorityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  priorityButton: {
    minWidth: 120,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: C.white,
  },
  priorityNormalSelected: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },
  priorityUrgentSelected: {
    borderColor: "#E3A19B",
    backgroundColor: C.dangerLight,
  },
  priorityText: {
    color: C.secondary,
    fontSize: 13,
    fontWeight: "700",
  },
  priorityNormalText: {
    color: C.primaryDark,
  },
  priorityUrgentText: {
    color: C.danger,
  },
  urgentHint: {
    color: C.danger,
    marginTop: 8,
    fontSize: 11,
    lineHeight: 17,
  },
  selectedCategory: {
    marginTop: 22,
    padding: 15,
    borderRadius: 13,
    backgroundColor: "#F3F7F6",
  },
  selectedCategoryLabel: {
    color: C.muted,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  selectedCategoryValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 7,
  },
  errorBox: {
    marginTop: 15,
    padding: 13,
    backgroundColor: C.dangerLight,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#F2C4BF",
  },
  errorText: {
    color: C.danger,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: "600",
  },
  button: {
    marginTop: 20,
    minHeight: 51,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  buttonSecondary: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#D6E6E0",
  },
  buttonSecondaryText: {
    color: C.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.78,
  },
  privacyNote: {
    marginTop: 12,
    color: C.muted,
    fontSize: 10,
    lineHeight: 17,
    textAlign: "center",
  },
  successBox: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 13,
    backgroundColor: C.successLight,
    borderWidth: 1,
    borderColor: "#C5E9D4",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  successIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: C.success,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconText: {
    color: C.white,
    fontWeight: "900",
  },
  successContent: {
    flex: 1,
    minWidth: 0,
  },
  successTitle: {
    color: C.success,
    fontSize: 13,
    fontWeight: "800",
  },
  successDescription: {
    marginTop: 4,
    color: C.success,
    fontSize: 12,
  },
  successNote: {
    marginTop: 5,
    color: "#41745B",
    fontSize: 10,
    lineHeight: 16,
  },
  dismissText: {
    color: C.success,
    fontSize: 15,
    paddingHorizontal: 4,
  },

  contactCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  contactIconText: {
    fontSize: 21,
    color: C.primary,
    fontWeight: "700",
  },
  contactText: {
    flex: 1,
    minWidth: 0,
  },
  contactTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },
  contactDescription: {
    marginTop: 5,
    color: C.secondary,
    fontSize: 11,
    lineHeight: 17,
  },
  contactStatus: {
    marginTop: 7,
    color: C.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  contactDivider: {
    height: 1,
    backgroundColor: C.border,
  },
  urgentCard: {
    backgroundColor: C.warningLight,
    borderWidth: 1,
    borderColor: "#F0DFB6",
    borderRadius: 20,
    padding: 20,
  },
  urgentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  urgentMark: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F3E2B9",
    alignItems: "center",
    justifyContent: "center",
  },
  urgentMarkText: {
    color: C.warning,
    fontSize: 17,
    fontWeight: "900",
  },
  urgentCardTitle: {
    color: "#664612",
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  urgentCardDescription: {
    marginTop: 12,
    color: "#80632E",
    fontSize: 12,
    lineHeight: 20,
  },
  selfServiceCard: {
    backgroundColor: C.dark,
    borderRadius: 20,
    padding: 20,
  },
  selfServiceEyebrow: {
    color: "#A8DCD0",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  selfServiceTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 9,
  },
  selfServiceDescription: {
    color: "#C2D7D1",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 14,
  },
  selfServiceLink: {
    minHeight: 45,
    borderTopWidth: 1,
    borderTopColor: "#34574F",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 11,
  },
  selfServiceLinkPressed: {
    opacity: 0.7,
  },
  selfServiceIcon: {
    width: 24,
    color: "#A8DCD0",
    fontSize: 17,
    textAlign: "center",
  },
  selfServiceLinkText: {
    flex: 1,
    color: "#F0F7F4",
    fontSize: 12,
    fontWeight: "600",
  },
  selfServiceArrow: {
    color: "#A8DCD0",
    fontSize: 14,
  },
  tipsCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 20,
  },
  tipsTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 15,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  tipCheck: {
    color: C.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  tipText: {
    flex: 1,
    color: C.secondary,
    fontSize: 12,
    lineHeight: 19,
  },

  footer: {
    marginTop: 30,
    paddingVertical: 23,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerBrand: {
    color: C.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  footerText: {
    marginTop: 5,
    color: C.secondary,
    fontSize: 12,
  },
  footerCopyright: {
    marginTop: 12,
    color: C.muted,
    fontSize: 10,
  },
});
