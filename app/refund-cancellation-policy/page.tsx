import React from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";
const CancellationPolicy = () => {
  return (
    <div className="p-6 md:p-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Cancellation and Refund Policy
      </h1>
      <p className="text-center text-sm md:text-base italic mb-8">
        Last Updated: 21/11/2024
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            1. Application and Payment Process
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>1.1:</strong> When a hospital selects a candidate by
              pressing the "Hire" button, a payment of 10% of the total salary
              posted for the job (or a maximum of ₹300, whichever is less) is
              required to confirm the selection.
            </li>
            <li>
              <strong>1.2:</strong> Upon successful payment, both the hospital
              and the selected candidate receive each other's contact details,
              and the candidate is notified of their selection.
            </li>
          </ul>
        </section>

        {/* Add other sections here, leaving them as-is */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            2. Candidate Unavailability
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>2.1: </strong> If the selected candidate does not show up
              for the job or declines the offer after confirming availability,
              the hospital must notify Medishifts immediately through WhatsApp,
              email, or phone.
            </li>
            <li>
              <strong>2.2:</strong>In such cases, Medishifts will facilitate the
              selection of another candidate for the same job at no extra cost
              to the hospital.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            3. Cancellation by the Hospital
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>3.1: </strong> If the hospital decides not to hire another
              candidate after the selected candidate declines or fails to show
              up, a full refund of the payment will be processed.
            </li>
            <li>
              <strong>3.2:</strong> The refund will be initiated using the same
              payment method used during the transaction. If the original
              payment method is unavailable, Medishifts will request additional
              bank details from the hospital to process the refund.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            4. Conditions for Refund
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>4.1:</strong>A refund request will only be accepted if the
              selected candidate fails to: <p> - Show up for the job.</p>
              <p> - Respond to calls or messages for job confirmation. </p>{" "}
              <p>
                - Inform Medishifts or the hospital of their inability to join
                before the job starts.
              </p>
            </li>
            <li>
              <strong>4.2:</strong>
              No refund will be provided if the hospital cancels the job after a
              successful hire and the candidate was available and ready for the
              job.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            5. Refund Timeline
          </h2>
          <p>
            <strong>5.1: </strong>Refunds will be processed within 7-10 business
            days from the date of the refund request. The refund amount will be
            credited to the hospital's account using the original payment
            method.
            <p>
              <strong>5.2: </strong> In case of any delay, the hospital will be
              notified immediately with an updated timeline for the refund.
            </p>
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            6. Communication
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>6.1: </strong> All refund requests and cancellations must
              be communicated to Medishifts through:{" "}
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
            </li>
            <li>
              <strong>6.2: </strong> Medishifts reserves the right to verify
              claims regarding candidate unavailability before processing a
              refund or allowing a replacement hire.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            7. Final Terms
          </h2>
          <p>
            <strong>7.1: </strong> Medishifts reserves the right to amend this
            policy at any time. Updates will be communicated via the platform or
            email.
          </p>
          <p>
            <strong>7.2: </strong> By using Medishifts, hospitals agree to the
            terms outlined in this Cancellation and Refund Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            8. Contact Information
          </h2>
          <p>
            For any questions or concerns regarding these Refund & Cancellation
            Policies, please contact us at:
          </p>
          <ul className="ml-6 mt-2">
            <li>
              <a
                href="https://wa.me/917499544044"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-500 hover:text-green-600 transition-colors"
              >
                <MessageCircle size={24} />
                <span>WhatsApp</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:medishits@gmail.com"
                className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
              >
                <Mail size={24} />
                <span>Gmail</span>
              </a>
            </li>

            <li>
              <div className="flex items-center space-x-2 text-blue-500">
                <Phone size={24} />
                <span>+91 7499544044</span>
              </div>
            </li>
          </ul>
        </section>

        {/* Final Section with Improved Styling */}
        <section className="text-center mt-10">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
            <a
              href="/terms-conditions"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
            >
              View Terms & Conditions
            </a>
            <a
              href="/privacy-policy"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
            >
              View Privacy Policy
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CancellationPolicy;