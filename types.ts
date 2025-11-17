import type { FC } from 'react';
import type { IconProps } from './components/icons/IconProps';

export interface NavItem {
  id: string;
  label: string;
  icon: FC<IconProps>;
  visibility: 'all' | 'admin' | 'staff';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface KPI {
  teamwork: number;
  problemSolving: number;
  communication: number;
  punctuality: number;
  qualityOfWork: number;
}

export interface PeerRating {
  reviewerId: string;
  date: string;
  criteria: {
    collaboration: number;
    technicalSkill: number;
    creativity: number;
  };
  comment: string;
}

export interface CustomerFeedback {
  customerName: string;
  projectName: string;
  date: string;
  rating: number;
  comment: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // A, B, C, D
  correctAnswerIndex: number; // 0, 1, 2, or 3
}

export interface Course {
  id: string;
  name: string;
  category: 'Development' | 'Design' | 'Management' | 'Communication';
  duration: string;
  link: string;
  description: string;
  youtubeUrl?: string;
  isRecommended?: boolean;
  outcomes?: string[];
  quiz?: QuizQuestion[];
}

export interface QuizResult {
  score: number;
  total: number;
  date: string;
}

export interface LearningAssignment {
  courseId: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  assignedDate: string;
  progress?: number; // 0-100
  quizAnswers?: { [questionId: string]: number }; // { questionId: chosenOptionIndex }
  quizHistory?: QuizResult[];
}


export type Shift = 'Morning (9am-5pm)' | 'Afternoon (1pm-9pm)' | 'Night (5pm-1am)';

export interface ScheduleItem {
    date: string;
    shifts: Shift[];
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number; // Positive for earnings, negative for spending
  type: 'bonus' | 'commission' | 'redemption' | 'withdrawal' | 'adjustment';
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface TimeOffRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: 'Vacation' | 'Sick Leave' | 'Personal';
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export type AchievementTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'Trophy' | 'Rocket' | 'Bug' | 'Heart' | 'Award';
  tier: AchievementTier;
}

export interface EarnedAchievement {
  achievementId: string;
  dateAwarded: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  departmentId: string;
  status: 'Active' | 'On Leave';
  systemRole: 'Admin' | 'User';
  phone: string;
  address: Address;
  kpi: KPI;
  customerRating: number;
  peerRatings: PeerRating[];
  customerFeedback: CustomerFeedback[];
  learningPaths: LearningAssignment[];
  schedule: ScheduleItem[];
  dailyScheduleChanges: { [date: string]: number };
  revenueGenerated: number;
  referralCode?: string;
  wallet: Wallet;
  achievements: EarnedAchievement[];
  timeOffRequests: TimeOffRequest[];
  leaveBalances: {
    annual: number;
    sick: number;
    personal: number;
  };
  reportsTo?: string; // employeeId of their manager
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  attachments?: { name: string, link: string }[];
  type?: 'staff' | 'customer' | 'system';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  added: string;
  link: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  deadline?: string;
  points?: number;
  assigneeId?: string;
  description?: string;
  comments?: Comment[];
  subtasks?: Subtask[];
  startDate?: string;
  dependencies?: string[];
  optimisticDuration?: number; // In days
  mostLikelyDuration?: number; // In days
  pessimisticDuration?: number; // In days
  suggestedRole?: string;
}

export interface ProjectPage {
  id: string;
  title: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'On Track' | 'At Risk' | 'Off Track' | 'Completed';
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  team: { employeeId: string; role: string }[];
  tasks: Task[];
  documents?: Document[];
  pages?: ProjectPage[];
  criticalPath?: string[];
}

export interface InvoiceItem {
    productId: string;
    description: string;
    quantity: number;
    price: number;
}

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceDate: string;
  dueDate: string;
  ticketId: string;
  products?: InvoiceItem[];
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  address?: Address;
  lastActivity: string;
  status: 'Active' | 'Inactive';
}

export interface Payment {
    id: string;
    date: string;
    amount: number;
    type: 'Deposit' | 'Final Payment';
    invoiceId: string;
}

export interface ChangeRequest {
    id: string;
    description: string;
    priceImpact: number;
    status: 'Pending Approval' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface Requirement {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
}

export interface Note {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  type: 'staff' | 'customer' | 'system';
}

export interface Ticket {
  id: string;
  title: string;
  requesterName: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  assignees: { employeeId: string; role: string }[];
  deadline?: string;
  rating?: number;
  relatedProductIds?: string[];
  relatedLicenceId?: string;
  paymentStatus: 'Unpaid' | 'Deposit Paid' | 'Fully Paid' | 'Refund Requested' | 'Refunded';
  depositAmount: number;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  referralCode?: string;
  payments: Payment[];
  changeRequests?: ChangeRequest[];
  requirements?: Requirement[];
  additionalLineItems?: { id: string; description: string; price: number }[];
  notes?: Note[];
}

export interface ProductCategory {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    categoryId: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    tags: string[];
    createdAt: string;
}

export interface Licence {
    id: string;
    productId: string;
    customerId: string;
    key: string;
    startDate: string;
    expires: string;
    createdAt: string;
    status: 'Active' | 'Expired' | 'Revoked';
    product?: string; // some data has this
    customer?: string; // some data has this
}

export interface RefundRequest {
    id: string;
    customerId: string;

