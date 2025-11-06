"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfileData, updateProfileData } from "../services/profileService";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await getProfileData();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    setIsUpdating(true);
    try {
      const res = await updateProfileData(formData);
      setProfile((prev) => ({ ...prev, ...formData }));
      toast.success("🎉 Cập nhật hồ sơ thành công!");
      return { success: true };
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      toast.error("Cập nhật thất bại, vui lòng thử lại!");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, isLoading, isUpdating, error, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
