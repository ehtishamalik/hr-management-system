import Headline from "@/components/headline";
import ProfileForm from "@/components/ProfileForm";
import NotFoundBanner from "@/components/not-found-banner";

import { getInitials } from "@/lib/utils";
import { getUserById, getUserByRole } from "@/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLE } from "@/enum";

const User = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [user, managers, admins] = await Promise.all([
    getUserById(id),
    getUserByRole([ROLE.MANAGER]),
    getUserByRole([ROLE.ADMIN]),
  ]);

  if (!user) {
    return (
      <NotFoundBanner
        headline="Employee not found."
        description="The employee you are looking for does not exist."
      />
    );
  }

  return (
    <>
      <section className="flex gap-4 items-center">
        <Avatar className="size-12">
          <AvatarImage src={user.user.image ?? undefined} />
          <AvatarFallback className="text-lg">
            {getInitials(user.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <Headline>{user.user.name}</Headline>
          <p className="text-sm text-muted-foreground">
            Update the profile information for {user.user.name}.
          </p>
        </div>
      </section>

      <ProfileForm employee={user} managers={managers} admins={admins} />
    </>
  );
};

export default User;
