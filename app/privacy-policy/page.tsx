import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="p-6 md:p-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Privacy Policy
      </h1>
      <p className="text-center text-sm md:text-base italic mb-8">
        Last Updated: 21/11/2024
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email, phone number,
              qualifications, and employment history.
            </li>
            <li>
              <strong>Payment Information:</strong> Bank account or digital
              wallet details for transactions.
            </li>
            <li>
              <strong>Professional Information:</strong> Work experience,
              certifications, and availability.
            </li>
            <li>
              <strong>Usage Data:</strong> Login times, browsing activities, and
              interactions.
            </li>
            <li>
              <strong>Device Information:</strong> IP address, browser type, and
              operating system.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Account creation and management.</li>
            <li>Matching professionals with institutions.</li>
            <li>Notifications and updates.</li>
            <li>Processing payments and invoices.</li>
            <li>Improving platform functionality and user experience.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            3. How We Share Your Information
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Limited professional details with healthcare institutions.</li>
            <li>Job details with healthcare professionals.</li>
            <li>
              Data with third-party service providers (e.g., payment
              processors).
            </li>
            <li>Compliance with legal obligations if required.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            4. Data Retention
          </h2>
          <p>
            Information is retained as long as necessary for services, legal
            obligations, and dispute resolution. Data is securely deleted or
            anonymized when no longer required.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            5. Your Rights
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Access, update, or correct your information.</li>
            <li>Request data deletion (subject to legal requirements).</li>
            <li>Withdraw consent for data processing.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            6. Data Security
          </h2>
          <p>
            We employ technical measures to protect your data but recommend
            using strong passwords and being cautious online.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            7. Cookies and Tracking Technologies
          </h2>
          <p>
            Cookies enhance user experience and monitor website performance.
            Adjust browser settings to manage cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            8. Third-Party Links
          </h2>
          <p>
            We are not responsible for the privacy practices of external
            websites linked on our platform. Review their privacy policies
            independently.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            9. Changes to Our Privacy Policy
          </h2>
          <p>
            This policy may be updated periodically. Significant changes will be
            communicated with a revised effective date.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            10. Contact Us
          </h2>
          <p>If you have questions or concerns, please reach out via:</p>
          <ul className="ml-6 mt-2">
            <li>
              Email:{" "}
              <a
                href="mailto:medishifts@gmail.com"
                className="text-blue-500 underline"
              >
                medishifts@gmail.com
              </a>
            </li>
            <li>
              WhatsApp:{" "}
              <a
                href="https://wa.me/917499544044"
                className="text-blue-500 underline"
              >
                +917499544044
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;