'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

type SelectionState = {
    x: number;
    y: number;
    text: string;
};

type InlineEditMenuProps = {
    selection: SelectionState;
    onRewrite: (instruction: string) => void;
    onClose: () => void;
};

export function InlineEditMenu({ selection, onRewrite, onClose }: InlineEditMenuProps) {
    const [instruction, setInstruction] = useState('');

    const handleRewriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (instruction) {
            onRewrite(instruction);
        }
    };

    return (
        <div
            className="absolute z-50"
            style={{ top: `${selection.y}px`, left: `${selection.x}px`, transform: 'translateX(-50%) translateY(-100%)' }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-2 rounded-lg border bg-popover p-2 shadow-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                <Input
                    type="text"
                    placeholder="Make it more professional..."
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="h-8 w-64"
                />
                <Button size="sm" onClick={handleRewriteClick} disabled={!instruction}>
                    Rewrite
                </Button>
            </div>
        </div>
    );
}
