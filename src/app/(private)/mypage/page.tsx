"use client";

import { useMyPage } from "./_hooks/useMyPage";
import ProfileSection from "./_components/ProfileSection";
import PasswordSection from "./_components/PasswordSection";
import PlayerInfoSection from "./_components/PlayerInfoSection";
import TeamManageSection from "./_components/TeamManageSection";
import AccountSection from "./_components/AccountSection";
import PageContainer from "@/app/_components/PageContainer/PageContainer";
import styles from "./mypage.module.scss";

export default function MyPage() {
  const {
    profile,
    myPlayer,
    inviteCode,
    loading,
    fetchInviteCode,
    updateProfile,
    uploadProfileImage,
    deleteProfileImage,
    changePassword,
    updateTeamName,
    regenerateInviteCode,
    deleteAccount,
  } = useMyPage();

  if (loading || !profile) {
    return <PageContainer loading />;
  }

  const isManager = profile.role === "manager";
console.log(myPlayer)

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>마이페이지</h1>
      </header>

      <div className={styles.content}>
        <ProfileSection
          profile={profile}
          onUpdate={updateProfile}
          onUploadImage={uploadProfileImage}
          onDeleteImage={deleteProfileImage}
        />

        <PasswordSection onChangePassword={changePassword} />

        {myPlayer && <PlayerInfoSection player={myPlayer} />}

        {isManager && profile.team && (
          <TeamManageSection
            teamName={profile.team.name}
            inviteCode={inviteCode}
            onFetchInviteCode={fetchInviteCode}
            onUpdateTeamName={updateTeamName}
            onRegenerateInviteCode={regenerateInviteCode}
          />
        )}

        <AccountSection onDeleteAccount={deleteAccount} />
      </div>
    </>
  );
}
