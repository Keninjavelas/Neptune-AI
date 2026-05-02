"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GeolocationPermissionState = "granted" | "prompt" | "denied" | "unsupported";

interface BrowserNodeLocation {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;
  permissionState: GeolocationPermissionState;
  retry: () => void;
}

const LOCATION_CACHE_KEY = "aquaflow:node-location";
const POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 60000,
};

export function useBrowserNodeLocation(): BrowserNodeLocation {
  const [state, setState] = useState<BrowserNodeLocation>({
    latitude: null,
    longitude: null,
    accuracy: null,
    heading: null,
    lastUpdated: null,
    loading: true,
    error: null,
    permissionState: "prompt",
    retry: () => {},
  });
  const watchIdRef = useRef<number | null>(null);

  const applyPosition = useCallback((position: GeolocationPosition) => {
    const nextState = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      lastUpdated: position.timestamp,
    };

    try {
      window.localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(nextState));
    } catch {}

    setState((prev) => ({
      ...prev,
      ...nextState,
      loading: false,
      error: null,
      permissionState: "granted",
    }));
  }, []);

  const applyError = useCallback((errorMessage: string, permissionState?: GeolocationPermissionState) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
      permissionState: permissionState ?? prev.permissionState,
    }));
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.isSecureContext) {
      applyError(
        "Location access requires a secure origin. Open the dashboard from localhost or HTTPS.",
        "denied"
      );
      return;
    }

    if (!("geolocation" in navigator)) {
      applyError("Geolocation is not supported in this browser.", "unsupported");
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location access was blocked. Allow browser location permission and retry."
            : error.code === error.TIMEOUT
              ? "Location request timed out. Retry while keeping the browser focused."
              : error.message || "Unable to retrieve live browser geolocation.";

        applyError(
          message,
          error.code === error.PERMISSION_DENIED ? "denied" : "prompt"
        );
      },
      POSITION_OPTIONS
    );
  }, [applyError, applyPosition]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const cachedLocation = window.localStorage.getItem(LOCATION_CACHE_KEY);
      if (cachedLocation) {
        const parsed = JSON.parse(cachedLocation) as {
          latitude: number;
          longitude: number;
          accuracy: number | null;
          heading: number | null;
          lastUpdated: number | null;
        };

        setState((prev) => ({
          ...prev,
          ...parsed,
          loading: false,
          error: null,
        }));
      }
    } catch {}

    if (!("geolocation" in navigator)) {
      applyError("Geolocation is not supported in this browser.", "unsupported");
      return;
    }

    requestLocation();

    watchIdRef.current = navigator.geolocation.watchPosition(
      applyPosition,
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location access was blocked. Allow browser location permission and retry."
            : error.code === error.TIMEOUT
              ? "Live tracking timed out. Retrying usually restores the node map."
              : error.message || "Unable to retrieve live browser geolocation.";

        applyError(
          message,
          error.code === error.PERMISSION_DENIED ? "denied" : undefined
        );
      },
      POSITION_OPTIONS
    );

    let permissionStatus: PermissionStatus | null = null;
    if ("permissions" in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          permissionStatus = status;
          setState((prev) => ({
            ...prev,
            permissionState: status.state as GeolocationPermissionState,
          }));

          status.onchange = () => {
            const nextPermission = status.state as GeolocationPermissionState;
            setState((prev) => ({
              ...prev,
              permissionState: nextPermission,
            }));

            if (nextPermission === "granted") {
              requestLocation();
            }
          };
        })
        .catch(() => {
          setState((prev) => ({
            ...prev,
            permissionState: "unsupported",
          }));
        });
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, [applyError, applyPosition, requestLocation]);

  return {
    ...state,
    retry: requestLocation,
  };
}
