import Link from "next/link";
import { EventForm } from "@/components/events/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <Link href="/events" className="text-sm font-medium text-green-700 hover:underline">
        ← Events
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">New event</h1>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
