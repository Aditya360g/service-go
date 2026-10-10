import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type ProviderService = {
  id: number;
  serviceId: number;
  name: string;
  price: number;
  duration: string;
  description: string;
};

type Review = {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
};

type Provider = {
  id: number;
  name: string;
  profession: string;
  location: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experience: string;
  verified: boolean;
  availableToday: boolean;
  about: string;
  initials: string;
  services: ProviderService[];
  reviews: Review[];
};

const providers: Provider[] = [
  {
    id: 1,
    name: "Amit Sharma",
    profession: "Home Service Expert",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    reviewCount: 126,
    completedJobs: 340,
    experience: "6 years",
    verified: true,
    availableToday: true,
    initials: "AS",
    about:
      "Experienced home-service professional focused on quality work, transparent pricing and reliable doorstep service.",
    services: [
      {
        id: 101,
        serviceId: 1,
        name: "Home Cleaning",
        price: 499,
        duration: "2 - 4 hours",
        description:
          "Complete home cleaning including floors, dusting, kitchen surfaces and bathrooms.",
      },
      {
        id: 102,
        serviceId: 8,
        name: "Bathroom Cleaning",
        price: 399,
        duration: "1 - 2 hours",
        description:
          "Deep bathroom cleaning covering floors, tiles and common fixtures.",
      },
    ],
    reviews: [
      {
        id: 1,
        customerName: "Rahul",
        rating: 5,
        comment:
          "Very professional service. Arrived on time and completed the work properly.",
        date: "12 Sep 2026",
      },
      {
        id: 2,
        customerName: "Neha",
        rating: 4,
        comment:
          "Good experience overall and the work was completed neatly.",
        date: "08 Sep 2026",
      },
    ],
  },

  {
    id: 2,
    name: "Rohit Verma",
    profession: "Electrician",
    location: "Jaipur, Rajasthan",
    rating: 4.7,
    reviewCount: 89,
    completedJobs: 215,
    experience: "5 years",
    verified: true,
    availableToday: true,
    initials: "RV",
    about:
      "Electrician experienced in residential electrical repair, installation and common household electrical work.",
    services: [
      {
        id: 201,
        serviceId: 2,
        name: "Electrician",
        price: 249,
        duration: "30 min - 2 hours",
        description:
          "Electrical repair, switches, sockets, fans, lights and basic wiring work.",
      },
    ],
    reviews: [
      {
        id: 3,
        customerName: "Mohit",
        rating: 5,
        comment:
          "Quickly found the electrical issue and completed the repair.",
        date: "10 Sep 2026",
      },
      {
        id: 4,
        customerName: "Karan",
        rating: 4,
        comment:
          "Good work and clear explanation of the problem.",
        date: "04 Sep 2026",
      },
    ],
  },

  {
    id: 3,
    name: "Vikas Kumar",
    profession: "Plumber",
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    reviewCount: 174,
    completedJobs: 420,
    experience: "8 years",
    verified: true,
    availableToday: false,
    initials: "VK",
    about:
      "Professional plumber providing household plumbing repairs, leakage fixes and fitting installation.",
    services: [
      {
        id: 301,
        serviceId: 3,
        name: "Plumber",
        price: 299,
        duration: "30 min - 2 hours",
        description:
          "Tap repairs, pipe leakage, drainage inspection and bathroom fitting work.",
      },
    ],
    reviews: [
      {
        id: 5,
        customerName: "Ankit",
        rating: 5,
        comment:
          "Fixed the leakage quickly. Very satisfied with the service.",
        date: "11 Sep 2026",
      },
    ],
  },

  {
    id: 4,
    name: "Sandeep Singh",
    profession: "AC Technician",
    location: "Jaipur, Rajasthan",
    rating: 4.6,
    reviewCount: 67,
    completedJobs: 180,
    experience: "4 years",
    verified: true,
    availableToday: true,
    initials: "SS",
    about:
      "AC service technician experienced with servicing, inspection, installation and common cooling issues.",
    services: [
      {
        id: 401,
        serviceId: 4,
        name: "AC Repair",
        price: 399,
        duration: "1 - 2 hours",
        description:
          "AC inspection, servicing and diagnosis of common cooling problems.",
      },
    ],
    reviews: [
      {
        id: 6,
        customerName: "Deepak",
        rating: 5,
        comment:
          "AC cooling improved after the service. Professional behaviour.",
        date: "06 Sep 2026",
      },
    ],
  },

  {
    id: 5,
    name: "Rahul Provider",
    profession: "Appliance Technician",
    location: "Jaipur, Rajasthan",
    rating: 5,
    reviewCount: 42,
    completedJobs: 96,
    experience: "4 years",
    verified: true,
    availableToday: true,
    initials: "RP",
    about:
      "Appliance service professional specialising in washing machine inspection, maintenance and repair.",
    services: [
      {
        id: 501,
        serviceId: 5,
        name: "Washing Machine Repair",
        price: 599,
        duration: "1 - 2 hours",
        description:
          "Washing machine inspection, diagnosis and common repair services.",
      },
    ],
    reviews: [
      {
        id: 7,
        customerName: "Aman",
        rating: 5,
        comment:
          "Excellent work. Washing machine issue was identified and resolved properly.",
        date: "14 Sep 2026",
      },
      {
        id: 8,
        customerName: "Priya",
        rating: 5,
        comment:
          "Very good service and professional communication.",
        date: "09 Sep 2026",
      },
    ],
  },
];

