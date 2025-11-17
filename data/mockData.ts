import type { Employee, Project, Invoice, Ticket, Customer, Notification, Department, Event, Licence, Product, Plugin, GitRepository, LicenceActivity, ProductCategory, RefundRequest, TimeOffRequest, Achievement, Goal, Workflow, Course, QuizQuestion } from '../types';

export const allAchievements: Achievement[] = [
    { id: 'ach-01', name: 'Century Club', description: 'Close 100 tickets.', icon: 'Trophy', tier: 'Gold' },
    { id: 'ach-02', name: 'Bug Slayer', description: 'Resolve 50 high-priority bug tickets.', icon: 'Bug', tier: 'Silver' },
    { id: 'ach-03', name: 'Launch Commander', description: 'Lead a project from start to completion.', icon: 'Rocket', tier: 'Gold' },
    { id: 'ach-04', name: 'Client Whisperer', description: 'Achieve a 98%+ customer satisfaction rating over a quarter.', icon: 'Heart', tier: 'Diamond' },
    { id: 'ach-05', name: 'Top Referrer', description: 'Bring in 5 new clients through referrals.', icon: 'Award', tier: 'Silver' },
    { id: 'ach-06', name: 'Code Contributor', description: 'Contribute 20 commits to a repository.', icon: 'Trophy', tier: 'Bronze' },
];


export let mockDepartments: Department[] = [
    { id: 'DEPT-01', name: 'Engineering', managerId: 'EMP-02' },
    { id: 'DEPT-02', name: 'Design', managerId: 'EMP-01' },
    { id: 'DEPT-03', name: 'Support', managerId: 'EMP-03' },
];

