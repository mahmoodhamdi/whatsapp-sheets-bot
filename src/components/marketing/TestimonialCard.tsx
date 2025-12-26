import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border bg-card",
        className
      )}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>
            {author.name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{author.name}</div>
          <div className="text-sm text-muted-foreground">
            {author.role} @ {author.company}
          </div>
        </div>
      </div>
    </div>
  );
}
