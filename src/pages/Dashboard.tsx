import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { ChatInterface } from '../components/ChatInterface';
import { QuickActions } from '../components/QuickActions';
import { TaskManagement } from '../components/TaskManagement';
import { Schedule } from '../components/Schedule';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';

interface ModuleLayout {
  main: string[];
  sidebar: string[];
}

export function Dashboard() {
  const [layout, setLayout] = useState<ModuleLayout>({
    main: ['tasks'],
    sidebar: ['schedule', 'quickActions']
  });
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeSection = layout.main.includes(activeId) ? 'main' : 'sidebar';
    const overSection = layout.main.includes(overId) ? 'main' : 'sidebar';

    if (activeSection === overSection) {
      const items = layout[activeSection];
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);

      if (oldIndex !== newIndex) {
        setLayout(prev => ({
          ...prev,
          [activeSection]: arrayMove(items, oldIndex, newIndex)
        }));
      }
    } else {
      setLayout(prev => ({
        main: prev.main.filter(id => id !== activeId),
        sidebar: prev.sidebar.filter(id => id !== activeId),
        [overSection]: [...prev[overSection], activeId]
      }));
    }
  };

  const renderModule = (moduleId: string) => {
    switch (moduleId) {
      case 'tasks':
        return <TaskManagement />;
      case 'schedule':
        return <Schedule />;
      case 'quickActions':
        return <QuickActions />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col gap-4">
        <ChatInterface />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <SortableContext items={layout.main} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {layout.main.map((moduleId) => (
                    <SortableItem key={moduleId} id={moduleId}>
                      {renderModule(moduleId)}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </div>
            
            <div className="w-96">
              <SortableContext items={layout.sidebar} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {layout.sidebar.map((moduleId) => (
                    <SortableItem key={moduleId} id={moduleId}>
                      {renderModule(moduleId)}
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </div>
    </PageLayout>
  );
}