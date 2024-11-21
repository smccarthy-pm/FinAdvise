import { Task } from '../../types/task';
import { Event } from '../../types/event';
import { useAIStore } from './store';

interface CRMRecord {
  id: string;
  type: 'contact' | 'lead' | 'opportunity';
  name: string;
  status: string;
  lastInteraction?: string;
  nextFollowUp?: string;
}

export class AIServices {
  // Task Management
  async createTask(details: Omit<Task, 'id' | 'completed'>): Promise<Task> {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      return response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Calendar Management
  async scheduleEvent(details: Omit<Event, 'id'>): Promise<Event> {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      
      if (!response.ok) throw new Error('Failed to schedule event');
      return response.json();
    } catch (error) {
      console.error('Error scheduling event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      return response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // CRM Management
  async getCRMRecords(type: 'contact' | 'lead' | 'opportunity'): Promise<CRMRecord[]> {
    try {
      const response = await fetch(`/api/crm/${type}`);
      if (!response.ok) throw new Error(`Failed to fetch ${type} records`);
      return response.json();
    } catch (error) {
      console.error('Error fetching CRM records:', error);
      throw error;
    }
  }

  async updateCRMRecord(recordId: string, updates: Partial<CRMRecord>): Promise<CRMRecord> {
    try {
      const response = await fetch(`/api/crm/records/${recordId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update CRM record');
      return response.json();
    } catch (error) {
      console.error('Error updating CRM record:', error);
      throw error;
    }
  }

  // Reminder Management
  async setReminder(details: {
    type: 'task' | 'event' | 'crm';
    referenceId: string;
    date: string;
    description: string;
  }): Promise<void> {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      
      if (!response.ok) throw new Error('Failed to set reminder');
    } catch (error) {
      console.error('Error setting reminder:', error);
      throw error;
    }
  }

  // Report Generation
  async generateReport(type: string, filters: Record<string, unknown>): Promise<string> {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, filters })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}