import { CardCompact } from "@/components/card-compact";
import { Heading } from "@/components/heading";
import { AccountTabs } from "@/features/account/components/account-tabs";
import { ProfileForm } from "@/features/account/components/profile-form";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

const ProfilePage = async () => {
  const { user } = await getAuthOrRedirect();

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Profile"
        description="All your profile information"
        tabs={<AccountTabs />}
      />

      <CardCompact
        title="Update profile"
        description="Update your profile information"
        className="w-full max-w-[420px] self-center"
        content={<ProfileForm user={user} />}
      />
    </div>
  );
};

export default ProfilePage;
