import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddShiftDialog } from '@/components/add-shift-dialog';

export default function TrackTipsSection() {
  return (
    <section className="p-3">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">Track your tips</h2>
      </header>
      <AddShiftDialog />
    </section>
  );
}
