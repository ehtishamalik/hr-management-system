import Headline from "@/components/headline";
import ContactFormCard from "@/components/contact-form-card";

import { getEmergencyContactsByUserId } from "@/services/emergency-contact";

const EmergencyContacts = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const emergencyContacts = await getEmergencyContactsByUserId(id);

  return (
    <>
      <Headline>Emergency Contacts</Headline>

      <section className="grid-flexible">
        {emergencyContacts.map((contact) => (
          <ContactFormCard key={contact.id} contact={contact} />
        ))}
      </section>
    </>
  );
};

export default EmergencyContacts;
