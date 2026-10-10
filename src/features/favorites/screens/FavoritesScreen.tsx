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

type FavoriteProvider = {
  favoriteId: number;

  providerId: number;
  providerServiceId: number;
  serviceId: number;

  name: string;
  initials: string;
  profession: string;
  serviceName: string;

  location: string;

  rating: number;
  reviews: number;
  completedJobs: number;
  experience: string;

  startingPrice: number;

  verified: boolean;
  availableToday: boolean;

  savedAt: string;
};

type ServiceFilter =
  | "all"
  | "cleaning"
  | "electrician"
  | "plumber"
  | "ac"
  | "appliance";

const initialFavorites: FavoriteProvider[] = [
  {
    favoriteId: 1,

    providerId: 1,
    providerServiceId: 101,
    serviceId: 1,

    name: "Amit Sharma",
    initials: "AS",
    profession: "Home Service Expert",
    serviceName: "Home Cleaning",

    location: "Jaipur, Rajasthan",

    rating: 4.8,
    reviews: 126,
    completedJobs: 340,
    experience: "5 years",

    startingPrice: 499,

    verified: true,
    availableToday: true,

    savedAt: "18 Sep 2026",
  },

  {
    favoriteId: 2,

    providerId: 2,
    providerServiceId: 201,
    serviceId: 2,

    name: "Rohit Verma",
    initials: "RV",
    profession: "Electrician",
    serviceName: "Electrician",

    location: "Jaipur, Rajasthan",

    rating: 4.7,
    reviews: 94,
    completedJobs: 281,
    experience: "6 years",

    startingPrice: 249,

    verified: true,
    availableToday: false,

    savedAt: "17 Sep 2026",
  },

  {
    favoriteId: 3,

    providerId: 3,
    providerServiceId: 301,
    serviceId: 3,

    name: "Vikas Kumar",
    initials: "VK",
    profession: "Plumber",
    serviceName: "Plumber",

    location: "Jaipur, Rajasthan",

    rating: 4.9,
    reviews: 181,
    completedJobs: 420,
    experience: "7 years",

    startingPrice: 299,

    verified: true,
    availableToday: true,

    savedAt: "15 Sep 2026",
  },

  {
    favoriteId: 4,

    providerId: 4,
    providerServiceId: 401,
    serviceId: 4,

    name: "Sandeep Singh",
    initials: "SS",
    profession: "AC Technician",
    serviceName: "AC Repair",

    location: "Jaipur, Rajasthan",

    rating: 4.6,
    reviews: 78,
    completedJobs: 198,
    experience: "4 years",

    startingPrice: 399,

    verified: true,
    availableToday: true,

    savedAt: "12 Sep 2026",
  },

  {
    favoriteId: 5,

    providerId: 5,
    providerServiceId: 501,
    serviceId: 5,

    name: "Rahul Provider",
    initials: "RP",
    profession: "Appliance Technician",
    serviceName: "Washing Machine Repair",

    location: "Jaipur, Rajasthan",

    rating: 5,
    reviews: 42,
    completedJobs: 109,
    experience: "3 years",

    startingPrice: 599,

    verified: true,
    availableToday: true,

    savedAt: "10 Sep 2026",
  },
];

const filters: {
  label: string;
  value: ServiceFilter;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Cleaning",
      value: "cleaning",
    },
    {
      label: "Electrician",
      value: "electrician",
    },
    {
      label: "Plumber",
      value: "plumber",
    },
    {
      label: "AC Repair",
      value: "ac",
    },
    {
      label: "Appliance",
      value: "appliance",
    },
  ];

