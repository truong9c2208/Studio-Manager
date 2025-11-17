import type { NavItem } from './types';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { EventsIcon } from './components/icons/EventsIcon';
import { ProductsIcon } from './components/icons/ProductsIcon';
import { KeyIcon } from './components/icons/KeyIcon';
import { ProjectsIcon } from './components/icons/ProjectsIcon';
import { ResourcesIcon } from './components/icons/ResourcesIcon';
import { CustomersIcon } from './components/icons/CustomersIcon';
import { EmployeesIcon } from './components/icons/EmployeesIcon';
import { InvoicesIcon } from './components/icons/InvoicesIcon';
import { TicketsIcon } from './components/icons/TicketsIcon';
import { BellIcon } from './components/icons/BellIcon';
import { TargetIcon } from './components/icons/TargetIcon';
import { GraduationCapIcon } from './components/icons/GraduationCapIcon';
import { WorkflowIcon } from './components/icons/WorkflowIcon';

// FIX: Add parentheses around the intersection type to ensure the array type `[]` applies to the whole type, not just the last part.
export const NAV_ITEMS: (Omit<NavItem, 'label'> & { labelKey: string })[] = [
  { id: 'Dashboard', labelKey: 'nav_dashboard', icon: DashboardIcon, visibility: 'all' },  
  // { id: 'Notifications', labelKey: 'nav_notifications', icon: BellIcon, visibility: 'all' },
  { id: 'Projects', labelKey: 'nav_projects', icon: ProjectsIcon, visibility: 'all' },
  
  // Staff & Admin features
  // { id: 'Goals', labelKey: 'nav_goals', icon: TargetIcon, visibility: 'all' },
  // { id: 'Learning', labelKey: 'nav_learning', icon: GraduationCapIcon, visibility: 'all' },
  // { id: 'Workflows', labelKey: 'nav_workflows', icon: WorkflowIcon, visibility: 'all' },

  // Admin-specific
  { id: 'Employees', labelKey: 'nav_employees', icon: EmployeesIcon, visibility: 'admin' },
  { id: 'Customers', labelKey: 'nav_customers', icon: CustomersIcon, visibility: 'admin' },
  
  // Shared
  // { id: 'Events', labelKey: 'nav_events', icon: EventsIcon, visibility: 'all' },
  // { id: 'Invoices', labelKey: 'nav_invoices', icon: InvoicesIcon, visibility: 'all' },
  // { id: 'Tickets', labelKey: 'nav_tickets', icon: TicketsIcon, visibility: 'all' },
  { id: 'Products', labelKey: 'nav_products', icon: ProductsIcon, visibility: 'all' },
  // { id: 'Resources', labelKey: 'nav_resources', icon: ResourcesIcon, visibility: 'all' },
  // { id: 'Licences', labelKey: 'nav_licences', icon: KeyIcon, visibility: 'all' },
];