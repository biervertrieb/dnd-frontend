import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFloating, autoUpdate, offset, flip, shift, size } from '@floating-ui/react';
import { Caret } from 'textarea-caret-ts';
import { useCompendiumStore } from '../features/compendium/CompendiumStore';
import type { CompendiumEntry } from '../features/compendium/types';

interface AutocompleteState {
    isOpen: boolean;
    query: string;
    triggerStart: number;
    selectedIndex: number;
}

const CardEditor = ({ value, onChange, className }: { value: string, onChange: (value: string) => void, className: string }) => {
    const [autocomplete, setAutocomplete] = useState<AutocompleteState>({
        isOpen: false,
        query: '',
        triggerStart: 0,
        selectedIndex: 0,
    });

    const compEntries = useCompendiumStore((s) => s.entries);
    const loadEntries = useCompendiumStore((s) => s.loadEntries);

    useEffect(() => {
        loadEntries();
    }, []);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Filter notes based on query
    const suggestions = React.useMemo(() => {
        if (!autocomplete.query || autocomplete.query.length < 1) return compEntries;

        return compEntries.filter(note =>
            note.title.toLowerCase().includes(autocomplete.query.toLowerCase())
        ).slice(0, 8); // Limit to 8 suggestions
    }, [autocomplete.query]);

    // Floating UI setup
    const { refs, floatingStyles, update } = useFloating({
        open: autocomplete.isOpen,
        middleware: [
            offset(4),
            flip(),
            shift({ padding: 8 }),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${Math.min(200, availableHeight)}px`,
                    });
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    // Update floating position when caret moves
    const updateFloatingPosition = useCallback(() => {
        if (!textareaRef.current || !autocomplete.isOpen) return;

        const textarea = textareaRef.current;
        const coords = Caret.getRelativePosition(textarea);

        // Create a virtual reference element at the caret position
        const virtualReference = {
            getBoundingClientRect() {
                const textareaRect = textarea.getBoundingClientRect();
                return {
                    width: 0,
                    height: coords.height,
                    x: textareaRect.left + coords.left,
                    y: textareaRect.top + coords.top,
                    left: textareaRect.left + coords.left,
                    right: textareaRect.left + coords.left,
                    top: textareaRect.top + coords.top,
                    bottom: textareaRect.top + coords.top + coords.height,
                };
            },
        };

        refs.setReference(virtualReference);
        update();
    }, [autocomplete.isOpen, autocomplete.triggerStart, autocomplete.query, refs, update]);

    // Update position when autocomplete state changes
    useEffect(() => {
        updateFloatingPosition();
    }, [updateFloatingPosition]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart;

        onChange(newValue);

        // Check for trigger pattern "[[query"
        const textBeforeCursor = newValue.slice(0, cursorPos);
        const triggerMatch = textBeforeCursor.match(/\[\[([^\]]*?)$/);

        if (triggerMatch) {
            const triggerPos = triggerMatch.index!;
            const query = triggerMatch[1] || '';

            setAutocomplete(prev => ({
                ...prev,
                isOpen: true,
                query,
                triggerStart: triggerPos,
                selectedIndex: 0,
            }));
        } else {
            setAutocomplete(prev => ({ ...prev, isOpen: false, query: '', selectedIndex: 0 }));
        }
    }, []);

    const insertSuggestion = useCallback((note: CompendiumEntry) => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const cursorPos = textarea.selectionStart;

        // Calculate where to insert
        const beforeTrigger = value.slice(0, autocomplete.triggerStart);
        const afterCursor = value.slice(cursorPos);
        const insertText = `[${note.title}](compendium:${note.id})`;

        const newValue = beforeTrigger + insertText + afterCursor;
        const newCursorPos = autocomplete.triggerStart + insertText.length;

        onChange(newValue);
        setAutocomplete(prev => ({ ...prev, isOpen: false, query: '', selectedIndex: 0 }));

        // Set cursor position after insertion
        setTimeout(() => {
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
        }, 0);
    }, [value, autocomplete.triggerStart]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!autocomplete.isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setAutocomplete(prev => ({
                    ...prev,
                    selectedIndex: prev.selectedIndex < suggestions.length - 1 ? prev.selectedIndex + 1 : 0
                }));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setAutocomplete(prev => ({
                    ...prev,
                    selectedIndex: prev.selectedIndex > 0 ? prev.selectedIndex - 1 : suggestions.length - 1
                }));
                break;
            case 'Enter':
            case 'Tab':
                e.preventDefault();
                if (suggestions[autocomplete.selectedIndex]) {
                    insertSuggestion(suggestions[autocomplete.selectedIndex]);
                }
                break;
            case 'Escape':
                setAutocomplete(prev => ({ ...prev, isOpen: false, query: '', selectedIndex: 0 }));
                break;
        }
    }, [autocomplete.isOpen, autocomplete.selectedIndex, suggestions, insertSuggestion]);

    return (
        <>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onScroll={updateFloatingPosition}
                placeholder="Start typing... Use [[ to link to notes"
                className={className}
                rows={8}
            />
            {
                autocomplete.isOpen && suggestions.length > 0 && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto z-50"
                    >
                        <ul className="py-1">
                            {suggestions.map((note, index) => (
                                <li
                                    key={note.id}
                                    className={`px-3 py-2 cursor-pointer text-sm ${index === autocomplete.selectedIndex
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'hover:bg-gray-100'
                                        }`}
                                    onClick={() => insertSuggestion(note)}
                                    onMouseEnter={() => setAutocomplete(prev => ({ ...prev, selectedIndex: index }))}
                                >
                                    <div className="font-medium">{note.title}</div>
                                    <div className="text-xs text-gray-500">ID: {note.id}</div>
                                </li>
                            ))}
                        </ul>

                        {autocomplete.query && suggestions.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                No notes found for "{autocomplete.query}"
                            </div>
                        )}
                    </div>
                )
            }
        </>
    );
};

export default CardEditor;
