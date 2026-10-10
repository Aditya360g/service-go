import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type ProviderService = {
  id: number;
  serviceId: number;
  name: string;
  price: number;
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
  initials: string;
  startingPrice: number;
  services: ProviderService[];
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
    startingPrice: 399,
    services: [
      {
        id: 101,
        serviceId: 1,
        name: "Home Cleaning",
        price: 499,
      },
      {
        id: 102,
        serviceId: 8,
        name: "Bathroom Cleaning",
        price: 399,
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
    startingPrice: 249,
    services: [
      {
        id: 201,
        serviceId: 2,
        name: "Electrician",
        price: 249,
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
    startingPrice: 299,
    services: [
      {
        id: 301,
        serviceId: 3,
        name: "Plumber",
        price: 299,
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
    startingPrice: 399,
    services: [
      {
        id: 401,
        serviceId: 4,
        name: "AC Repair",
        price: 399,
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
    startingPrice: 599,
    services: [
      {
        id: 501,
        serviceId: 5,
        name: "Washing Machine Repair",
        price: 599,
      },
    ],
  },

  {
    id: 6,
    name: "Manoj Sharma",
    profession: "Painter",
    location: "Jaipur, Rajasthan",
    rating: 4.5,
    reviewCount: 58,
    completedJobs: 132,
    experience: "7 years",
    verified: true,
    availableToday: false,
    initials: "MS",
    startingPrice: 999,
    services: [
      {
        id: 601,
        serviceId: 6,
        name: "Painting",
        price: 999,
      },
    ],
  },

  {
    id: 7,
    name: "Ajay Meena",
    profession: "Carpenter",
    location: "Jaipur, Rajasthan",
    rating: 4.4,
    reviewCount: 51,
    completedJobs: 148,
    experience: "6 years",
    verified: true,
    availableToday: true,
    initials: "AM",
    startingPrice: 299,
    services: [
      {
        id: 701,
        serviceId: 7,
        name: "Carpenter",
        price: 299,
      },
    ],
  },
];

const ratingOptions = [
  {
    label: "All",
    value: 0,
  },
  {
    label: "4.0+",
    value: 4,
  },
  {
    label: "4.5+",
    value: 4.5,
  },
  {
    label: "4.8+",
    value: 4.8,
  },
];

function RatingStars({
  rating,
}: {
  rating: number;
}) {
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

export default function ProviderSearchScreen() {
  const params = useLocalSearchParams<{
    serviceId?: string | string[];
    serviceName?: string | string[];
  }>();

  const serviceIdParam = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : params.serviceId;

  const serviceNameParam = Array.isArray(params.serviceName)
    ? params.serviceName[0]
    : params.serviceName;

  const requestedServiceId = Number(serviceIdParam);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Service filter from /services/:id
    if (
      requestedServiceId &&
      !Number.isNaN(requestedServiceId)
    ) {
      result = result.filter((provider) =>
        provider.services.some(
          (service) =>
            service.serviceId === requestedServiceId
        )
      );
    }

    // Name / profession / service search
    const searchQuery = search.trim().toLowerCase();

    if (searchQuery) {
      result = result.filter((provider) => {
        const providerMatch =
          provider.name
            .toLowerCase()
            .includes(searchQuery) ||
          provider.profession
            .toLowerCase()
            .includes(searchQuery);

        const serviceMatch = provider.services.some(
          (service) =>
            service.name
              .toLowerCase()
              .includes(searchQuery)
        );

        return providerMatch || serviceMatch;
      });
    }

    // Location filter
    const locationQuery = location
      .trim()
      .toLowerCase();

    if (locationQuery) {
      result = result.filter((provider) =>
        provider.location
          .toLowerCase()
          .includes(locationQuery)
      );
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(
        (provider) =>
          provider.rating >= minRating
      );
    }

    // Availability
    if (availableOnly) {
      result = result.filter(
        (provider) =>
          provider.availableToday
      );
    }

    return result;
  }, [
    search,
    location,
    minRating,
    availableOnly,
    requestedServiceId,
  ]);

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setMinRating(0);
    setAvailableOnly(false);
  };

  const openProvider = (
    provider: Provider
  ) => {
    if (
      requestedServiceId &&
      !Number.isNaN(requestedServiceId)
    ) {
      router.push({
        pathname: "/providers/[providerId]",
        params: {
          providerId: String(provider.id),
          serviceId: String(requestedServiceId),
        },
      });

      return;
    }

    router.push({
      pathname: "/providers/[providerId]",
      params: {
        providerId: String(provider.id),
      },
    });
  };

  const getRelevantService = (
    provider: Provider
  ) => {
    if (
      requestedServiceId &&
      !Number.isNaN(requestedServiceId)
    ) {
      const service =
        provider.services.find(
          (item) =>
            item.serviceId === requestedServiceId
        );

      if (service) {
        return service;
      }
    }

    return provider.services[0];
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row items-center justify-between"
          style={{
            maxWidth: 1200,
          }}
        >
          <Pressable
            onPress={() => router.back()}
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
          maxWidth: 1200,
        }}
      >
        {/* Page title */}
        <View className="mb-7">
          <Text className="text-3xl font-bold text-slate-900">
            Find Service Providers
          </Text>

          <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
            Compare verified professionals,
            ratings, experience and prices
            before booking your service.
          </Text>

          {serviceNameParam && (
            <View className="mt-4 self-start rounded-full bg-blue-50 px-4 py-2">
              <Text className="font-semibold text-blue-700">
                Service: {serviceNameParam}
              </Text>
            </View>
          )}
        </View>

        {/* Filters */}
        <View className="mb-7 rounded-3xl border border-slate-200 bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-slate-900">
            Search & Filters
          </Text>

          <View className="flex-row flex-wrap gap-4">
            {/* Search */}
            <View
              className="rounded-xl border border-slate-200 bg-slate-50 px-4"
              style={{
                minWidth: 250,
                flexBasis: 430,
                flexGrow: 1,
              }}
            >
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search provider or service..."
                placeholderTextColor="#94a3b8"
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>

            {/* Location */}
            <View
              className="rounded-xl border border-slate-200 bg-slate-50 px-4"
              style={{
                minWidth: 220,
                flexBasis: 300,
                flexGrow: 1,
              }}
            >
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Location e.g. Jaipur"
                placeholderTextColor="#94a3b8"
                className="py-4 text-base text-slate-900 outline-none"
              />
            </View>
          </View>

          {/* Rating Filter */}
          <View className="mt-5">
            <Text className="mb-3 text-sm font-bold text-slate-700">
              Minimum rating
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {ratingOptions.map(
                (option) => {
                  const active =
                    minRating ===
                    option.value;

                  return (
                    <Pressable
                      key={option.label}
                      onPress={() =>
                        setMinRating(
                          option.value
                        )
                      }
                      className={
                        active
                          ? "rounded-full bg-blue-600 px-5 py-2.5"
                          : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
                      }
                    >
                      <Text
                        className={
                          active
                            ? "font-semibold text-white"
                            : "font-semibold text-slate-600"
                        }
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>

          {/* Availability */}
          <View className="mt-5 flex-row flex-wrap items-center gap-3">
            <Pressable
              onPress={() =>
                setAvailableOnly(
                  (current) => !current
                )
              }
              className={
                availableOnly
                  ? "rounded-full bg-green-600 px-5 py-2.5"
                  : "rounded-full border border-slate-200 bg-white px-5 py-2.5"
              }
            >
              <Text
                className={
                  availableOnly
                    ? "font-semibold text-white"
                    : "font-semibold text-slate-600"
                }
              >
                {availableOnly
                  ? "✓ Available today"
                  : "Available today"}
              </Text>
            </Pressable>

            <Pressable
              onPress={resetFilters}
              className="rounded-full px-4 py-2.5"
            >
              <Text className="font-semibold text-red-500">
                Reset filters
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Result count */}
        <View className="mb-5 flex-row flex-wrap items-end justify-between gap-3">
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              Available Experts
            </Text>

            <Text className="mt-1 text-slate-500">
              {filteredProviders.length}{" "}
              {filteredProviders.length === 1
                ? "provider"
                : "providers"}{" "}
              found
            </Text>
          </View>

          {requestedServiceId &&
            !Number.isNaN(
              requestedServiceId
            ) && (
              <Pressable
                onPress={() =>
                  router.replace(
                    "/providers"
                  )
                }
              >
                <Text className="font-semibold text-blue-600">
                  View all providers
                </Text>
              </Pressable>
            )}
        </View>

        {/* Provider cards */}
        {filteredProviders.length > 0 ? (
          <View className="gap-4">
            {filteredProviders.map(
              (provider) => {
                const service =
                  getRelevantService(
                    provider
                  );

                return (
                  <Pressable
                    key={provider.id}
                    onPress={() =>
                      openProvider(
                        provider
                      )
                    }
                    className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6"
                  >
                    <View className="flex-row flex-wrap items-start gap-5">
                      {/* Avatar */}
                      <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <Text className="text-2xl font-bold text-blue-700">
                          {
                            provider.initials
                          }
                        </Text>
                      </View>

                      {/* Provider Information */}
                      <View
                        style={{
                          minWidth: 230,
                          flexBasis: 500,
                          flexGrow: 1,
                        }}
                      >
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Text className="text-xl font-bold text-slate-900">
                            {
                              provider.name
                            }
                          </Text>

                          {provider.verified && (
                            <View className="rounded-full bg-blue-50 px-3 py-1">
                              <Text className="text-xs font-bold text-blue-700">
                                ✓ Verified
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text className="mt-1 font-semibold text-slate-600">
                          {
                            provider.profession
                          }
                        </Text>

                        <Text className="mt-2 text-sm text-slate-500">
                          📍{" "}
                          {
                            provider.location
                          }
                        </Text>

                        {/* Rating */}
                        <View className="mt-3 flex-row flex-wrap items-center gap-2">
                          <RatingStars
                            rating={
                              provider.rating
                            }
                          />

                          <Text className="font-bold text-slate-800">
                            {
                              provider.rating
                            }
                          </Text>

                          <Text className="text-sm text-slate-500">
                            (
                            {
                              provider.reviewCount
                            }{" "}
                            reviews)
                          </Text>
                        </View>

                        {/* Stats */}
                        <View className="mt-4 flex-row flex-wrap gap-4">
                          <Text className="text-sm text-slate-600">
                            🛠{" "}
                            {
                              provider.completedJobs
                            }
                            + jobs
                          </Text>

                          <Text className="text-sm text-slate-600">
                            ⏱{" "}
                            {
                              provider.experience
                            }{" "}
                            experience
                          </Text>
                        </View>

                        {/* Availability */}
                        <View className="mt-4 self-start">
                          {provider.availableToday ? (
                            <View className="rounded-full bg-green-50 px-3 py-1.5">
                              <Text className="text-xs font-bold text-green-700">
                                ● Available
                                today
                              </Text>
                            </View>
                          ) : (
                            <View className="rounded-full bg-amber-50 px-3 py-1.5">
                              <Text className="text-xs font-bold text-amber-700">
                                Next slot
                                available soon
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Service and Price */}
                      <View
                        className="rounded-2xl bg-slate-50 p-5"
                        style={{
                          minWidth: 220,
                          flexBasis: 250,
                        }}
                      >
                        <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Service
                        </Text>

                        <Text className="mt-1 text-base font-bold text-slate-900">
                          {service?.name ??
                            provider.profession}
                        </Text>

                        <Text className="mt-4 text-xs text-slate-400">
                          Starting from
                        </Text>

                        <Text className="mt-1 text-2xl font-bold text-slate-900">
                          ₹
                          {service?.price ??
                            provider.startingPrice}
                        </Text>

                        <Pressable
                          onPress={() =>
                            openProvider(
                              provider
                            )
                          }
                          className="mt-5 items-center rounded-xl bg-blue-600 px-5 py-3.5"
                        >
                          <Text className="font-bold text-white">
                            View Profile →
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                );
              }
            )}
          </View>
        ) : (
          /* Empty State */
          <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-16">
            <Text className="text-5xl">
              🔎
            </Text>

            <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
              No providers found
            </Text>

            <Text className="mt-2 max-w-lg text-center leading-6 text-slate-500">
              We could not find a
              provider matching your
              current filters. Try
              changing the search,
              location or rating.
            </Text>

            <Pressable
              onPress={resetFilters}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3.5"
            >
              <Text className="font-bold text-white">
                Reset Filters
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}