function matchesServiceFilter(
  provider: FavoriteProvider,
  filter: ServiceFilter
) {
  if (filter === "all") {
    return true;
  }

  const searchable = [
    provider.profession,
    provider.serviceName,
  ]
    .join(" ")
    .toLowerCase();

  if (filter === "cleaning") {
    return searchable.includes("clean");
  }

  if (filter === "electrician") {
    return searchable.includes("electric");
  }

  if (filter === "plumber") {
    return searchable.includes("plumb");
  }

  if (filter === "ac") {
    return searchable.includes("ac");
  }

  if (filter === "appliance") {
    return (
      searchable.includes("appliance") ||
      searchable.includes("washing")
    );
  }

  return true;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] =
    useState<FavoriteProvider[]>(
      initialFavorites
    );

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<ServiceFilter>(
      "all"
    );

  const [
    availableOnly,
    setAvailableOnly,
  ] = useState(false);

  const [
    removingId,
    setRemovingId,
  ] =
    useState<number | null>(
      null
    );

  const filteredFavorites =
    useMemo(() => {
      let result = [
        ...favorites,
      ];

      if (
        activeFilter !== "all"
      ) {
        result =
          result.filter(
            (provider) =>
              matchesServiceFilter(
                provider,
                activeFilter
              )
          );
      }

      if (availableOnly) {
        result =
          result.filter(
            (provider) =>
              provider.availableToday
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (provider) => {
              const searchable =
                [
                  provider.name,
                  provider.profession,
                  provider.serviceName,
                  provider.location,
                ]
                  .join(" ")
                  .toLowerCase();

              return searchable.includes(
                query
              );
            }
          );
      }

      return result.sort(
        (a, b) =>
          b.rating -
          a.rating
      );
    }, [
      favorites,
      search,
      activeFilter,
      availableOnly,
    ]);

  const openProvider = (
    provider: FavoriteProvider
  ) => {
    router.push({
      pathname:
        "/providers/[providerId]",

      params: {
        providerId:
          String(
            provider.providerId
          ),

        serviceId:
          String(
            provider.serviceId
          ),
      },
    });
  };

  const openBooking = (
    provider: FavoriteProvider
  ) => {
    router.push({
      pathname:
        "/booking/[providerServiceId]",

      params: {
        providerServiceId:
          String(
            provider.providerServiceId
          ),

        providerId:
          String(
            provider.providerId
          ),
      },
    });
  };

  const performRemove =
    async (
      provider: FavoriteProvider
    ) => {
      setRemovingId(
        provider.favoriteId
      );

      try {
        /*
          =====================================
          BACKEND INTEGRATION LATER
          =====================================

          await favoritesApi.removeFavorite(
            provider.providerId
          );

          Example:

          DELETE /favorites/providers/:providerId

          Or backend design:

          DELETE /favorites/:favoriteId

          UI ko rewrite nahi karna padega.
        */

        setFavorites(
          (current) =>
            current.filter(
              (item) =>
                item.favoriteId !==
                provider.favoriteId
            )
        );
      } catch (error) {
        console.error(
          "Remove favorite error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to remove provider from favorites."
          );
        } else {
          Alert.alert(
            "Unable to Remove",
            "Could not remove this provider from favorites."
          );
        }
      } finally {
        setRemovingId(
          null
        );
      }
    };

  const handleRemove = (
    provider: FavoriteProvider
  ) => {
    if (
      Platform.OS === "web"
    ) {
      const confirmed =
        window.confirm(
          `Remove ${provider.name} from your favorites?`
        );

      if (confirmed) {
        performRemove(
          provider
        );
      }

      return;
    }

    Alert.alert(
      "Remove Favorite",
      `Remove ${provider.name} from your favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style:
            "destructive",

          onPress: () =>
            performRemove(
              provider
            ),
        },
      ]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("all");
    setAvailableOnly(false);
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
        {/* HEADING */}
        <View className="mb-7 flex-row flex-wrap items-end justify-between gap-5">
          <View
            style={{
              minWidth: 240,
              flexBasis: 600,
              flexGrow: 1,
            }}
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Saved Professionals
            </Text>

            <Text className="mt-2 text-3xl font-bold text-slate-900">
              Favorite Providers
            </Text>

            <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
              Quickly find providers you
              trust and book their
              services again.
            </Text>
          </View>

          <Pressable
            onPress={() =>
              router.push(
                "/providers"
              )
            }
            className="rounded-xl bg-blue-600 px-6 py-4"
          >
            <Text className="font-bold text-white">
              + Find Providers
            </Text>
          </Pressable>
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
            <Text className="text-2xl font-bold text-slate-900">
              {favorites.length}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Saved Providers
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
            <Text className="text-2xl font-bold text-green-600">
              {
                favorites.filter(
                  (provider) =>
                    provider.availableToday
                ).length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Available Today
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
            <Text className="text-2xl font-bold text-slate-900">
              {favorites.length > 0
                ? (
                  favorites.reduce(
                    (
                      total,
                      provider
                    ) =>
                      total +
                      provider.rating,
                    0
                  ) /
                  favorites.length
                ).toFixed(1)
                : "0.0"}
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Average Rating
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <View className="mb-5 rounded-2xl border border-slate-200 bg-white px-4">
          <TextInput
            value={search}
            onChangeText={
              setSearch
            }
            placeholder="Search provider, service or location..."
            placeholderTextColor="#94a3b8"
            className="py-4 text-base text-slate-900 outline-none"
          />
        </View>

        {/* FILTERS */}
        <View className="mb-4 flex-row flex-wrap gap-2">
          {filters.map(
            (filter) => {
              const selected =
                activeFilter ===
                filter.value;

              return (
                <Pressable
                  key={
                    filter.value
                  }
                  onPress={() =>
                    setActiveFilter(
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
                    {filter.label}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* AVAILABLE TOGGLE */}
        <View className="mb-7 flex-row flex-wrap items-center justify-between gap-3">
          <Pressable
            onPress={() =>
              setAvailableOnly(
                (current) =>
                  !current
              )
            }
            className={
              availableOnly
                ? "flex-row items-center rounded-xl border-2 border-green-600 bg-green-50 px-4 py-3"
                : "flex-row items-center rounded-xl border border-slate-200 bg-white px-4 py-3"
            }
          >
            <View
              className={
                availableOnly
                  ? "mr-3 h-5 w-5 items-center justify-center rounded-md bg-green-600"
                  : "mr-3 h-5 w-5 rounded-md border-2 border-slate-300"
              }
            >
              {availableOnly && (
                <Text className="text-xs font-bold text-white">
                  ✓
                </Text>
              )}
            </View>

            <Text
              className={
                availableOnly
                  ? "font-semibold text-green-700"
                  : "font-semibold text-slate-600"
              }
            >
              Available today only
            </Text>
          </Pressable>

          {(search ||
            activeFilter !==
            "all" ||
            availableOnly) && (
              <Pressable
                onPress={
                  clearFilters
                }
              >
                <Text className="font-semibold text-blue-600">
                  Clear Filters
                </Text>
              </Pressable>
            )}
        </View>

        {/* RESULTS HEADER */}
        <View className="mb-5">
          <Text className="text-xl font-bold text-slate-900">
            Your Favorites
          </Text>

          <Text className="mt-1 text-sm text-slate-500">
            {
              filteredFavorites.length
            }{" "}
            {filteredFavorites.length ===
              1
              ? "provider"
              : "providers"}{" "}
            found
          </Text>
        </View>

        {/* FAVORITES LIST */}
        {filteredFavorites.length >
          0 ? (
          <View className="gap-4">
            {filteredFavorites.map(
              (provider) => {
                const removing =
                  removingId ===
                  provider.favoriteId;

                return (
                  <View
                    key={
                      provider.favoriteId
                    }
                    className="rounded-3xl border border-slate-200 bg-white p-6"
                  >
                    <View className="flex-row flex-wrap items-start gap-5">
                      {/* PROVIDER AVATAR */}
                      <Pressable
                        onPress={() =>
                          openProvider(
                            provider
                          )
                        }
                        className="h-20 w-20 items-center justify-center rounded-full bg-blue-100"
                      >
                        <Text className="text-2xl font-bold text-blue-700">
                          {
                            provider.initials
                          }
                        </Text>
                      </Pressable>

                      {/* INFORMATION */}
                      <View
                        style={{
                          minWidth: 220,
                          flexBasis: 520,
                          flexGrow: 1,
                        }}
                      >
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Pressable
                            onPress={() =>
                              openProvider(
                                provider
                              )
                            }
                          >
                            <Text className="text-xl font-bold text-slate-900">
                              {
                                provider.name
                              }
                            </Text>
                          </Pressable>

                          {provider.verified && (
                            <View className="rounded-full bg-green-50 px-3 py-1">
                              <Text className="text-xs font-bold text-green-700">
                                ✓ Verified
                              </Text>
                            </View>
                          )}

                          <View className="rounded-full bg-red-50 px-3 py-1">
                            <Text className="text-xs font-bold text-red-600">
                              ♥ Favorite
                            </Text>
                          </View>
                        </View>

                        <Text className="mt-1 font-semibold text-blue-600">
                          {
                            provider.profession
                          }
                        </Text>

                        <Text className="mt-1 text-sm text-slate-500">
                          {
                            provider.serviceName
                          }
                        </Text>

                        <Text className="mt-3 text-sm text-slate-500">
                          📍{" "}
                          {
                            provider.location
                          }
                        </Text>

                        <View className="mt-4 flex-row flex-wrap gap-4">
                          <Text className="text-sm font-semibold text-slate-700">
                            ⭐{" "}
                            {
                              provider.rating
                            }{" "}
                            (
                            {
                              provider.reviews
                            }
                            )
                          </Text>

                          <Text className="text-sm font-semibold text-slate-700">
                            🛠️{" "}
                            {
                              provider.completedJobs
                            }{" "}
                            jobs
                          </Text>

                          <Text className="text-sm font-semibold text-slate-700">
                            🏆{" "}
                            {
                              provider.experience
                            }
                          </Text>
                        </View>

                        <View className="mt-4 flex-row flex-wrap items-center gap-3">
                          <View
                            className={
                              provider.availableToday
                                ? "rounded-full bg-green-50 px-3 py-1.5"
                                : "rounded-full bg-slate-100 px-3 py-1.5"
                            }
                          >
                            <Text
                              className={
                                provider.availableToday
                                  ? "text-xs font-bold text-green-700"
                                  : "text-xs font-bold text-slate-500"
                              }
                            >
                              {provider.availableToday
                                ? "● Available Today"
                                : "Not Available Today"}
                            </Text>
                          </View>

                          <Text className="text-xs text-slate-400">
                            Saved{" "}
                            {
                              provider.savedAt
                            }
                          </Text>
                        </View>
                      </View>

                      {/* PRICE + ACTIONS */}
                      <View
                        style={{
                          minWidth: 170,
                        }}
                      >
                        <View className="mb-3 rounded-2xl bg-slate-50 p-4">
                          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Starting From
                          </Text>

                          <Text className="mt-1 text-2xl font-bold text-slate-900">
                            ₹
                            {
                              provider.startingPrice
                            }
                          </Text>
                        </View>

                        <Pressable
                          onPress={() =>
                            openProvider(
                              provider
                            )
                          }
                          className="mb-2 items-center rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
                        >
                          <Text className="font-bold text-blue-700">
                            View Profile
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() =>
                            openBooking(
                              provider
                            )
                          }
                          className="mb-2 items-center rounded-xl bg-blue-600 px-5 py-3"
                        >
                          <Text className="font-bold text-white">
                            Book Now
                          </Text>
                        </Pressable>

                        <Pressable
                          disabled={
                            removing
                          }
                          onPress={() =>
                            handleRemove(
                              provider
                            )
                          }
                          className={
                            removing
                              ? "items-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 opacity-60"
                              : "items-center rounded-xl border border-red-200 bg-red-50 px-5 py-3"
                          }
                        >
                          <Text className="font-bold text-red-600">
                            {removing
                              ? "Removing..."
                              : "Remove Favorite"}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              }
            )}
          </View>
        ) : (
          /* EMPTY STATE */
          <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-16">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-red-50">
              <Text className="text-5xl">
                ❤️
              </Text>
            </View>

            <Text className="mt-6 text-center text-2xl font-bold text-slate-900">
              {favorites.length ===
                0
                ? "No favorite providers yet"
                : "No matching favorites"}
            </Text>

            <Text className="mt-2 max-w-lg text-center leading-6 text-slate-500">
              {favorites.length ===
                0
                ? "Save professionals you trust so you can quickly find and book them again."
                : "Try changing your search or filters to find your saved provider."}
            </Text>

            {favorites.length ===
              0 ? (
              <Pressable
                onPress={() =>
                  router.push(
                    "/providers"
                  )
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  Find Providers
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={
                  clearFilters
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  Clear Filters
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* CTA */}
        {favorites.length >
          0 && (
            <View className="mt-7 rounded-3xl bg-slate-900 p-7">
              <View className="flex-row flex-wrap items-center justify-between gap-5">
                <View
                  style={{
                    minWidth: 220,
                    flexBasis: 540,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-2xl font-bold text-white">
                    Looking for another
                    expert?
                  </Text>

                  <Text className="mt-2 max-w-2xl leading-6 text-slate-300">
                    Explore more verified
                    ServiGo professionals
                    and save your favorite
                    providers for future
                    bookings.
                  </Text>
                </View>

                <Pressable
                  onPress={() =>
                    router.push(
                      "/providers"
                    )
                  }
                  className="rounded-xl bg-white px-6 py-4"
                >
                  <Text className="font-bold text-slate-900">
                    Browse Providers
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
      </View>
    </ScrollView>
  );
}