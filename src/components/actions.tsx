import { AddShiftDialog } from '@/components/add-shift-dialog';

export default function Actions() {
  return (
    <section className="p-3">
      <header className="mb-3">
        <h2 className="text-xl font-semibold">Track your tips</h2>
      </header>
      <AddShiftDialog />
    </section>
  );
}
