import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TrackTipsSection() {
  return (
    <section className="p-3">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">Track your tips</h2>
      </header>
      <Button className="text-primary-foreground w-full">
        <Plus className="mr-2 h-4 w-4" />
        Add shift
      </Button>
    </section>
  );
}
