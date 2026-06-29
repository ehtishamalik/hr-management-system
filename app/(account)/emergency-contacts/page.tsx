export const dynamic = "force-dynamic";

import Headline from "@/components/headline";
import ContactFormCard from "@/components/contact-form-card";

import { getSession } from "@/lib/auth/session";
import { EmergencyContactsForm } from "./contact-form";
import { getEmergencyContactsByUserId } from "@/services/emergency-contact";

const Profile = async () => {
  const session = await getSession();
  const contacts = await getEmergencyContactsByUserId(session.user.id);

  return (
    <>
      <Headline>Emergency Contacts</Headline>
      <section className="grid-flexible">
        {contacts.map((contact) => (
          <ContactFormCard key={contact.id} contact={contact} isUser />
        ))}
      </section>

      {contacts.length < 3 && (
        <section className="space-y-4">
          <Headline type="h2">Add Emergency Contact</Headline>
          <EmergencyContactsForm />
        </section>
      )}
    </>
  );
};

export default Profile;
