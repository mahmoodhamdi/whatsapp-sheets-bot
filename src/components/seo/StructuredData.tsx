interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WhatsApp Bot",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Automate your WhatsApp responses and sync with Google Sheets. Perfect for stores, clinics, and restaurants.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
  };

  return <StructuredData data={schema} />;
}

export function SoftwareApplicationSchema() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WhatsApp Auto-Reply Bot",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: baseUrl,
    description:
      "Smart auto-reply WhatsApp bot with Google Sheets integration for business automation.",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "99",
      priceCurrency: "USD",
      offerCount: 4,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    featureList: [
      "Auto-Reply Rules",
      "Google Sheets Sync",
      "Multi-language Support",
      "Analytics Dashboard",
      "Working Hours Configuration",
    ],
  };

  return <StructuredData data={schema} />;
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={schema} />;
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return <StructuredData data={schema} />;
}

interface PricingSchemaProps {
  plans: Array<{
    name: string;
    price: number;
    currency?: string;
    description: string;
    features: string[];
  }>;
}

export function PricingSchema({ plans }: PricingSchemaProps) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "WhatsApp Auto-Reply Bot",
    description:
      "Smart auto-reply WhatsApp bot with Google Sheets integration",
    url: `${baseUrl}/pricing`,
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: plan.currency || "USD",
      description: plan.description,
      itemOffered: {
        "@type": "Service",
        name: plan.name,
        description: plan.features.join(", "),
      },
    })),
  };

  return <StructuredData data={schema} />;
}
