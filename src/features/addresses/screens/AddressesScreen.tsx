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

type AddressLabel =
  | "Home"
  | "Office"
  | "Other";

type Address = {
  id: number;

  label: AddressLabel;

  fullName: string;
  phone: string;

  houseNumber: string;
  street: string;
  landmark?: string;

  city: string;
  state: string;
  pincode: string;

  instructions?: string;

  isDefault: boolean;

  createdAt: string;
};

type FilterType =
  | "all"
  | "home"
  | "office"
  | "other";

const initialAddresses: Address[] = [
  {
    id: 1,

    label: "Home",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber: "A-204",
    street: "Vaishali Nagar",

    landmark: "Near Main Market",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302021",

    instructions:
      "Call when you reach the main gate.",

    isDefault: true,

    createdAt: "18 Sep 2026",
  },

  {
    id: 2,

    label: "Office",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber: "Office 305",
    street: "C Scheme",

    landmark: "Near Central Park",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",

    instructions:
      "Ask reception for third floor.",

    isDefault: false,

    createdAt: "17 Sep 2026",
  },

  {
    id: 3,

    label: "Other",

    fullName: "Aditya",
    phone: "9876543210",

    houseNumber: "B-112",
    street: "Mansarovar",

    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302020",

    isDefault: false,

    createdAt: "15 Sep 2026",
  },
];