    ticketId: string;
    paymentId: string;
    productId?: string;
    invoiceId?: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
}

export interface Voucher {
    id: string;
    code: string;
    description: string;
    discountAmount: number;
    applicableProductIds?: string[];
    uses: number;
    maxUses?: number;
}

export interface Event {
    id: string;
    title: string;
    type: 'Internal' | 'Customer' | 'Marketing' | 'Partner';
    startDate: string;
    endDate: string;
    project: string;
    description: string;
    ownerId: string;
    participants: string[];
    vouchers?: Voucher[];
    status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    timestamp: string;
}

export interface Department {
    id: string;
    name: string;
    managerId: string;
}

export type ServerFork = 'Paper' | 'Spigot' | 'Purpur' | 'Folia' | 'Fabric' | 'Forge';

export interface PluginVersion {
    id: string;
    version: string;
    changelog: string;
    releaseDate: string;
    minecraftVersions: string[];
    supportedForks: ServerFork[];
    downloadUrl: string;
    fileName: string;
    downloads: number;
}

export interface PluginDependency {
    id: string;
    name: string;
    required: boolean;
    link: string;
}

export interface Plugin {
    id: string;
    name: string;
    iconUrl: string;
    tagline: string;
    description: string;
    category: 'Gameplay' | 'Admin Tools' | 'Economy' | 'Fun';
    authors: string[];
    versions: PluginVersion[];
    dependencies: PluginDependency[];
    wikiPages: ProjectPage[];
    lastUpdated: string;
    sourceRepoId?: string;
}

export interface Issue {
    id: number;
    title: string;
    authorId: string;
    status: 'Open' | 'Closed';
    createdAt: string;
}

export type GitRepoParticipantRole = 'Admin' | 'Maintainer' | 'Developer';

export interface Commit {
    hash: string;
    message: string;
    authorId: string;
    date: string;
}

export interface CodeFile {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    lastCommit?: {
        message: string;
        date: string;
    };
}

export interface GitRepository {
    id: string;
    name: string;
    owner: string;
    description: string;
    language: 'Java' | 'TypeScript' | 'Go' | 'Python';
    stars: number;
    forks: number;
    lastUpdated: string;
    defaultBranch: string;
    branches: string[];
    files: { [branch: string]: CodeFile[] };
    commits: Commit[];
    readme: string;
    participants: { employeeId: string, role: GitRepoParticipantRole }[];
    issues: Issue[];
    pullRequests: PullRequest[];
    releases: Release[];
    wikiPages: ProjectPage[];
}

export interface PullRequest {
    id: number;
    title: string;
    authorId: string;
    status: 'Open' | 'Merged' | 'Closed';
    createdAt: string;
    sourceBranch: string;
    targetBranch: string;
}

export interface Release {
    id: string;
    tagName: string;
    title: string;
    description: string;
    createdAt: string;
}

export interface LicenceActivity {
    id: string;
    licenceId: string;
    action: string;
    details: string;
    actorId: string; // employeeId or 'system'
    timestamp: string;
}

// --- New Staff Features ---
export interface KeyResult {
  id: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; // e.g., '%', '$', 'tickets', 'commits'
  targetDirection?: 'increase' | 'decrease'; // 'increase' is default (higher is better)
}

export interface GoalCheckIn {
  id: string;
  updaterId: string;
  date: string;
  comment: string;
  updates: {
    keyResultId: string;
    previousValue: number;
    newValue: number;
  }[];
  newStatus?: Goal['status'];
}

export interface Goal {
  id: string;
  employeeId?: string; // The person responsible for this goal
  departmentId?: string; // The department responsible for this goal
  assignerId: string | null; // Who assigned it (null for personal goals)
  parentGoalId: string | null; // For hierarchical goals
  title: string;
  period: 'Q3 2024' | 'Q4 2024' | 'Annual 2024';
  type: 'Objective' | 'Personal'; // Distinguish between mandatory and personal
  status: 'On Track' | 'At Risk' | 'Achieved' | 'Missed';
  progress: number; // Calculated 0-100
  keyResults: KeyResult[];
  checkIns?: GoalCheckIn[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  actionText: string;
  actionLink: string; // Corresponds to NavItem ID
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  steps: WorkflowStep[];
}