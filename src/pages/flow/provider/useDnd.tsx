import { IUnit } from '@/pages/flow/Flow';
import { Rect, useReactFlow, XYPosition } from '@xyflow/react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

type OnDropType = {
  position: XYPosition;
  canDrop: boolean;
  // dropNode: Node;
};

export type OnDropAction = ({ position, canDrop }: OnDropType) => void;

interface DnDContextType {
  // If a node is being dragged.
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  // The action to be performed when something is dropped on the flow.
  dropAction: OnDropAction | null;
  setDropAction: Dispatch<SetStateAction<OnDropAction | null>>;
}

const DnDContext = createContext<DnDContextType | null>(null);

// The DnDProvider is used to provide the context for the DnD functionality.
// This allows you to wrap your `ReactFlow` component instance in the `DnDProvider`,
// so you do not need to register any callback in `App.tsx`.
// You can just use the `useDnD` hook in your components that need to start dragging a new node into the flow.
// In our case, it will be the `Sidebar` component.
export function DnDProvider({ children }: { children: React.ReactNode }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dropAction, setDropAction] = useState<OnDropAction | null>(null);

  return (
    <DnDContext.Provider
      value={{
        isDragging,
        setIsDragging,
        dropAction,
        // This is a workaround to ensure that the drop action is not treated as a lazy function.
        setDropAction: (action) => setDropAction(() => action)
      }}
    >
      {children}
    </DnDContext.Provider>
  );
}

export default DnDContext;

export const useDnD = () => {
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();
  const [rect, setRect] = useState<Rect>({ height: 0, width: 0, x: 0, y: 0 });

  const context = useContext(DnDContext);

  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }

  const { isDragging, setIsDragging, setDropAction, dropAction } = context;

  // This callback will be returned by the `useDnD` hook, and can be used in your UI,
  // when you want to start dragging a node into the flow.
  // For example, this is used in the `Sidebar` component.
  const onDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, rect: Rect, onDrop: OnDropAction) => {
      event.preventDefault();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      setDropAction(onDrop);
      setRect(rect);
    },
    [setIsDragging, setDropAction]
  );

  const onDragEnd = useCallback(
    (event: PointerEvent) => {
      if (!isDragging) {
        setIsDragging(false);
        return;
      }

      (event.target as HTMLElement).releasePointerCapture(event.pointerId);

      // Use elementFromPoint to get the actual element under the pointer
      const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
      const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow');
      event.preventDefault();

      // Only allow dropping on the flow area
      if (isDroppingOnFlow) {
        const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const dragRect: Rect = {
          ...flowPosition,
          height: rect.height,
          width: rect.width
        };
        const canDrop = getIntersectingNodes(dragRect).length === 0;
        dropAction?.({ position: flowPosition, canDrop });
      }

      setIsDragging(false);
    },
    [screenToFlowPosition, getIntersectingNodes, setIsDragging, dropAction, isDragging, rect]
  );

  // Add global touch event listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('pointerup', onDragEnd);

    return () => {
      document.removeEventListener('pointerup', onDragEnd);
    };
  }, [onDragEnd, isDragging]);

  return {
    isDragging,
    onDragStart
  };
};

export const useDnDPosition = ({ node }: { node: IUnit }) => {
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();

  const [position, setPosition] = useState<XYPosition | undefined>(undefined);
  const [canDrop, setCanDrop] = useState<boolean>(true);

  // By default, the pointer move event sets the position of the dragged element in the context.
  // This will be used to display the `DragGhost` component.
  const onDrag = useCallback(
    (event: PointerEvent) => {
      event.preventDefault();

      const screenPosition: XYPosition = { x: event.clientX, y: event.clientY };
      const flowPosition = screenToFlowPosition(screenPosition);
      const dragRect: Rect = {
        ...flowPosition,
        height: node.height,
        width: node.width
      };
      const checkCanDrop = getIntersectingNodes(dragRect).length === 0;

      setCanDrop(checkCanDrop);
      setPosition(screenPosition);
    },
    [node, getIntersectingNodes, screenToFlowPosition, setCanDrop, setPosition]
  );

  useEffect(() => {
    document.addEventListener('pointermove', onDrag);
    return () => {
      document.removeEventListener('pointermove', onDrag);
    };
  }, [onDrag]);

  return { position, canDrop };
};
