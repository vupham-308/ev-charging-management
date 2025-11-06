import { useEffect, useState } from "react";
import { getProfileData, updateProfileData } from "../services/profileService";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await getProfileData();
      setProfile(data);
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
      const cleanData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || "",
      };

      const res = await updateProfileData(cleanData);

      await fetchProfile();
      return { success: true, data: res };
    } catch (err) {
      console.error("❌ Error updating profile:", err.response?.data || err);
      return { success: false, error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