function RatingStars({ rating }: { rating: number }) {
  const roundedRating = Math.round(rating);

  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          className={
            star <= roundedRating
              ? "text-lg text-amber-500"
              : "text-lg text-slate-300"
          }
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View
      className="rounded-2xl bg-slate-50 p-4"
      style={{
        minWidth: 130,
        flexBasis: 150,
        flexGrow: 1,
      }}
    >
      <Text className="text-xl font-bold text-slate-900">
        {value}
      </Text>

      <Text className="mt-1 text-sm text-slate-500">
        {label}
      </Text>
    </View>
  );
}

export default function ProviderDetailsScreen() {
  const params = useLocalSearchParams<{
    providerId?: string | string[];
    serviceId?: string | string[];
  }>();

  const [selectedServiceId, setSelectedServiceId] =
    useState<number | null>(null);

  const providerIdParam = Array.isArray(params.providerId)
    ? params.providerId[0]
    : params.providerId;

  const serviceIdParam = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : params.serviceId;

  const providerId = Number(providerIdParam);
  const requestedServiceId = Number(serviceIdParam);

  const provider = useMemo(
    () => providers.find((item) => item.id === providerId),
    [providerId]
  );

  const visibleServices = useMemo(() => {
    if (!provider) {
      return [];
    }

    if (!requestedServiceId || Number.isNaN(requestedServiceId)) {
      return provider.services;
    }

    const matchingServices = provider.services.filter(
      (service) => service.serviceId === requestedServiceId
    );

    return matchingServices.length > 0
      ? matchingServices
      : provider.services;
  }, [provider, requestedServiceId]);

  const selectedService = useMemo(() => {
    if (!provider) {
      return undefined;
    }

    if (selectedServiceId) {
      return provider.services.find(
        (service) => service.id === selectedServiceId
      );
    }

    if (requestedServiceId && !Number.isNaN(requestedServiceId)) {
      const requested = provider.services.find(
        (service) => service.serviceId === requestedServiceId
      );

      if (requested) {
        return requested;
      }
    }

    return provider.services[0];
  }, [provider, requestedServiceId, selectedServiceId]);

  if (!provider) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-5">
        <View
          className="w-full rounded-3xl border border-slate-200 bg-white p-8"
          style={{ maxWidth: 520 }}
        >
          <Text className="text-center text-5xl">
            👨‍🔧
          </Text>

          <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
            Provider not found
          </Text>

          <Text className="mt-2 text-center leading-6 text-slate-500">
            This service professional is currently unavailable.
          </Text>

          <Pressable
            onPress={() => router.replace("/providers")}
            className="mt-6 items-center rounded-xl bg-blue-600 px-5 py-4"
          >
            <Text className="font-bold text-white">
              Browse Providers
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const bookService = (providerServiceId: number) => {
    router.push({
      pathname: "/booking/[providerServiceId]",
      params: {
        providerServiceId: String(providerServiceId),
        providerId: String(provider.id),
      },
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Navigation */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{ maxWidth: 1200 }}
        >
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl px-2 py-2"
          >
            <Text className="font-semibold text-blue-600">
              ← Back
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push("/")}>
            <Text className="text-xl font-bold text-blue-600">
              ServiGo
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        className="mx-auto w-full px-5 py-8"
        style={{ maxWidth: 1200 }}
      >
        {/* Provider Header */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <View className="flex-row flex-wrap items-start gap-5">
            {/* Avatar */}
            <View className="h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-3xl font-bold text-blue-700">
                {provider.initials}
              </Text>
            </View>

            {/* Main Information */}
            <View
              style={{
                minWidth: 240,
                flexBasis: 500,
                flexGrow: 1,
              }}
            >
              <View className="mb-2 flex-row flex-wrap items-center gap-2">
                <Text className="text-3xl font-bold text-slate-900">
                  {provider.name}
                </Text>

                {provider.verified && (
                  <View className="rounded-full bg-blue-50 px-3 py-1">
                    <Text className="text-xs font-bold text-blue-700">
                      ✓ Verified
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-base font-semibold text-slate-600">
                {provider.profession}
              </Text>

              <Text className="mt-2 text-slate-500">
                📍 {provider.location}
              </Text>

              <View className="mt-3 flex-row flex-wrap items-center gap-2">
                <RatingStars rating={provider.rating} />

                <Text className="font-bold text-slate-800">
                  {provider.rating}
                </Text>

                <Text className="text-slate-500">
                  ({provider.reviewCount} reviews)
                </Text>
              </View>

              <View className="mt-4 self-start">
                {provider.availableToday ? (
                  <View className="rounded-full bg-green-50 px-4 py-2">
                    <Text className="text-sm font-bold text-green-700">
                      ● Available today
                    </Text>
                  </View>
                ) : (
                  <View className="rounded-full bg-amber-50 px-4 py-2">
                    <Text className="text-sm font-bold text-amber-700">
                      Next slot available soon
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Book CTA */}
            {selectedService && (
              <View
                className="rounded-2xl bg-slate-900 p-5"
                style={{
                  minWidth: 220,
                  flexBasis: 260,
                }}
              >
                <Text className="text-sm text-slate-400">
                  Service starts from
                </Text>

                <Text className="mt-1 text-3xl font-bold text-white">
                  ₹{selectedService.price}
                </Text>

                <Text className="mt-1 text-sm text-slate-400">
                  {selectedService.name}
                </Text>

                <Pressable
                  onPress={() => bookService(selectedService.id)}
                  className="mt-5 items-center rounded-xl bg-blue-600 px-5 py-4"
                >
                  <Text className="font-bold text-white">
                    Book Now
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="mb-6 flex-row flex-wrap gap-4">
          <StatCard
            value={`${provider.rating} ★`}
            label="Rating"
          />

          <StatCard
            value={`${provider.completedJobs}+`}
            label="Jobs completed"
          />

          <StatCard
            value={provider.experience}
            label="Experience"
          />

          <StatCard
            value={`${provider.reviewCount}`}
            label="Customer reviews"
          />
        </View>

        {/* About */}
        <View className="mb-6 rounded-3xl border border-slate-200 bg-white p-6">
          <Text className="text-2xl font-bold text-slate-900">
            About
          </Text>

          <Text className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
            {provider.about}
          </Text>
        </View>

        {/* Services */}
        <View className="mb-6">
          <View className="mb-5">
            <Text className="text-2xl font-bold text-slate-900">
              Services offered
            </Text>

            <Text className="mt-1 text-slate-500">
              Select the service you want to book.
            </Text>
          </View>

          <View className="gap-4">
            {visibleServices.map((service) => {
              const isSelected =
                selectedService?.id === service.id;

              return (
                <Pressable
                  key={service.id}
                  onPress={() =>
                    setSelectedServiceId(service.id)
                  }
                  className={
                    isSelected
                      ? "rounded-3xl border-2 border-blue-600 bg-white p-6"
                      : "rounded-3xl border border-slate-200 bg-white p-6"
                  }
                >
                  <View className="flex-row flex-wrap items-center justify-between gap-5">
                    <View
                      style={{
                        minWidth: 220,
                        flexBasis: 550,
                        flexGrow: 1,
                      }}
                    >
                      <View className="mb-2 flex-row flex-wrap items-center gap-2">
                        <Text className="text-xl font-bold text-slate-900">
                          {service.name}
                        </Text>

                        {isSelected && (
                          <View className="rounded-full bg-blue-50 px-3 py-1">
                            <Text className="text-xs font-bold text-blue-700">
                              Selected
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text className="leading-6 text-slate-500">
                        {service.description}
                      </Text>

                      <Text className="mt-3 text-sm font-semibold text-slate-600">
                        ⏱ {service.duration}
                      </Text>
                    </View>

                    <View>
                      <Text className="text-sm text-slate-400">
                        Starting from
                      </Text>

                      <Text className="mt-1 text-2xl font-bold text-slate-900">
                        ₹{service.price}
                      </Text>

                      <Pressable
                        onPress={() =>
                          bookService(service.id)
                        }
                        className="mt-3 rounded-xl bg-blue-600 px-5 py-3"
                      >
                        <Text className="text-center font-bold text-white">
                          Book Service
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reviews */}
        <View className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <View className="mb-6 flex-row flex-wrap items-center justify-between gap-4">
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                Customer Reviews
              </Text>

              <Text className="mt-1 text-slate-500">
                Feedback from ServiGo customers
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-3xl font-bold text-slate-900">
                {provider.rating}
              </Text>

              <RatingStars rating={provider.rating} />

              <Text className="mt-1 text-xs text-slate-400">
                {provider.reviewCount} reviews
              </Text>
            </View>
          </View>

          {provider.reviews.length > 0 ? (
            <View className="gap-4">
              {provider.reviews.map((review) => (
                <View
                  key={review.id}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <View className="flex-row flex-wrap items-start justify-between gap-3">
                    <View>
                      <Text className="font-bold text-slate-900">
                        {review.customerName}
                      </Text>

                      <View className="mt-1">
                        <RatingStars
                          rating={review.rating}
                        />
                      </View>
                    </View>

                    <Text className="text-xs text-slate-400">
                      {review.date}
                    </Text>
                  </View>

                  <Text className="mt-3 leading-6 text-slate-600">
                    {review.comment}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="rounded-2xl bg-slate-50 p-8">
              <Text className="text-center font-semibold text-slate-700">
                No reviews yet
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Booking CTA */}
        {selectedService && (
          <View className="mt-6 rounded-3xl bg-blue-600 p-7 md:p-8">
            <View className="flex-row flex-wrap items-center justify-between gap-6">
              <View
                style={{
                  minWidth: 240,
                  flexBasis: 550,
                  flexGrow: 1,
                }}
              >
                <Text className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                  Selected service
                </Text>

                <Text className="mt-2 text-2xl font-bold text-white">
                  {selectedService.name}
                </Text>

                <Text className="mt-2 text-blue-100">
                  {provider.name} • Starting ₹
                  {selectedService.price}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  bookService(selectedService.id)
                }
                className="rounded-xl bg-white px-7 py-4"
              >
                <Text className="font-bold text-blue-700">
                  Continue to Booking →
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}