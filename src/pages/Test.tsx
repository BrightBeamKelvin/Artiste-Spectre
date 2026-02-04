import { VHSTransition } from '@/components/VHSTransition';

const Test = () => {
    return (
        <div className="fixed inset-0 bg-background overflow-hidden">
            <VHSTransition
                isActive={true}
                onComplete={() => { }}
                persist={true}
            />

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] text-[10px] tracking-[0.3em] text-muted-foreground/30 uppercase pointer-events-none">
                ASCII ART TEST PAGE — EDIT IN VHSTransition.tsx
            </div>
        </div>
    );
};

export default Test;
