import { getTranslations, getLocale } from "next-intl/server";
import { Section, SectionHeader, TestimonialCard } from "@/components/marketing";

const testimonials = {
  ar: [
    {
      quote:
        "وفر لنا البوت ساعات من العمل اليومي. العملاء يحصلون على ردود فورية والمبيعات زادت 30%",
      author: {
        name: "أحمد الشمري",
        role: "صاحب مطعم",
        company: "مطعم الديرة",
      },
      rating: 5,
    },
    {
      quote:
        "نظام مزامنة جوجل شيتس ممتاز! كل بيانات المرضى منظمة ومحفوظة تلقائياً",
      author: {
        name: "د. سارة المطيري",
        role: "مديرة عيادة",
        company: "عيادة الصحة",
      },
      rating: 5,
    },
    {
      quote:
        "سهولة الاستخدام مذهلة. بدأنا العمل خلال دقائق والدعم الفني سريع جداً",
      author: {
        name: "محمد عبدالله",
        role: "صاحب متجر",
        company: "متجر النور",
      },
      rating: 5,
    },
  ],
  en: [
    {
      quote:
        "The bot saved us hours of daily work. Customers get instant replies and sales increased by 30%",
      author: {
        name: "Ahmed Al-Shammari",
        role: "Restaurant Owner",
        company: "Al-Deera Restaurant",
      },
      rating: 5,
    },
    {
      quote:
        "The Google Sheets sync is excellent! All patient data is organized and saved automatically",
      author: {
        name: "Dr. Sara Al-Mutairi",
        role: "Clinic Manager",
        company: "Health Clinic",
      },
      rating: 5,
    },
    {
      quote:
        "Amazing ease of use. We started working within minutes and tech support is very fast",
      author: {
        name: "Mohammed Abdullah",
        role: "Store Owner",
        company: "Al-Noor Store",
      },
      rating: 5,
    },
  ],
};

export async function TestimonialsSection() {
  const t = await getTranslations("landing.testimonials");
  const locale = await getLocale();

  const currentTestimonials =
    testimonials[locale as keyof typeof testimonials] || testimonials.ar;

  return (
    <Section id="testimonials" background="muted">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
            rating={testimonial.rating}
          />
        ))}
      </div>

      {/* Company Logos */}
      <div className="mt-16 pt-8 border-t">
        <p className="text-center text-sm text-muted-foreground mb-8">
          {t("trustedBy")}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-28 bg-muted rounded-lg flex items-center justify-center"
            >
              <div className="w-20 h-6 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