const filters: {
  label: string;
  value: FilterType;
}[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Home",
      value: "home",
    },
    {
      label: "Office",
      value: "office",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

function getAddressIcon(
  label: AddressLabel
) {
  switch (label) {
    case "Home":
      return "🏠";

    case "Office":
      return "🏢";

    case "Other":
      return "📍";
  }
}

function getFullAddress(
  address: Address
) {
  return [
    address.houseNumber,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function AddressesScreen() {
  const [addresses, setAddresses] =
    useState<Address[]>(
      initialAddresses
    );

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<FilterType>(
      "all"
    );

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<number | null>(
      null
    );

  const [
    updatingDefaultId,
    setUpdatingDefaultId,
  ] =
    useState<number | null>(
      null
    );

  const filteredAddresses =
    useMemo(() => {
      let result = [
        ...addresses,
      ];

      if (
        activeFilter !== "all"
      ) {
        result =
          result.filter(
            (address) =>
              address.label.toLowerCase() ===
              activeFilter
          );
      }

      const query =
        search
          .trim()
          .toLowerCase();

      if (query) {
        result =
          result.filter(
            (address) => {
              const searchable =
                [
                  address.label,
                  address.fullName,
                  address.phone,
                  address.houseNumber,
                  address.street,
                  address.landmark,
                  address.city,
                  address.state,
                  address.pincode,
                ]
                  .filter(Boolean)
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
          Number(
            b.isDefault
          ) -
          Number(
            a.isDefault
          )
      );
    }, [
      addresses,
      activeFilter,
      search,
    ]);

  const defaultAddress =
    addresses.find(
      (address) =>
        address.isDefault
    );

  const openAddAddress =
    () => {
      router.push(
        "/addresses/new"
      );
    };

  const openEditAddress = (
    addressId: number
  ) => {
    router.push({
      pathname:
        "/addresses/[addressId]",
      params: {
        addressId:
          String(addressId),
      },
    });
  };

  const handleSetDefault =
    async (
      addressId: number
    ) => {
      const target =
        addresses.find(
          (address) =>
            address.id ===
            addressId
        );

      if (!target) {
        return;
      }

      if (
        target.isDefault
      ) {
        return;
      }

      setUpdatingDefaultId(
        addressId
      );

      try {
        /*
          =================================
          BACKEND INTEGRATION LATER
          =================================

          await addressesApi.setDefaultAddress(
            addressId
          );

          Example:
          PATCH /addresses/:id/default

          UI ko replace nahi karna.
        */

        setAddresses(
          (current) =>
            current.map(
              (address) => ({
                ...address,

                isDefault:
                  address.id ===
                  addressId,
              })
            )
        );
      } catch (error) {
        console.error(
          "Set default error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to update default address."
          );
        } else {
          Alert.alert(
            "Unable to Update",
            "Could not set this address as default."
          );
        }
      } finally {
        setUpdatingDefaultId(
          null
        );
      }
    };

  const performDelete =
    async (
      addressId: number
    ) => {
      setDeletingId(
        addressId
      );

      try {
        /*
          =================================
          BACKEND INTEGRATION LATER
          =================================

          await addressesApi.deleteAddress(
            addressId
          );

          Example:
          DELETE /addresses/:id

          UI same rahegi.
        */

        setAddresses(
          (current) => {
            const target =
              current.find(
                (address) =>
                  address.id ===
                  addressId
              );

            const remaining =
              current.filter(
                (address) =>
                  address.id !==
                  addressId
              );

            /*
              Agar deleted address
              default tha aur koi aur
              address available hai,
              temporary frontend mode me
              first remaining address
              default bana denge.

              Backend baad me final rule
              handle karega.
            */
            if (
              target?.isDefault &&
              remaining.length >
              0
            ) {
              return remaining.map(
                (
                  address,
                  index
                ) => ({
                  ...address,

                  isDefault:
                    index ===
                    0,
                })
              );
            }

            return remaining;
          }
        );
      } catch (error) {
        console.error(
          "Delete address error:",
          error
        );

        if (
          Platform.OS === "web"
        ) {
          window.alert(
            "Unable to delete address."
          );
        } else {
          Alert.alert(
            "Unable to Delete",
            "Could not delete this address."
          );
        }
      } finally {
        setDeletingId(
          null
        );
      }
    };

  const handleDelete = (
    address: Address
  ) => {
    if (
      Platform.OS === "web"
    ) {
      const confirmed =
        window.confirm(
          `Delete your ${address.label} address?`
        );

      if (confirmed) {
        performDelete(
          address.id
        );
      }

      return;
    }

    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete your ${address.label} address?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style:
            "destructive",
          onPress: () =>
            performDelete(
              address.id
            ),
        },
      ]
    );
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
      {/* Header */}
      <View className="border-b border-slate-200 bg-white px-5 py-4">
        <View
          className="mx-auto w-full flex-row flex-wrap items-center justify-between gap-3"
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
        {/* Page heading */}
        <View className="mb-7 flex-row flex-wrap items-end justify-between gap-5">
          <View
            style={{
              minWidth: 240,
              flexBasis: 600,
              flexGrow: 1,
            }}
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Customer Addresses
            </Text>

            <Text className="mt-2 text-3xl font-bold text-slate-900">
              My Addresses
            </Text>

            <Text className="mt-2 max-w-2xl text-base leading-6 text-slate-500">
              Manage the addresses
              ServiGo professionals can
              visit for your booked
              services.
            </Text>
          </View>

          <Pressable
            onPress={
              openAddAddress
            }
            className="rounded-xl bg-blue-600 px-6 py-4"
          >
            <Text className="font-bold text-white">
              + Add New Address
            </Text>
          </Pressable>
        </View>

        {/* Default Address Summary */}
        {defaultAddress && (
          <View className="mb-6 rounded-3xl bg-blue-600 p-6 md:p-7">
            <View className="flex-row flex-wrap items-center gap-5">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
                <Text className="text-3xl">
                  {getAddressIcon(
                    defaultAddress.label
                  )}
                </Text>
              </View>

              <View
                style={{
                  minWidth: 220,
                  flexBasis: 600,
                  flexGrow: 1,
                }}
              >
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                    Default Address
                  </Text>

                  <View className="rounded-full bg-white px-3 py-1">
                    <Text className="text-xs font-bold text-blue-700">
                      {
                        defaultAddress.label
                      }
                    </Text>
                  </View>
                </View>

                <Text className="mt-2 text-xl font-bold text-white">
                  {
                    defaultAddress.fullName
                  }
                </Text>

                <Text className="mt-2 max-w-3xl leading-6 text-blue-50">
                  {getFullAddress(
                    defaultAddress
                  )}
                </Text>

                <Text className="mt-2 text-sm text-blue-100">
                  +91{" "}
                  {
                    defaultAddress.phone
                  }
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  openEditAddress(
                    defaultAddress.id
                  )
                }
                className="rounded-xl bg-white px-5 py-3"
              >
                <Text className="font-bold text-blue-700">
                  Edit
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Stats */}
        <View className="mb-6 flex-row flex-wrap gap-4">
          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-slate-900">
              {
                addresses.length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Saved Addresses
            </Text>
          </View>

          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-slate-900">
              {
                addresses.filter(
                  (address) =>
                    address.label ===
                    "Home"
                ).length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Home Addresses
            </Text>
          </View>

          <View
            className="rounded-2xl border border-slate-200 bg-white p-5"
            style={{
              minWidth: 150,
              flexBasis: 220,
              flexGrow: 1,
            }}
          >
            <Text className="text-2xl font-bold text-slate-900">
              {
                addresses.filter(
                  (address) =>
                    address.label ===
                    "Office"
                ).length
              }
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              Office Addresses
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className="mb-5 rounded-2xl border border-slate-200 bg-white px-4">
          <TextInput
            value={search}
            onChangeText={
              setSearch
            }
            placeholder="Search address, city, locality or pincode..."
            placeholderTextColor="#94a3b8"
            className="py-4 text-base text-slate-900 outline-none"
          />
        </View>

        {/* Filters */}
        <View className="mb-7 flex-row flex-wrap gap-2">
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
                    {
                      filter.label
                    }
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* Result count */}
        <View className="mb-5 flex-row flex-wrap items-end justify-between gap-3">
          <View>
            <Text className="text-xl font-bold text-slate-900">
              Saved Addresses
            </Text>

            <Text className="mt-1 text-sm text-slate-500">
              {
                filteredAddresses.length
              }{" "}
              {filteredAddresses.length ===
                1
                ? "address"
                : "addresses"}{" "}
              found
            </Text>
          </View>

          {(search ||
            activeFilter !==
            "all") && (
              <Pressable
                onPress={() => {
                  setSearch("");
                  setActiveFilter(
                    "all"
                  );
                }}
              >
                <Text className="font-semibold text-blue-600">
                  Clear Filters
                </Text>
              </Pressable>
            )}
        </View>

        {/* Address List */}
        {filteredAddresses.length >
          0 ? (
          <View className="gap-4">
            {filteredAddresses.map(
              (address) => {
                const fullAddress =
                  getFullAddress(
                    address
                  );

                const isDeleting =
                  deletingId ===
                  address.id;

                const updatingDefault =
                  updatingDefaultId ===
                  address.id;

                return (
                  <View
                    key={
                      address.id
                    }
                    className={
                      address.isDefault
                        ? "rounded-3xl border-2 border-blue-600 bg-white p-6"
                        : "rounded-3xl border border-slate-200 bg-white p-6"
                    }
                  >
                    <View className="flex-row flex-wrap items-start gap-5">
                      {/* Icon */}
                      <View
                        className={
                          address.isDefault
                            ? "h-16 w-16 items-center justify-center rounded-2xl bg-blue-100"
                            : "h-16 w-16 items-center justify-center rounded-2xl bg-slate-100"
                        }
                      >
                        <Text className="text-3xl">
                          {getAddressIcon(
                            address.label
                          )}
                        </Text>
                      </View>

                      {/* Address Info */}
                      <View
                        style={{
                          minWidth: 220,
                          flexBasis: 520,
                          flexGrow: 1,
                        }}
                      >
                        <View className="flex-row flex-wrap items-center gap-2">
                          <Text className="text-xl font-bold text-slate-900">
                            {
                              address.label
                            }
                          </Text>

                          {address.isDefault && (
                            <View className="rounded-full bg-blue-50 px-3 py-1">
                              <Text className="text-xs font-bold text-blue-700">
                                ✓ Default
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text className="mt-2 font-semibold text-slate-700">
                          {
                            address.fullName
                          }
                        </Text>

                        <Text className="mt-2 max-w-3xl leading-7 text-slate-600">
                          📍{" "}
                          {
                            fullAddress
                          }
                        </Text>

                        <Text className="mt-2 text-sm text-slate-500">
                          📞 +91{" "}
                          {
                            address.phone
                          }
                        </Text>

                        {!!address.instructions && (
                          <View className="mt-4 rounded-xl bg-amber-50 p-3">
                            <Text className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                              Instructions
                            </Text>

                            <Text className="mt-1 text-sm leading-5 text-amber-900">
                              {
                                address.instructions
                              }
                            </Text>
                          </View>
                        )}

                        <Text className="mt-4 text-xs text-slate-400">
                          Added{" "}
                          {
                            address.createdAt
                          }
                        </Text>
                      </View>

                      {/* Actions */}
                      <View
                        className="gap-2"
                        style={{
                          minWidth: 150,
                        }}
                      >
                        <Pressable
                          onPress={() =>
                            openEditAddress(
                              address.id
                            )
                          }
                          className="items-center rounded-xl bg-blue-600 px-5 py-3"
                        >
                          <Text className="font-bold text-white">
                            Edit Address
                          </Text>
                        </Pressable>

                        {!address.isDefault && (
                          <Pressable
                            disabled={
                              updatingDefault
                            }
                            onPress={() =>
                              handleSetDefault(
                                address.id
                              )
                            }
                            className={
                              updatingDefault
                                ? "items-center rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 opacity-60"
                                : "items-center rounded-xl border border-blue-200 bg-blue-50 px-5 py-3"
                            }
                          >
                            <Text className="font-bold text-blue-700">
                              {updatingDefault
                                ? "Updating..."
                                : "Set Default"}
                            </Text>
                          </Pressable>
                        )}

                        <Pressable
                          disabled={
                            isDeleting
                          }
                          onPress={() =>
                            handleDelete(
                              address
                            )
                          }
                          className={
                            isDeleting
                              ? "items-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 opacity-60"
                              : "items-center rounded-xl border border-red-200 bg-red-50 px-5 py-3"
                          }
                        >
                          <Text className="font-bold text-red-600">
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
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
          /* Empty State */
          <View className="items-center rounded-3xl border border-slate-200 bg-white px-6 py-16">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Text className="text-4xl">
                📍
              </Text>
            </View>

            <Text className="mt-5 text-center text-2xl font-bold text-slate-900">
              {addresses.length ===
                0
                ? "No addresses saved"
                : "No addresses found"}
            </Text>

            <Text className="mt-2 max-w-lg text-center leading-6 text-slate-500">
              {addresses.length ===
                0
                ? "Add your first service address to make future bookings faster."
                : "Try changing your search or address filter."}
            </Text>

            {addresses.length ===
              0 ? (
              <Pressable
                onPress={
                  openAddAddress
                }
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  + Add Address
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setSearch("");
                  setActiveFilter(
                    "all"
                  );
                }}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-4"
              >
                <Text className="font-bold text-white">
                  Clear Filters
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Add another address CTA */}
        {addresses.length > 0 && (
          <View className="mt-6 rounded-3xl bg-slate-900 p-7 md:p-8">
            <View className="flex-row flex-wrap items-center justify-between gap-5">
              <View
                style={{
                  minWidth: 240,
                  flexBasis: 520,
                  flexGrow: 1,
                }}
              >
                <Text className="text-2xl font-bold text-white">
                  Need another service location?
                </Text>

                <Text className="mt-2 leading-6 text-slate-300">
                  Save your home,
                  office or any other
                  frequently used address
                  for faster bookings.
                </Text>
              </View>

              <Pressable
                onPress={
                  openAddAddress
                }
                className="rounded-xl bg-white px-6 py-4"
              >
                <Text className="font-bold text-slate-900">
                  + Add Address
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Help note */}
        <View className="mt-6 items-center">
          <Text className="text-center text-sm text-slate-500">
            Having trouble with an
            address?
          </Text>

          <Pressable
            onPress={() =>
              router.push(
                "/support"
              )
            }
            className="mt-2 px-4 py-2"
          >
            <Text className="font-semibold text-blue-600">
              Contact ServiGo Support
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}