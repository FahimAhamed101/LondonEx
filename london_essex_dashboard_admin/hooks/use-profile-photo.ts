"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_PROFILE_PHOTO = "/bert-b-rhNff6hB41s-unsplash 1.png";
const PROFILE_PHOTO_STORAGE_KEY = "dashboard-profile-photo";
const PROFILE_PHOTO_EVENT = "dashboard-profile-photo-updated";

function readStoredPhoto() {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE_PHOTO;
  }

  return (
    window.localStorage.getItem(PROFILE_PHOTO_STORAGE_KEY) ??
    DEFAULT_PROFILE_PHOTO
  );
}

export function useProfilePhoto() {
  const [photoSrc, setPhotoSrc] = useState(DEFAULT_PROFILE_PHOTO);

  useEffect(() => {
    const syncPhoto = () => {
      setPhotoSrc(readStoredPhoto());
    };

    syncPhoto();
    window.addEventListener("storage", syncPhoto);
    window.addEventListener(PROFILE_PHOTO_EVENT, syncPhoto);

    return () => {
      window.removeEventListener("storage", syncPhoto);
      window.removeEventListener(PROFILE_PHOTO_EVENT, syncPhoto);
    };
  }, []);

  const setProfilePhoto = useCallback((nextPhotoSrc: string) => {
    setPhotoSrc(nextPhotoSrc);
    window.localStorage.setItem(PROFILE_PHOTO_STORAGE_KEY, nextPhotoSrc);
    window.dispatchEvent(new Event(PROFILE_PHOTO_EVENT));
  }, []);

  const clearProfilePhoto = useCallback(() => {
    setPhotoSrc(DEFAULT_PROFILE_PHOTO);
    window.localStorage.removeItem(PROFILE_PHOTO_STORAGE_KEY);
    window.dispatchEvent(new Event(PROFILE_PHOTO_EVENT));
  }, []);

  return {
    photoSrc,
    hasCustomPhoto: photoSrc !== DEFAULT_PROFILE_PHOTO,
    setProfilePhoto,
    clearProfilePhoto,
    defaultPhotoSrc: DEFAULT_PROFILE_PHOTO,
  };
}
