import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type DayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type AvailabilityDay = {
  day: DayName;
  enabled: boolean;
  startTime: string;
  endTime: string;
};

const initialAvailability: AvailabilityDay[] = [
  {
    day: "Monday",
    enabled: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "Tuesday",
    enabled: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "Wednesday",
    enabled: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "Thursday",
    enabled: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "Friday",
    enabled: true,
    startTime: "09:00",
    endTime: "18:00",
  },
  {
    day: "Saturday",
    enabled: true,
    startTime: "10:00",
    endTime: "17:00",
  },
  {
    day: "Sunday",
    enabled: false,
    startTime: "10:00",
    endTime: "16:00",
  },
];

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

export default function ProviderAvailabilityScreen() {
  const { width } = useWindowDimensions();

  const isDesktop =
    width >= 1000;

  const [
    availability,
    setAvailability,
  ] = useState<AvailabilityDay[]>(
    initialAvailability
  );

  const [
    acceptingBookings,
    setAcceptingBookings,
  ] = useState(true);

  const [saved, setSaved] =
    useState(false);

  const updateDay = (
    day: DayName,
    changes: Partial<AvailabilityDay>
  ) => {
    setSaved(false);

    setAvailability(
      (current) =>
        current.map((item) =>
          item.day === day
            ? {
              ...item,
              ...changes,
            }
            : item
        )
    );
  };

  const enableAllDays = () => {
    setSaved(false);

    setAvailability(
      (current) =>
        current.map((item) => ({
          ...item,
          enabled: true,
        }))
    );
  };

  const disableAllDays = () => {
    setSaved(false);

    setAvailability(
      (current) =>
        current.map((item) => ({
          ...item,
          enabled: false,
        }))
    );
  };

  const handleSave = () => {
    setSaved(true);
  };

  const activeDays =
    availability.filter(
      (item) => item.enabled
    ).length;

  return (
    <View className="flex-1 bg-slate-50">
      <View
        className={
          isDesktop
            ? "flex-1 flex-row"
            : "flex-1"
        }
      >
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
                    "/provider/availability";

                  return (
                    <Pressable
                      key={item.label}
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
                          {item.icon}
                        </Text>
                      </View>

                      <Text
                        className={
                          active
                            ? "ml-3 font-bold text-blue-700"
                            : "ml-3 font-semibold text-slate-600"
                        }
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>
        )}

        <View className="flex-1">
          <View className="border-b border-slate-200 bg-white px-5 py-4">
            <View className="flex-row items-center justify-between">
              {!isDesktop && (
                <Text className="text-xl font-black text-blue-600">
                  ServiGo
                </Text>
              )}

              {isDesktop && (
                <View>
                  <Text className="text-lg font-bold text-slate-900">
                    Availability
                  </Text>

                  <Text className="text-xs text-slate-400">
                    Manage your working hours
                  </Text>
                </View>
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
                        "/provider/availability";

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
              <View className="mb-6 flex-row flex-wrap items-end justify-between gap-4">
                <View>
                  <Text className="text-3xl font-black text-slate-900">
                    Availability
                  </Text>

                  <Text className="mt-2 text-slate-500">
                    Set the days and time
                    when customers can
                    book your services.
                  </Text>
                </View>

                <Pressable
                  onPress={
                    handleSave
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3.5"
                >
                  <Text className="font-bold text-white">
                    Save Changes
                  </Text>
                </Pressable>
              </View>

              {saved && (
                <View className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                  <Text className="font-semibold text-green-700">
                    ✓ Availability saved
                    successfully.
                  </Text>
                </View>
              )}

              <View className="mb-5 flex-row flex-wrap gap-4">
                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 180,
                    flexBasis: 240,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Working Days
                  </Text>

                  <Text className="mt-2 text-3xl font-black text-slate-900">
                    {activeDays}
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    days per week
                  </Text>
                </View>

                <View
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                  style={{
                    minWidth: 180,
                    flexBasis: 240,
                    flexGrow: 1,
                  }}
                >
                  <Text className="text-sm text-slate-500">
                    Booking Status
                  </Text>

                  <Text
                    className={
                      acceptingBookings
                        ? "mt-2 text-xl font-black text-green-600"
                        : "mt-2 text-xl font-black text-red-500"
                    }
                  >
                    {acceptingBookings
                      ? "Available"
                      : "Unavailable"}
                  </Text>

                  <Text className="mt-1 text-xs text-slate-400">
                    for new bookings
                  </Text>
                </View>
              </View>

              <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
                <View className="flex-row flex-wrap items-center justify-between gap-4">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Accept New Bookings
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Turn this off when
                      you do not want new
                      service requests.
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => {
                      setSaved(false);

                      setAcceptingBookings(
                        (current) =>
                          !current
                      );
                    }}
                    className={
                      acceptingBookings
                        ? "h-8 w-14 justify-center rounded-full bg-green-500 px-1"
                        : "h-8 w-14 justify-center rounded-full bg-slate-300 px-1"
                    }
                  >
                    <View
                      className="h-6 w-6 rounded-full bg-white"
                      style={{
                        alignSelf:
                          acceptingBookings
                            ? "flex-end"
                            : "flex-start",
                      }}
                    />
                  </Pressable>
                </View>
              </View>

              <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <View className="flex-row flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
                  <View>
                    <Text className="text-lg font-bold text-slate-900">
                      Weekly Schedule
                    </Text>

                    <Text className="mt-1 text-sm text-slate-500">
                      Choose your working
                      hours for each day.
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={
                        enableAllDays
                      }
                      className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5"
                    >
                      <Text className="text-sm font-semibold text-blue-700">
                        Enable All
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={
                        disableAllDays
                      }
                      className="rounded-lg border border-slate-200 px-4 py-2.5"
                    >
                      <Text className="text-sm font-semibold text-slate-600">
                        Disable All
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {availability.map(
                  (item, index) => (
                    <View
                      key={item.day}
                      className={
                        index !==
                          availability.length -
                          1
                          ? "border-b border-slate-100 px-5 py-5"
                          : "px-5 py-5"
                      }
                    >
                      <View className="flex-row flex-wrap items-center gap-4">
                        <View
                          style={{
                            minWidth: 130,
                            flexBasis: 160,
                          }}
                        >
                          <Text className="font-bold text-slate-900">
                            {item.day}
                          </Text>

                          <Text
                            className={
                              item.enabled
                                ? "mt-1 text-xs font-semibold text-green-600"
                                : "mt-1 text-xs font-semibold text-slate-400"
                            }
                          >
                            {item.enabled
                              ? "Available"
                              : "Unavailable"}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() =>
                            updateDay(
                              item.day,
                              {
                                enabled:
                                  !item.enabled,
                              }
                            )
                          }
                          className={
                            item.enabled
                              ? "h-8 w-14 justify-center rounded-full bg-blue-600 px-1"
                              : "h-8 w-14 justify-center rounded-full bg-slate-300 px-1"
                          }
                        >
                          <View
                            className="h-6 w-6 rounded-full bg-white"
                            style={{
                              alignSelf:
                                item.enabled
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          />
                        </Pressable>

                        <View
                          className="flex-row flex-wrap items-center gap-3"
                          style={{
                            flexGrow: 1,
                            flexBasis: 350,
                          }}
                        >
                          <View
                            className={
                              item.enabled
                                ? "rounded-xl border border-slate-200 bg-white px-4"
                                : "rounded-xl border border-slate-100 bg-slate-100 px-4"
                            }
                            style={{
                              minWidth: 130,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="pt-2 text-[10px] font-semibold uppercase text-slate-400">
                              Start
                            </Text>

                            <TextInput
                              value={
                                item.startTime
                              }
                              editable={
                                item.enabled
                              }
                              onChangeText={(
                                value
                              ) =>
                                updateDay(
                                  item.day,
                                  {
                                    startTime:
                                      value,
                                  }
                                )
                              }
                              placeholder="09:00"
                              placeholderTextColor="#94a3b8"
                              className={
                                item.enabled
                                  ? "pb-3 pt-1 font-semibold text-slate-900 outline-none"
                                  : "pb-3 pt-1 font-semibold text-slate-400 outline-none"
                              }
                            />
                          </View>

                          <Text className="text-slate-400">
                            to
                          </Text>

                          <View
                            className={
                              item.enabled
                                ? "rounded-xl border border-slate-200 bg-white px-4"
                                : "rounded-xl border border-slate-100 bg-slate-100 px-4"
                            }
                            style={{
                              minWidth: 130,
                              flexGrow: 1,
                            }}
                          >
                            <Text className="pt-2 text-[10px] font-semibold uppercase text-slate-400">
                              End
                            </Text>

                            <TextInput
                              value={
                                item.endTime
                              }
                              editable={
                                item.enabled
                              }
                              onChangeText={(
                                value
                              ) =>
                                updateDay(
                                  item.day,
                                  {
                                    endTime:
                                      value,
                                  }
                                )
                              }
                              placeholder="18:00"
                              placeholderTextColor="#94a3b8"
                              className={
                                item.enabled
                                  ? "pb-3 pt-1 font-semibold text-slate-900 outline-none"
                                  : "pb-3 pt-1 font-semibold text-slate-400 outline-none"
                              }
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                )}
              </View>

              <View className="mt-5 flex-row flex-wrap justify-end gap-3">
                <Pressable
                  onPress={() => {
                    setAvailability(
                      initialAvailability
                    );

                    setAcceptingBookings(
                      true
                    );

                    setSaved(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5"
                >
                  <Text className="font-bold text-slate-600">
                    Reset
                  </Text>
                </Pressable>

                <Pressable
                  onPress={
                    handleSave
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3.5"
                >
                  <Text className="font-bold text-white">
                    Save Availability
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}