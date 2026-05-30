import { type FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/layout/Header/Header";
import * as authService from "../../services/authService";
import styles from "./ProfilePage.module.css";

type ProfileForm = {
  name: string;
  phone: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ProfilePage() {
  const [profile, setProfile] =
    useState<authService.UserProfile | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] =
    useState<string | null>(null);

  const [passwordMessage, setPasswordMessage] =
    useState<string | null>(null);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileError, setProfileError] =
    useState<string | null>(null);

  const [passwordError, setPasswordError] =
    useState<string | null>(null);

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string>("");

  const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

  const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

  const resolveAvatarUrl = (avatarPath?: string | null) => {
    if (!avatarPath) return "";

    if (avatarPath.startsWith("http")) {
      return avatarPath;
    }

    return `${API_ORIGIN}${avatarPath.startsWith("/") ? "" : "/"}${avatarPath}`;
  };

  useEffect(() => {
    let mounted = true;

    authService
      .fetchProfile()
      .then((user) => {
        if (!mounted) return;
        setProfile(user);
        setProfileForm({
          name:
            `${user.firstName} ${user.lastName}`.trim(),
          phone: user.phone ?? "",
        });
        setAvatarPreview(resolveAvatarUrl(user.avatarPath));
      })
      .catch(() => {
        if (!mounted) return;
        setProfileError(
          "Não foi possível carregar seu perfil."
        );
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const updateProfileField = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));

    setProfileMessage(null);
    setProfileError(null);
  };

  const updatePasswordField = (
    field: keyof PasswordForm,
    value: string
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordMessage(null);
    setPasswordError(null);
  };

  const handleProfileSave = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSavingProfile(true);
    setProfileError(null);
    setProfileMessage(null);

    try {
      const [firstName, ...rest] =
        profileForm.name.trim().split(" ");
      const lastName = rest.join(" ");

      // 1. atualiza dados básicos
      const updatedProfile =
        await authService.updateProfile({
          firstName: firstName || "",
          lastName,
          phone:
            profileForm.phone.replace(/\D/g, "") ||
            undefined,
        });

      // 2. upload de avatar (se existir)
      let finalProfile = updatedProfile;

      if (avatarFile) {
        finalProfile =
          await authService.uploadAvatar(avatarFile);
      }

      setProfile(finalProfile);
      setProfileMessage("Perfil atualizado com sucesso.");
    } catch {
      setProfileError(
        "Ocorreu um erro ao salvar seu perfil."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsChangingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword
    ) {
      setPasswordError("Preencha todos os campos.");
      setIsChangingPassword(false);
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError("As senhas não coincidem.");
      setIsChangingPassword(false);
      return;
    }

    try {
      await authService.changePassword({
        currentPassword:
          passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage("Senha alterada com sucesso.");
    } catch {
      setPasswordError(
        "Erro ao alterar senha."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.container}>
        <section className={styles.card}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                />
              ) : (
                <span>
                  {profile?.firstName?.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h1>{profileForm.name || "Usuário"}</h1>
              <p>{profile?.email}</p>
            </div>
          </div>

          {profileError && (
            <p className={styles.error}>
              {profileError}
            </p>
          )}

          <form
            className={styles.form}
            onSubmit={handleProfileSave}
          >
            <label className={styles.field}>
              <span>Nome completo</span>
              <input
                value={profileForm.name}
                onChange={(e) =>
                  updateProfileField(
                    "name",
                    e.target.value
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>E-mail</span>
              <input
                value={profile?.email ?? ""}
                disabled
              />
            </label>

            <label className={styles.field}>
              <span>Telefone</span>
              <input
                value={profileForm.phone}
                onChange={(e) =>
                  updateProfileField(
                    "phone",
                    formatPhone(
                      e.target.value
                    )
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>Foto de perfil</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (!file) return;

                  setAvatarFile(file);
                  setAvatarPreview(
                    URL.createObjectURL(
                      file
                    )
                  );
                }}
              />
            </label>

            <button
              className={
                styles.primaryButton
              }
              type="submit"
              disabled={
                isSavingProfile
              }
            >
              {isSavingProfile
                ? "Salvando..."
                : "Salvar perfil"}
            </button>

            {profileMessage && (
              <p className={styles.success}>
                {profileMessage}
              </p>
            )}
          </form>

          <div className={styles.divider} />

          <form
            className={styles.form}
            onSubmit={
              handlePasswordChange
            }
          >
            <h2>Alterar senha</h2>

            <label className={styles.field}>
              <span>Senha atual</span>
              <input
                type="password"
                value={
                  passwordForm.currentPassword
                }
                onChange={(e) =>
                  updatePasswordField(
                    "currentPassword",
                    e.target.value
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>Nova senha</span>
              <input
                type="password"
                value={
                  passwordForm.newPassword
                }
                onChange={(e) =>
                  updatePasswordField(
                    "newPassword",
                    e.target.value
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>
                Confirmar nova senha
              </span>
              <input
                type="password"
                value={
                  passwordForm.confirmPassword
                }
                onChange={(e) =>
                  updatePasswordField(
                    "confirmPassword",
                    e.target.value
                  )
                }
              />
            </label>

            <button
              className={
                styles.primaryButton
              }
              type="submit"
              disabled={
                isChangingPassword
              }
            >
              {isChangingPassword
                ? "Enviando..."
                : "Alterar senha"}
            </button>

            {passwordError && (
              <p className={styles.error}>
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p className={styles.success}>
                {passwordMessage}
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}