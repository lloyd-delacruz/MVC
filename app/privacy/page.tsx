import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { pageMetadata } from "@/lib/seo";
import { BUSINESS } from "@/lib/site";

/**
 * Plain-language privacy notice describing what this website actually does.
 * CLIENT REVIEW REQUIRED before launch: MVC should confirm retention periods and
 * the privacy contact, and add anything specific to its case-management practice.
 */
export function generateMetadata() {
  return pageMetadata("/privacy");
}

const UPDATED = "October 17, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        lede={`How ${BUSINESS.name} handles the personal information you share with us through this website.`}
      />
      <section className="bg-white py-16 lg:py-20">
        <div className="container-x">
          <Prose className="mx-auto max-w-3xl">
            <p>
              <em>Last updated: {UPDATED}</em>
            </p>

            <h2>Who we are</h2>
            <p>
              {BUSINESS.name} (&ldquo;MVC&rdquo;, &ldquo;we&rdquo;) is a Canadian immigration
              consultancy based at {BUSINESS.address.streetAddress}, {BUSINESS.address.addressLocality},{" "}
              {BUSINESS.address.addressRegion}. We handle personal information in line with
              Canada&rsquo;s <em>Personal Information Protection and Electronic Documents Act</em>{" "}
              (PIPEDA) and British Columbia&rsquo;s <em>Personal Information Protection Act</em>.
            </p>

            <h2>What we collect and why</h2>
            <ul>
              <li>
                <strong>Assessment form.</strong> When you request a free assessment, the details you
                enter (such as your name, contact details, education, work history and immigration
                goals) are sent to our customer-relationship system, operated by Zoho, so a
                Regulated Canadian Immigration Consultant can review your profile and reply.
              </li>
              <li>
                <strong>Email and phone.</strong> If you email or call us, we use what you share only
                to respond to your enquiry and, if you become a client, to work on your file.
              </li>
              <li>
                <strong>Booking a paid consultation.</strong> Paid consultations are scheduled
                through Calendly, which collects the details needed to book your appointment.
              </li>
              <li>
                <strong>Website analytics.</strong> We use Google Analytics to understand how the
                site is used (for example, which pages are visited and whether a call or email
                button was clicked). We do not send names, email addresses, phone numbers or
                anything you type into a form to Google Analytics, and advertising features are
                turned off.
              </li>
              <li>
                <strong>Embedded content.</strong> Some pages show Google Maps and a Google Reviews
                widget. Those services may set their own cookies when the page loads.
              </li>
            </ul>

            <h2>How we share information</h2>
            <p>
              We do not sell or rent your personal information. We share it only with the service
              providers named above to operate this website and our practice, and with Immigration,
              Refugees and Citizenship Canada or other authorities when you instruct us to submit
              an application on your behalf, or when the law requires it.
            </p>

            <h2>Keeping it safe</h2>
            <p>
              We limit access to the people who need it to help you and keep information only for
              as long as we need it for your enquiry or file and to meet our professional and legal
              obligations.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask to see, correct or withdraw consent for our use of your personal
              information at any time by emailing{" "}
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. You can also block or
              delete cookies in your browser settings.
            </p>

            <h2>Questions</h2>
            <p>
              Contact us at <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> or{" "}
              <a href="tel:+17782887388">+1 778 288 7388</a>, or see our{" "}
              <Link href="/contact">contact page</Link>.
            </p>
          </Prose>
        </div>
      </section>
    </>
  );
}