export const mockCourses: Course[] = [
    { 
        id: 'COURSE-01', 
        name: 'Advanced Figma Techniques', 
        category: 'Design', 
        duration: '8 hours', 
        link: '#', 
        description: 'Master components, variants, and auto-layout to build scalable design systems.',
        isRecommended: true,
        youtubeUrl: 'https://www.youtube.com/embed/cKZEgtQU_dM',
        outcomes: [
            'Understand advanced component properties.',
            'Build complex, responsive layouts.',
            'Organize and maintain a design library.'
        ],
        quiz: [
            { id: 'Q1-1', question: 'What is the main benefit of using variants?', options: ['Makes components colorful', 'Combines similar components into one', 'Creates more layers', 'Exports assets faster'], correctAnswerIndex: 1 },
            { id: 'Q1-2', question: 'Auto Layout is used for...', options: ['Animating transitions', 'Creating responsive frames', 'Choosing fonts automatically', 'Drawing complex shapes'], correctAnswerIndex: 1 }
        ]
    },
    { 
        id: 'COURSE-02', 
        name: 'React State Management', 
        category: 'Development', 
        duration: '12 hours', 
        link: '#', 
        description: 'Deep dive into React hooks, context, and state libraries like Redux and Zustand.',
        isRecommended: true,
        youtubeUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
        outcomes: [
            'Manage complex state with Context API.',
            'Understand the trade-offs of different state libraries.',
            'Optimize component re-renders.'
        ],
        quiz: [
            { id: 'Q2-1', question: 'Which hook is used to manage state in a functional component?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctAnswerIndex: 1 },
            { id: 'Q2-2', question: 'What does `useReducer` return?', options: ['A state and a dispatch function', 'Just the state', 'A single value', 'A boolean'], correctAnswerIndex: 0 }
        ]
    },
    { 
        id: 'COURSE-03', 
        name: 'Effective Team Communication', 
        category: 'Communication', 
        duration: '6 hours', 
        link: '#', 
        description: 'Improve team and client communication skills through active listening and clear articulation.',
        isRecommended: false,
        outcomes: [
            'Practice active listening.',
            'Provide constructive feedback.',
            'Lead more effective meetings.'
        ]
    },
    { 
        id: 'COURSE-04', 
        name: 'Agile Project Management Fundamentals', 
        category: 'Management', 
        duration: '10 hours', 
        link: '#', 
        description: 'Learn the fundamentals of Agile, Scrum, and Kanban to improve project delivery.',
        isRecommended: false,
        youtubeUrl: 'https://www.youtube.com/embed/Z9QbYZh1YXY',
        outcomes: [
            'Run daily stand-up meetings.',
            'Manage a Kanban board effectively.',
            'Understand the role of a Scrum Master.'
        ]
    },
];

export let mockEmployees: Employee[] = [
  { 
    id: 'EMP-01', name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'Head of Design', departmentId: 'DEPT-02', status: 'Active', systemRole: 'Admin',
    phone: '123-456-7890', address: { street: '123 Design Lane', city: 'Creative City', state: 'CA', zip: '90210' },
    kpi: { teamwork: 95, problemSolving: 90, communication: 92, punctuality: 98, qualityOfWork: 96 },
    customerRating: 98,
    peerRatings: [{ reviewerId: 'EMP-02', date: '2024-07-15', criteria: { collaboration: 5, technicalSkill: 4, creativity: 5 }, comment: "Alice is a fantastic collaborator." }],
    customerFeedback: [{ customerName: 'QuantumLeap', projectName: 'Project Alpha', date: '2024-07-10', rating: 5, comment: "Amazing design work!" }],
    learningPaths: [
        { 
            courseId: 'COURSE-01', 
            status: 'Completed', 
            assignedDate: '2024-06-01', 
            progress: 100, 
            quizAnswers: { 'Q1-1': 1, 'Q1-2': 1 },
            quizHistory: [
                { score: 1, total: 2, date: '2024-06-04T14:30:00Z'},
                { score: 2, total: 2, date: '2024-06-05T10:00:00Z' }
            ]
        },
        { courseId: 'COURSE-04', status: 'In Progress', assignedDate: '2024-07-15', progress: 25 },
        { courseId: 'COURSE-02', status: 'In Progress', assignedDate: '2024-07-20', progress: 80, quizHistory: [] },
    ],
    schedule: [{ date: '2025-10-06', shifts: ['Morning (9am-5pm)'] }, { date: '2025-10-07', shifts: ['Morning (9am-5pm)'] }],
    dailyScheduleChanges: {},
    revenueGenerated: 120000,
    referralCode: 'ALICE-2024',
    timeOffRequests: [] as TimeOffRequest[],
    leaveBalances: { annual: 15, sick: 10, personal: 5 },
    wallet: {
      balance: 1250,
      transactions: [
        { id: 'TXN-01', date: '2024-07-01', description: 'Monthly Performance Bonus', amount: 500, type: 'bonus' },
        { id: 'TXN-02', date: '2024-07-15', description: 'Commission from Project Alpha', amount: 1000, type: 'commission' },
        { id: 'TXN-03', date: '2024-07-20', description: 'Redeemed for $50 Amazon Gift Card', amount: -250, type: 'redemption' },
      ]
    },
    achievements: [
        { achievementId: 'ach-03', dateAwarded: '2024-06-28' },
        { achievementId: 'ach-04', dateAwarded: '2024-07-01' },
    ],
    reportsTo: undefined, // Alice is top-level
  },
  { 
    id: 'EMP-02', name: 'Bob Williams', email: 'bob@example.com', password: 'password123', role: 'Engineering Lead', departmentId: 'DEPT-01', status: 'Active', systemRole: 'Admin',
    phone: '234-567-8901', address: { street: '456 Code Street', city: 'Logicburg', state: 'TX', zip: '75001' },
    kpi: { teamwork: 88, problemSolving: 95, communication: 85, punctuality: 94, qualityOfWork: 93 },
    customerRating: 95,
    peerRatings: [], customerFeedback: [], 
    learningPaths: [
        { courseId: 'COURSE-02', status: 'Completed', assignedDate: '2024-07-01', progress: 100, quizHistory: [{ score: 2, total: 2, date: '2024-07-05T11:00:00Z' }] },
        { courseId: 'COURSE-01', status: 'Completed', assignedDate: '2024-06-15', progress: 100 },
        { courseId: 'COURSE-04', status: 'Completed', assignedDate: '2024-06-15', progress: 100 },
    ],
    schedule: [{ date: '2025-10-06', shifts: ['Morning (9am-5pm)', 'Afternoon (1pm-9pm)'] }],
    dailyScheduleChanges: { '2025-10-06': 1 },
    revenueGenerated: 250000,
    referralCode: 'BOB-W-50',
    timeOffRequests: [] as TimeOffRequest[],
    leaveBalances: { annual: 14, sick: 7, personal: 3 },
    wallet: {
      balance: 2800,
      transactions: [
        { id: 'TXN-04', date: '2024-07-01', description: 'Q2 Development Bonus', amount: 1500, type: 'bonus' },
        { id: 'TXN-05', date: '2024-07-22', description: 'Commission from Project Beta', amount: 1500, type: 'commission' },
        { id: 'TXN-06', date: '2024-07-25', description: 'Withdrawal Request (PayPal)', amount: -200, type: 'withdrawal' },
      ]
    },
    achievements: [ { achievementId: 'ach-02', dateAwarded: '2024-07-15' } ],
    reportsTo: 'EMP-01', // Bob reports to Alice
  },
  { 
    id: 'EMP-03', name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', role: 'Support Specialist', departmentId: 'DEPT-03', status: 'Active', systemRole: 'User',
    phone: '345-678-9012', address: { street: '789 Help Ave', city: 'Supportville', state: 'FL', zip: '33101' },
    kpi: { teamwork: 92, problemSolving: 88, communication: 95, punctuality: 91, qualityOfWork: 90 },
    customerRating: 96,
    peerRatings: [], customerFeedback: [], 
    learningPaths: [
        { courseId: 'COURSE-03', status: 'Not Started', assignedDate: '2024-07-20', progress: 0 },
        { courseId: 'COURSE-01', status: 'In Progress', assignedDate: '2024-07-22', progress: 15 },
    ],
    schedule: [],
    dailyScheduleChanges: {},
    revenueGenerated: 50000,
    referralCode: 'CHARLIE-B',
    timeOffRequests: [] as TimeOffRequest[],
    leaveBalances: { annual: 12, sick: 8, personal: 4 },
    wallet: {
      balance: 350,
      transactions: [
        { id: 'TXN-07', date: '2024-07-05', description: 'High CSAT Score Bonus', amount: 200, type: 'bonus' },
        { id: 'TXN-08', date: '2024-07-18', description: 'Commission from TKT-03', amount: 150, type: 'commission' },
      ]
    },
    achievements: [],
    reportsTo: 'EMP-02', // Charlie reports to Bob
  },
  { 
    id: 'EMP-ADMIN', name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'System Administrator', departmentId: 'DEPT-01', status: 'Active', systemRole: 'Admin',
    phone: '555-555-5555', address: { street: '1 Admin Way', city: 'Control City', state: 'CA', zip: '90210' },
    kpi: { teamwork: 99, problemSolving: 99, communication: 99, punctuality: 99, qualityOfWork: 99 },
    customerRating: 100,
    peerRatings: [],
    customerFeedback: [],
    learningPaths: [],
    schedule: [],
    dailyScheduleChanges: {},
    revenueGenerated: 0,
    wallet: { balance: 0, transactions: [] },
    achievements: [],
    timeOffRequests: [],
    leaveBalances: { annual: 20, sick: 10, personal: 5 },
    reportsTo: undefined,
  },
];

export let mockCustomers: Customer[] = [
  { 
    id: 'CUST-01', 
    name: 'John Doe', 
    company: 'QuantumLeap', 
    email: 'john@quantum.com', 
    phone: '555-0101',
    address: { street: '101 Quantum Drive', city: 'Tech City', state: 'CA', zip: '90211' },
    lastActivity: '2024-07-28', 
    status: 'Active' 
  },
  { 
    id: 'CUST-02', 
    name: 'Jane Smith', 
    company: 'Future Systems', 
    email: 'jane@future.com', 
    phone: '555-0102',
    address: { street: '202 Future Ave', city: 'Innovateville', state: 'TX', zip: '75002' },
    lastActivity: '2024-07-25', 
    status: 'Active' 
  },
  { 
    id: 'CUST-03', 
    name: 'Sam Wilson', 
    company: 'Innovate Inc.', 
    email: 'sam@innovate.com', 
    phone: '555-0103',
    address: { street: '303 Innovation Way', city: 'Startup Central', state: 'FL', zip: '33102' },
    lastActivity: '2024-06-15', 
    status: 'Inactive' 
  },
];

export let mockProjects: Project[] = [
  {
    id: 'PROJ-01', name: 'Project Alpha', client: 'QuantumLeap', status: 'On Track', progress: 75, budget: 50000, spent: 35000, deadline: '2024-09-30',
    team: [{ employeeId: 'EMP-01', role: 'Lead Designer' }, { employeeId: 'EMP-02', role: 'Lead Developer' }],
    tasks: [
      { id: 'TASK-01', title: 'Develop login page', status: 'Done', priority: 'High', assigneeId: 'EMP-02', points: 5, startDate: '2024-07-01', deadline: '2024-07-05' },
      { id: 'TASK-02', title: 'Design dashboard mockups', status: 'In Progress', priority: 'High', assigneeId: 'EMP-01', points: 8, startDate: '2024-07-03', deadline: '2024-07-15' },
      { id: 'TASK-03', title: 'Setup database schema', status: 'To Do', priority: 'Medium', assigneeId: 'EMP-02', points: 5, startDate: '2024-07-16', deadline: '2024-07-20' },
    ],
    documents: [{id: 'DOC-123', name: 'Project Brief.pdf', type: 'PDF', added: '2024-07-01', link: '#'}],
    pages: [{id: 'PAGE-1', title: 'Project Goals', content: '# Project Alpha Goals\n\n- Deliver a great product.'}],
    criticalPath: [],
  },
  {
    id: 'PROJ-02', name: 'Project Beta', client: 'Future Systems', status: 'At Risk', progress: 40, budget: 75000, spent: 40000, deadline: '2024-10-31',
    team: [{ employeeId: 'EMP-02', role: 'Backend Developer' }],
    tasks: [
        { id: 'TASK-04', title: 'API Integration', status: 'To Do', priority: 'High', assigneeId: 'EMP-02', points: 8, startDate: '2024-08-01', deadline: '2024-08-10' }
    ],
    criticalPath: [],
  },
];

export let mockTickets: Ticket[] = [
  { id: 'TKT-01', title: 'Login issue on mobile', requesterName: 'John Doe', status: 'In Progress', priority: 'High', createdAt: '2024-07-25', updatedAt: '2024-07-28', ownerId: 'EMP-03', assignees: [], paymentStatus: 'Unpaid', depositAmount: 0, totalAmount: 0, subtotal: 0, discountAmount: 0, payments: [], notes: [] },
  { id: 'TKT-02', title: 'Feature request: Dark mode', requesterName: 'Jane Smith', status: 'Open', priority: 'Medium', createdAt: '2024-07-27', updatedAt: '2024-07-27', ownerId: 'EMP-01', assignees: [{ employeeId: 'EMP-02', role: 'Consultant' }], paymentStatus: 'Unpaid', depositAmount: 0, totalAmount: 0, subtotal: 0, discountAmount: 0, payments: [], notes: [] },
  { id: 'TKT-03', title: 'Billing question', requesterName: 'John Doe', status: 'Closed', priority: 'Low', createdAt: '2024-07-20', updatedAt: '2024-07-22', ownerId: 'EMP-03', assignees: [], rating: 5, paymentStatus: 'Fully Paid', depositAmount: 100, totalAmount: 500, subtotal: 500, discountAmount: 0, payments: [{id: 'PAY-01', date: '2024-07-21', amount: 500, type: 'Final Payment', invoiceId: 'INV-001'}], notes: [] },
];

export let mockProductCategories: ProductCategory[] = [
    { id: 'CAT-01', name: 'Plugin' },
    { id: 'CAT-02', name: 'Mod' },
    { id: 'CAT-03', name: 'Service' },
    { id: 'CAT-04', name: 'Software' },
];

export let mockProducts: Product[] = [
  { id: 'PROD-01', name: 'CoreProtect', sku: 'CP-001', categoryId: 'CAT-01', price: 19.99, description: 'Data logging and anti-griefing tool for Minecraft servers. Provides rollbacks and block logging.', image: 'https://i.imgur.com/s6m8k2x.png', stock: 150, tags: ['security', 'admin', 'logging'], createdAt: '2024-01-15' },
  { id: 'PROD-02', name: 'Advanced Clans', sku: 'AC-001', categoryId: 'CAT-01', price: 24.99, description: 'Ultimate clan management system with wars, banks, and alliances.', image: 'https://i.imgur.com/s6m8k2x.png', stock: 85, tags: ['gameplay', 'clans', 'pvp'], createdAt: '2024-02-20' },
  { id: 'PROD-03', name: 'Custom Setup', sku: 'SVC-CS-01', categoryId: 'CAT-03', price: 250, description: 'Full server setup service including plugin configuration and permissions setup.', image: 'https://i.imgur.com/s6m8k2x.png', stock: 8, tags: ['service', 'setup', 'premium'], createdAt: '2024-03-10' },
  { id: 'PROD-04', name: 'Studio Manager Pro', sku: 'SW-SMP-01', categoryId: 'CAT-04', price: 499, description: 'The very software you are using now. A professional dashboard for studio operations.', image: 'https://i.imgur.com/s6m8k2x.png', stock: 0, tags: ['software', 'business', 'management'], createdAt: '2024-04-01' },
  { id: 'PROD-05', name: 'Discord Integration Bot', sku: 'SVC-DB-01', categoryId: 'CAT-03', price: 75.50, description: 'A custom bot to link your server activity with Discord.', image: 'https://i.imgur.com/s6m8k2x.png', stock: 3, tags: ['service', 'discord', 'bot'], createdAt: '2024-05-18' },
];

export let mockInvoices: Invoice[] = [
  { id: 'INV-001', customer: 'QuantumLeap', amount: 500, status: 'Paid', invoiceDate: '2024-07-20', dueDate: '2024-08-20', ticketId: 'TKT-03', products: [{ productId: 'PROD-03', description: 'Custom Setup', quantity: 2, price: 250 }] },
  { id: 'INV-002', customer: 'Future Systems', amount: 24.99, status: 'Pending', invoiceDate: '2024-07-25', dueDate: '2024-08-25', ticketId: 'TKT-02', products: [{ productId: 'PROD-02', description: 'Advanced Clans', quantity: 1, price: 24.99 }] },
  { id: 'INV-003', customer: 'Innovate Inc.', amount: 19.99, status: 'Overdue', invoiceDate: '2024-06-15', dueDate: '2024-07-15', ticketId: 'TKT-04', products: [{ productId: 'PROD-01', description: 'CoreProtect', quantity: 1, price: 19.99 }] },
  { id: 'INV-004', customer: 'QuantumLeap', amount: 44.98, status: 'Paid', invoiceDate: '2024-05-10', dueDate: '2024-06-10', ticketId: 'TKT-05', products: [{ productId: 'PROD-01', description: 'CoreProtect', quantity: 1, price: 19.99 }, { productId: 'PROD-02', description: 'Advanced Clans', quantity: 1, price: 24.99 }] },
];

export let mockNotifications: Notification[] = [
    { id: 'NOTIF-01', title: 'New ticket assigned', message: 'Ticket #TKT-02 has been assigned to you.', read: false, timestamp: new Date().toISOString() },
    { id: 'NOTIF-02', title: 'Project Alpha is nearing its deadline', message: 'The project is due in 2 weeks.', read: true, timestamp: '2024-07-27T10:00:00Z' },
    { id: 'NOTIF-03', title: 'Invoice INV-003 is overdue', message: 'Please follow up with the client.', read: false, timestamp: '2024-07-28T14:00:00Z' },
];

export let mockEvents: Event[] = [
    { id: 'EVT-01', title: 'Q3 All-Hands Meeting', type: 'Internal', startDate: '2025-09-20T10:00:00', endDate: '2025-09-20T12:00:00', project: 'N/A', description: 'Company-wide update.', ownerId: 'EMP-01', participants: ['EMP-01', 'EMP-02', 'EMP-03'], status: 'Upcoming' },
    { id: 'EVT-02', title: 'Project Alpha Client Demo', type: 'Customer', startDate: '2025-09-25T14:00:00', endDate: '2025-09-25T15:00:00', project: 'Project Alpha', description: 'Final demo before launch.', ownerId: 'EMP-02', participants: ['EMP-01', 'EMP-02'], status: 'Upcoming' },
];

export let mockLicences: Licence[] = [
  { id: 'LIC-01', productId: 'PROD-01', customerId: 'CUST-01', key: 'CSM-AB12-CD34', startDate: '2024-01-01', expires: '2025-01-01', createdAt: '2024-01-01', status: 'Active', product: 'CoreProtect', customer: 'QuantumLeap' },
  { id: 'LIC-02', productId: 'PROD-02', customerId: 'CUST-02', key: 'CSM-EF56-GH78', startDate: '2023-07-01', expires: '2024-07-01', createdAt: '2023-07-01', status: 'Expired', product: 'Advanced Clans', customer: 'Future Systems' },
];

export let mockPlugins: Plugin[] = [];
export let mockGitRepositories: GitRepository[] = [];
export let mockLicenceActivity: LicenceActivity[] = [
    { id: 'LA-01', licenceId: 'LIC-01', action: 'Licence Created', details: 'Licence was generated and assigned to QuantumLeap.', actorId: 'system', timestamp: '2024-01-01T10:00:00Z' },
    { id: 'LA-02', licenceId: 'LIC-01', action: 'Activation Attempt', details: 'Licence activated on IP: 123.45.67.89', actorId: 'system', timestamp: '2024-01-02T12:00:00Z' },
];
export let mockRefundRequests: RefundRequest[] = [];


export const mockGoals: Goal[] = [
  // Alice (Manager) has a high-level KPI for her department
  {
    id: 'GOAL-01',
    employeeId: 'EMP-01',
    assignerId: null, // Top-level, self-driven or from upper management
    parentGoalId: null,
    title: 'Increase Q4 Design Department Efficiency by 15%',
    period: 'Q4 2024',
    // FIX: Changed type from 'KPI' to 'Objective' to match the Goal type definition.
    type: 'Objective',
    status: 'On Track',
    progress: 33,
    keyResults: [
      { id: 'KR-01-01', description: 'Reduce project design phase duration', currentValue: 5, targetValue: 15, unit: '%', targetDirection: 'decrease' },
      { id: 'KR-01-02', description: 'Achieve a 4.9-star average on design feedback', currentValue: 4.8, targetValue: 4.9, unit: 'stars' },
    ],
    checkIns: [],
  },
  // Alice assigns a sub-goal (KPI) to Bob to contribute to her main goal
  {
    id: 'GOAL-02',
    employeeId: 'EMP-02',
    assignerId: 'EMP-01',
    parentGoalId: 'GOAL-01',
    title: 'Streamline Dev-Design Handoff Process',
    period: 'Q4 2024',
    // FIX: Changed type from 'KPI' to 'Objective' to match the Goal type definition.
    type: 'Objective',
    status: 'On Track',
    progress: 50,
    keyResults: [
      { id: 'KR-02-01', description: 'Implement and document a shared component library', currentValue: 1, targetValue: 1, unit: 'library' },
      { id: 'KR-02-02', description: 'Reduce revision requests from dev team by 25%', currentValue: 10, targetValue: 25, unit: '%', targetDirection: 'decrease' },
    ],
    checkIns: [],
  },
  // Bob assigns a sub-goal (KPI) to Charlie
  {
    id: 'GOAL-03',
    employeeId: 'EMP-03',
    assignerId: 'EMP-02',
    parentGoalId: 'GOAL-02',
    title: 'Improve Customer Support Ticket Resolution Time',
    period: 'Q4 2024',
    // FIX: Changed type from 'KPI' to 'Objective' to match the Goal type definition.
    type: 'Objective',
    status: 'At Risk',
    progress: 80,
    keyResults: [
      { id: 'KR-03-01', description: 'Achieve an average ticket rating of 4.8 or higher', currentValue: 4.7, targetValue: 4.8, unit: 'stars' },
      { id: 'KR-03-02', description: 'Reduce first-response time to under 15 minutes', currentValue: 18, targetValue: 15, unit: 'minutes', targetDirection: 'decrease' },
    ],
    checkIns: [],
  },
  // Charlie's personal goal, not assigned by anyone
  {
    id: 'GOAL-04',
    employeeId: 'EMP-03',
    assignerId: null,
    parentGoalId: null,
    title: 'Master New Ticketing System Features',
    period: 'Q4 2024',
    type: 'Personal',
    status: 'On Track',
    progress: 67,
    keyResults: [
      { id: 'KR-04-01', description: 'Complete training module on advanced quoting', currentValue: 1, targetValue: 1, unit: 'module' },
      { id: 'KR-04-02', description: 'Utilize automated responses in 50 tickets', currentValue: 25, targetValue: 50, unit: 'tickets' },
    ],
    checkIns: [],
  },
    // Another KPI for Bob, from Alice
  {
    id: 'GOAL-05',
    employeeId: 'EMP-02',
    assignerId: 'EMP-01',
    parentGoalId: null, // Not directly linked to GOAL-01
    title: 'Maintain 99.9% Uptime for Core Services',
    period: 'Q4 2024',
    // FIX: Changed type from 'KPI' to 'Objective' to match the Goal type definition.
    type: 'Objective',
    status: 'On Track',
    progress: 99,
    keyResults: [
      { id: 'KR-05-01', description: 'Server uptime percentage', currentValue: 99.9, targetValue: 99.9, unit: '%' },
    ],
    checkIns: [],
  },
];


export let mockWorkflows: Workflow[] = [
    {
        id: 'WF-01',
        title: 'New Customer Onboarding',
        description: 'Guide for setting up a new customer from ticket to first invoice.',
        steps: [
            { id: 'WFS-01-01', title: 'Acknowledge Ticket', description: 'Go to the ticket and send an initial response to the customer.', actionText: 'Go to Tickets', actionLink: 'Tickets' },
            { id: 'WFS-01-02', title: 'Define Requirements', description: 'Use the Requirements feature to document the customer\'s needs.', actionText: 'Go to Tickets', actionLink: 'Tickets' },
            { id: 'WFS-01-03', title: 'Create Quote', description: 'Add products and line items to generate a quote.', actionText: 'Go to Tickets', actionLink: 'Tickets' },
            { id: 'WFS-01-04', title: 'Generate Invoice', description: 'Export the initial invoice for the deposit.', actionText: 'Go to Invoices', actionLink: 'Invoices' },
        ],
    },
    {
        id: 'WF-02',
        title: 'Product Refund Process',
        description: 'Step-by-step process for handling a customer refund request.',
        steps: [
            { id: 'WFS-02-01', title: 'Locate Purchase', description: 'Find the customer\'s original purchase in their profile.', actionText: 'Go to Customers', actionLink: 'Customers' },
            { id: 'WFS-02-02', title: 'Initiate Refund Request', description: 'From the ticket, create a refund request for the specified payment.', actionText: 'Go to Tickets', actionLink: 'Tickets' },
            { id: 'WFS-02-03', title: 'Notify Admin', description: 'Notify an admin that a refund request is pending approval.', actionText: 'Go to Employees', actionLink: 'Employees' },
            { id: 'WFS-02-04', title: 'Revoke Licence', description: 'If applicable, find and revoke the product licence.', actionText: 'Go to Licences', actionLink: 'Licences' },
        ],
    },
];