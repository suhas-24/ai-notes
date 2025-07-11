import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Block {
  id: string;
  type: 'text' | 'heading' | 'list' | 'code' | 'image';
  content: string;
  metadata?: {
    level?: number; // for headings
    language?: string; // for code blocks
    alt?: string; // for images
    url?: string; // for images
  };
  createdAt: Date;
  updatedAt: Date;
}

interface NotesState {
  blocks: Block[];
  selectedBlockId: string | null;
  isLoading: boolean;
}

interface NotesActions {
  addBlock: (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  selectBlock: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearBlocks: () => void;
}

type NotesStore = NotesState & NotesActions;

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useNotesStore = create<NotesStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      blocks: [],
      selectedBlockId: null,
      isLoading: false,

      // Actions
      addBlock: (blockData) => {
        const newBlock: Block = {
          ...blockData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set(
          (state) => ({
            blocks: [...state.blocks, newBlock],
          }),
          false,
          'addBlock'
        );
      },

      updateBlock: (id, updates) => {
        set(
          (state) => ({
            blocks: state.blocks.map((block) =>
              block.id === id
                ? { ...block, ...updates, updatedAt: new Date() }
                : block
            ),
          }),
          false,
          'updateBlock'
        );
      },

      deleteBlock: (id) => {
        set(
          (state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
            selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
          }),
          false,
          'deleteBlock'
        );
      },

      reorderBlocks: (fromIndex, toIndex) => {
        set(
          (state) => {
            const newBlocks = [...state.blocks];
            const [movedBlock] = newBlocks.splice(fromIndex, 1);
            newBlocks.splice(toIndex, 0, movedBlock);
            return { blocks: newBlocks };
          },
          false,
          'reorderBlocks'
        );
      },

      selectBlock: (id) => {
        set({ selectedBlockId: id }, false, 'selectBlock');
      },

      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      clearBlocks: () => {
        set(
          {
            blocks: [],
            selectedBlockId: null,
          },
          false,
          'clearBlocks'
        );
      },
    }),
    {
      name: 'notes-store',
    }
  )
);
