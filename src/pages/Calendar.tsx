import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Plus, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { BackButton } from '../components/navigation/BackButton';
import { ClientInsights } from '../components/calendar/ClientInsights';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EventModal } from '../components/calendar/EventModal';
import { AppointmentDetails } from '../components/calendar/AppointmentDetails';
import { Event } from '../types/event';

type ViewType = 'month' | 'week' | 'day';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Portfolio Review',
      time: '14:00',
      duration: '30',
      type: 'Investment Strategy',
      client: 'John Smith',
      description: 'Quarterly portfolio review and rebalancing discussion',
      date: '2024-02-20'
    },
    {
      id: '2',
      title: 'Market Update',
      time: '16:00',
      duration: '45',
      type: 'Team Meeting',
      description: 'Weekly market analysis and strategy alignment',
      date: '2024-02-20'
    }
  ]);

  const startDate = viewType === 'month' 
    ? startOfMonth(currentDate)
    : startOfWeek(currentDate, { weekStartsOn: 1 });

  const getDaysToShow = () => {
    switch (viewType) {
      case 'month':
        return eachDayOfInterval({
          start: startDate,
          end: endOfMonth(currentDate)
        });
      case 'week':
        return [...Array(7)].map((_, i) => addDays(startDate, i));
      case 'day':
        return [currentDate];
      default:
        return [];
    }
  };

  const days = getDaysToShow();

  const navigateDate = (direction: 'prev' | 'next') => {
    switch (viewType) {
      case 'month':
        setCurrentDate(prev => {
          const date = new Date(prev);
          date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
          return date;
        });
        break;
      case 'week':
        setCurrentDate(prev => 
          direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1)
        );
        break;
      case 'day':
        setCurrentDate(prev => 
          direction === 'next' ? addDays(prev, 1) : addDays(prev, -1)
        );
        break;
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleEventEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(false);
    setIsEventModalOpen(true);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsDetailsOpen(false);
  };

  const handleEventSubmit = (eventData: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      // Edit existing event
      setEvents(events.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
    } else {
      // Create new event
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents([...events, newEvent]);
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <PageLayout>
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumbs />
        <BackButton />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg">
            <CalendarHeader
              currentDate={currentDate}
              viewType={viewType}
              onViewChange={setViewType}
              onNavigate={navigateDate}
              onNewEvent={() => {
                setSelectedEvent(null);
                setIsEventModalOpen(true);
              }}
            />
            
            <CalendarGrid
              days={days}
              viewType={viewType}
              events={events}
              getEventsForDay={getEventsForDay}
              onEventClick={handleEventClick}
              onEventEdit={handleEventEdit}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <ClientInsights events={events} />
        </div>
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleEventSubmit}
        initialData={selectedEvent}
      />

      {selectedEvent && (
        <AppointmentDetails
          event={selectedEvent}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedEvent(null);
          }}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
        />
      )}
    </PageLayout>
  );
}