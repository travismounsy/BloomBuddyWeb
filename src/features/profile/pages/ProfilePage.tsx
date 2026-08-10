import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import {
  getCurrentProfile,
  updateDisplayName,
  updateGardenVisibility,
} from "../services/profileService";
import type { Profile } from "../services/profileService";

import {
  getAvatarUrl,
  removeAvatar,
  uploadAvatar,
} from "../services/avatarService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);

  const [gardenVisibility, setGardenVisibility] =
    useState<"private" | "connections">("private");

  useEffect(() => {
    async function loadProfile() {
      try {
        setErrorMessage("");

        const profileData = await getCurrentProfile();

        setProfile(profileData);
        setDisplayName(profileData.display_name);
        setGardenVisibility(profileData.garden_visibility);
        setAvatarUrl(getAvatarUrl(profileData.avatar_path));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const nameUpdatedProfile =
        await updateDisplayName(displayName);

      const visibilityUpdatedProfile =
        await updateGardenVisibility(gardenVisibility);

      const finalProfile: Profile = {
        ...nameUpdatedProfile,
        garden_visibility:
          visibilityUpdatedProfile.garden_visibility,
        updated_at: visibilityUpdatedProfile.updated_at,
      };

      setProfile(finalProfile);
      setDisplayName(finalProfile.display_name);
      setGardenVisibility(finalProfile.garden_visibility);

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!profile?.avatar_path) {
      return;
    }

    setRemovingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await removeAvatar(profile.avatar_path);

      setAvatarUrl(null);

      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              avatar_path: null,
            }
          : currentProfile
      );

      setSuccessMessage("Avatar removed successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove your avatar."
      );
    } finally {
      setRemovingAvatar(false);
    }
  }

  async function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const avatarPath = await uploadAvatar(file);

      const newAvatarUrl = getAvatarUrl(avatarPath);

      setAvatarUrl(
        newAvatarUrl
          ? `${newAvatarUrl}?t=${Date.now()}`
          : null
      );

      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              avatar_path: avatarPath,
            }
          : currentProfile
      );

      setSuccessMessage("Avatar updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload your avatar."
      );
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  if (loading) {
    return (
      <section>
        <p className="text-slate-600">
          Loading profile...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Your Profile
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your Bloom Buddy profile and garden identity.
        </p>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      {profile && (
        <div className="mt-8 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          {/* Avatar */}
          <div className="mb-8">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${profile.display_name}'s avatar`}
                className="size-24 rounded-full object-cover"
              />
            ) : (
              <div className="grid size-24 place-items-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
                {profile.display_name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label
                htmlFor="avatar"
                className="inline-block cursor-pointer rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700 transition hover:bg-green-50"
              >
                {uploadingAvatar
                  ? "Uploading..."
                  : avatarUrl
                    ? "Change Avatar"
                    : "Choose Avatar"}
              </label>

              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploadingAvatar || removingAvatar}
                onChange={handleAvatarChange}
                className="sr-only"
              />

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={removingAvatar || uploadingAvatar}
                  className="rounded-lg border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {removingAvatar
                    ? "Removing..."
                    : "Remove Avatar"}
                </button>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              JPEG, PNG, or WebP. Maximum size 2 MB.
            </p>
          </div>

          {/* Display name */}
          <div>
            <label
              htmlFor="displayName"
              className="block font-medium text-slate-900"
            >
              Display name
            </label>

            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            />
          </div>

          {/* Garden visibility */}
          <div className="mt-6">
            <label
              htmlFor="gardenVisibility"
              className="block font-medium text-slate-900"
            >
              Garden visibility
            </label>

            <select
              id="gardenVisibility"
              value={gardenVisibility}
              onChange={(event) =>
                setGardenVisibility(
                  event.target.value as
                    | "private"
                    | "connections"
                )
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="private">
                Private
              </option>

              <option value="connections">
                Connections only
              </option>
            </select>

            <p className="mt-2 text-sm text-slate-500">
              Private gardens are visible only to you.
              Connections-only gardens will be visible to approved
              connections when Social Gardens is added.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-8 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </section>
  );
}