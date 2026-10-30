import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

export default function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel = 'Confirm', onConfirm, danger = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none border-ecs-black/15 bg-ecs-white">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light tracking-tight">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-ecs-black/60 font-light leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] border border-ecs-black/20 hover:border-ecs-black transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onOpenChange(false); }}
            className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
              danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-ecs-black text-ecs-white hover:bg-ecs-gold hover:text-ecs-black'
            }`}
          >
            {confirmLabel}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}