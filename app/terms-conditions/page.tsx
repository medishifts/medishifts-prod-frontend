import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="p-6 md:p-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Terms and Conditions
      </h1>
      <p className="text-center text-sm md:text-base italic mb-8">
        Last Updated: 21/11/2024
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            1. Definitions
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Medishifts:</strong> The platform facilitating the
              connection between hospitals and healthcare professionals (doctors
              and nurses).
            </li>
            <li>
              <strong>Users:</strong> Refers to hospitals, doctors, and nurses
              utilizing the Medishifts platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            2. Services Provided
          </h2>
          <p>
            Medishifts serves as a mediator to connect hospitals with healthcare
            professionals seeking short-term employment. Medishifts does not
            provide training, evaluation, or oversight of the healthcare
            professionals.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            3. Responsibilities of Users
          </h2>
          <ul className="list-disc ml-6 space-y-4">
            <li>
              <strong>Hospitals:</strong>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Have the sole responsibility for selecting and recruiting
                  doctors and nurses through the Medishifts platform.
                </li>
                <li>
                  Acknowledge that the decision to engage with a healthcare
                  professional is at their own risk.
                </li>
                <li>
                  Are responsible for ensuring compliance with applicable laws
                  and regulations in hiring and managing healthcare
                  professionals.
                </li>
              </ul>
            </li>
            <li>
              <strong>Doctors and Nurses:</strong>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Agree to provide accurate and truthful information when
                  registering on the Medishifts platform.
                </li>
                <li>
                  Acknowledge that their actions, whether good or bad, are their
                  own responsibility and that Medishifts is not liable for any
                  outcomes resulting from their professional conduct.
                </li>
              </ul>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            4. Limitation of Liability
          </h2>
          <p>
            Medishifts acts solely as a facilitator and does not assume any
            responsibility for:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              The qualifications or performance of healthcare professionals.
            </li>
            <li>
              Any incidents, actions, or omissions resulting from the engagement
              between hospitals and healthcare professionals.
            </li>
            <li>
              Any claims, damages, or liabilities arising from the use of the
              platform.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            5. Indemnification
          </h2>
          <p>
            Users agree to indemnify and hold Medishifts harmless from any
            claims, liabilities, damages, or expenses (including legal fees)
            arising out of or related to:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>The hiring and management of healthcare professionals.</li>
            <li>
              Any actions taken by healthcare professionals while engaged by
              hospitals.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            6. Modification of Terms
          </h2>
          <p>
            Medishifts reserves the right to modify these Terms and Conditions
            at any time. Users will be notified of any significant changes, and
            continued use of the platform constitutes acceptance of the modified
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            7. Governing Law
          </h2>
          <p>
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of India. Any disputes arising out of or in
            connection with these terms shall be subject to the exclusive
            jurisdiction of the courts in INDIA.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            8. Contact Information
          </h2>
          <p>
            For any questions or concerns regarding these Terms and Conditions,
            please contact us at:
          </p>
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

export default TermsAndConditions;
