import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Product, Invoice, Employee, Note, Project, Department, ProductCategory, Licence, Event, Notification, Plugin, GitRepository, LicenceActivity, RefundRequest, Ticket, PluginVersion, ProjectPage, Issue, PullRequest, Release, CodeFile, WalletTransaction, TimeOffRequest, Achievement, Course, Workflow, Task, Customer } from "../types";
import {
    mockEmployees, mockTickets, mockProjects, mockDepartments, mockProductCategories, mockProducts,
    mockLicences, mockEvents, mockNotifications, mockPlugins, mockGitRepositories, mockLicenceActivity,
    mockRefundRequests, mockInvoices, allAchievements, mockCourses, mockWorkflows
} from '../data/mockData';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- Helper to simulate network delay ---
const SIMULATED_DELAY = 300;
const simulateApiCall = <T>(data: () => T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data());
        }, SIMULATED_DELAY);
    });
};

// --- Gemini API ---
export const getProductPerformanceSummary = async (
  products: Product[],
  invoices: Invoice[]
): Promise<string> => {
  try {
    const salesData = products.map(product => {
        const sales = invoices
            .filter(i => i.status === 'Paid')
            .flatMap(i => i.products || [])
            .filter(p => p.productId === product.id)
            .reduce((sum, p) => sum + p.quantity, 0);
        
        const revenue = sales * product.price;

        return {
            name: product.name,
            sales,
            revenue,
            stock: product.stock,
        };
    }).sort((a,b) => b.revenue - a.revenue);

    const prompt = `
      Analyze the following product sales data and provide a concise summary of the overall performance.
      Highlight the top 3 best-selling products by revenue, mention any products that are underperforming (low sales),
      and point out any potential inventory issues (e.g., low stock for popular items).
      
      The response should be a brief paragraph.
      
      Data:
      ${JSON.stringify(salesData, null, 2)}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating product performance summary:", error);
    return "Could not generate summary due to an API error.";
  }
};

export const generateProjectPlan = async (
  projectDescription: string,
  teamSize: number,
  deadline: string
): Promise<Task[]> => {
    const prompt = `
      Act as an expert Project Manager. Your task is to generate a comprehensive project plan based on a user's description. The final deadline for the entire project is ${deadline}.

      First, identify the project domain (e.g., IT/Web Development, Marketing, Event Planning). Here are some example templates for different domains:
      - **IT/Web Development:** Discovery, UI/UX Design, Frontend Dev, Backend Dev, API Integration, QA Testing, Deployment, Post-launch support.
      - **Marketing Campaign:** Market Research, Strategy & Planning, Creative Development, Media Buying, Campaign Launch, Performance Tracking, Reporting.

      Based on the identified domain and the user's specific request, break down the project into a detailed list of tasks.
      Project Description: "${projectDescription}"
      Team Size: ${teamSize} members

      For each task, provide:
      - A unique ID in the format "TASK-XXXX".
      - A clear title.
      - A brief description.
      - A list of IDs of tasks that this task depends on (dependencies). The first tasks should have no dependencies.
      - Time estimates in days: optimisticDuration, mostLikelyDuration, and pessimisticDuration. Keep these durations realistic but ensure the total project timeline respects the deadline.
      - A suggested initial assignee role (e.g., "Developer", "Designer", "Project Manager").

      VERY IMPORTANT: The entire generated project plan must conclude on or before the project deadline of ${deadline}. The tasks must be logically sequenced. Adjust task durations and dependencies as needed to ensure all work is completed within this timeframe. The end date of the very last task in the plan MUST NOT be later than the project deadline.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tasks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: 'A unique ID for the task, e.g., TASK-101' },
                                    title: { type: Type.STRING, description: 'A concise title for the task.' },
                                    description: { type: Type.STRING, description: 'A brief description of what the task entails.' },
                                    dependencies: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: 'An array of task IDs that this task depends on.'
                                    },
                                    optimisticDuration: { type: Type.NUMBER, description: 'Best-case time estimate in days.' },
                                    mostLikelyDuration: { type: Type.NUMBER, description: 'Most likely time estimate in days.' },
                                    pessimisticDuration: { type: Type.NUMBER, description: 'Worst-case time estimate in days.' },
                                    assignee: { type: Type.STRING, description: 'A suggested role for the assignee, e.g., Developer, Designer.' }
                                },
                                required: ['id', 'title', 'description', 'dependencies', 'optimisticDuration', 'mostLikelyDuration', 'pessimisticDuration', 'assignee']
                            }
                        }
                    },
                    required: ['tasks']
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        
        const tasks: Task[] = jsonResponse.tasks.map((task: any) => {
            const { assignee, ...rest } = task;
            return {
                ...rest,
                suggestedRole: assignee,
                // Status and dates will be set programmatically later
                status: 'To Do',
                priority: 'Medium',
            };
        });
        
        return tasks;

    } catch (error) {
        console.error("Error generating project plan:", error);
        // Return a single error task to show in the UI
        return [
            {
                id: 'TASK-ERROR',
                title: 'Error Generating Plan',
                description: 'The AI assistant could not generate a project plan. Please try again or create tasks manually.',
                status: 'To Do',
                priority: 'High',
            }
        ];
    }
};

export const getCustomerAnalysis = async (
  customer: Customer,
  invoices: Invoice[],
  tickets: Ticket[]
): Promise<string> => {
  try {
    const purchaseHistory = invoices
        .filter(i => i.customer === customer.company && i.status === 'Paid')
        .map(i => ({ amount: i.amount, date: i.invoiceDate, items: i.products?.length || 1 }));

    const ticketSubjects = tickets
        .filter(t => t.requesterName === customer.name)
        .map(t => ({ subject: t.title, priority: t.priority, rating: t.rating || 'N/A' }));

    const prompt = `
      Analyze the following customer data for a game development studio and generate a concise persona analysis.
      The analysis should be a single paragraph, written in a professional and insightful tone.

      Customer Name: ${customer.name}
      Company: ${customer.company}
      Location: ${customer.address ? `${customer.address.city}, ${customer.address.state}` : 'Not provided'}

      Purchase History (${purchaseHistory.length} paid invoices):
      ${JSON.stringify(purchaseHistory, null, 2)}

      Support Ticket History (${ticketSubjects.length} tickets):
      ${JSON.stringify(ticketSubjects, null, 2)}

      Based on this data, provide a summary covering:
      1.  **Customer Persona**: Briefly describe the type of customer (e.g., high-value, frequent small purchases, high-maintenance, etc.). Consider their location if available.
      2.  **Spending Habits**: Comment on their purchasing frequency and value.
      3.  **Satisfaction & Needs**: Infer their satisfaction level from ticket ratings and subjects. What kind of products/services do they seem to be interested in?
      4.  **Upsell Opportunity**: Suggest one specific, actionable upsell opportunity (e.g., "Could be a good candidate for a premium support subscription," or "Might be interested in custom development services.").
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating customer analysis:", error);
    return "Could not generate analysis due to an API error. Please check the console for details.";
  }
};


// --- MOCK API SERVICES ---

// Employees
export const getEmployees = () => simulateApiCall(() => [...mockEmployees]);
export const saveEmployee = (employee: Employee) => simulateApiCall(() => {
    const index = mockEmployees.findIndex(e => e.id === employee.id);
    if (index > -1) {
        mockEmployees[index] = employee;
    } else {
        mockEmployees.push(employee);
    }
    return employee;
});

// Wallet & Achievements
export const requestWithdrawal = (employeeId: string, amount: number, method: string) => simulateApiCall(() => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (employee && employee.wallet.balance >= amount) {
        employee.wallet.balance -= amount;
        employee.wallet.transactions.push({
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString(),
            description: `Withdrawal request to ${method}`,
            amount: -amount,
            type: 'withdrawal',
        });
    }
    return employee;
});

export const redeemReward = (employeeId: string, rewardId: string, cost: number) => simulateApiCall(() => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (employee && employee.wallet.balance >= cost) {
        employee.wallet.balance -= cost;
        employee.wallet.transactions.push({
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString(),
            description: `Redeemed: ${rewardId}`,
            amount: -cost,
            type: 'redemption',
        });
    }
    return employee;
});

export const addTransaction = (employeeId: string, transaction: Omit<WalletTransaction, 'id' | 'date'>) => simulateApiCall(() => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (employee) {
        employee.wallet.balance += transaction.amount;
        employee.wallet.transactions.push({
            ...transaction,
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString(),
        });
    }
    return employee;
});

export const awardAchievement = (employeeId: string, achievementId: string) => simulateApiCall(() => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    const achievement = allAchievements.find(a => a.id === achievementId);

    if (employee && achievement) {
        // Prevent duplicate achievements
        if (!employee.achievements.some(a => a.achievementId === achievementId)) {
            employee.achievements.push({
                achievementId: achievementId,
                dateAwarded: new Date().toISOString().split('T')[0],
            });
        }
    }
    return employee;
});

export const saveTimeOffRequest = (employeeId: string, request: Omit<TimeOffRequest, 'id' | 'status'>) => simulateApiCall(() => {
    const employee = mockEmployees.find(e => e.id === employeeId);
    if (!employee) return { success: false, message: "Employee not found." };

    const requestMonth = new Date(request.startDate).getMonth();
    const requestYear = new Date(request.startDate).getFullYear();

    if (request.type === 'Vacation') {
        const vacationDaysThisMonth = employee.timeOffRequests
            .filter(r => {
                const rDate = new Date(r.startDate);
                // Check for pending or approved requests
                return r.type === 'Vacation' && (r.status === 'Pending' || r.status === 'Approved') && rDate.getMonth() === requestMonth && rDate.getFullYear() === requestYear;
            })
            .length;

        if (vacationDaysThisMonth >= 3) {
            console.warn(`Request denied: ${employee.name} has already used their 3 vacation days for this month.`);
            alert("Request denied: Monthly vacation limit of 3 days reached.");
            return { success: false, message: "Monthly vacation limit reached." };
        }
    }

    const newRequest: TimeOffRequest = {
        ...request,
        id: `TOR-${Date.now()}`,
        status: 'Pending',
    };
    employee.timeOffRequests.push(newRequest);
    return { success: true };
});


// Tickets
export const getTickets = () => simulateApiCall(() => [...mockTickets]);
export const updateTicket = (ticket: Ticket) => simulateApiCall(() => {
    const index = mockTickets.findIndex(t => t.id === ticket.id);
    const originalTicket = index > -1 ? { ...mockTickets[index] } : null;

    if (index > -1) {
        mockTickets[index] = { ...ticket, updatedAt: new Date().toISOString() };
    }

    // Check for referral commission logic
    if (originalTicket && originalTicket.paymentStatus !== 'Fully Paid' && ticket.paymentStatus === 'Fully Paid' && ticket.referralCode) {
        const referrer = mockEmployees.find(e => e.referralCode?.toUpperCase() === ticket.referralCode?.toUpperCase());
        if (referrer) {
            const commissionAmount = ticket.totalAmount * 0.05; // 5% commission
            const transactionDescription = `Commission from Ticket #${ticket.id.split('-')[1]}`;

            // Prevent duplicate commissions
            const alreadyPaid = referrer.wallet.transactions.some(t => t.description === transactionDescription);

            if (!alreadyPaid && commissionAmount > 0) {
                // This will be resolved in the same "tick" but we call it for consistency
                addTransaction(referrer.id, {
                    description: transactionDescription,
                    amount: commissionAmount,
                    type: 'commission',
                });
            }
        }
    }
    return ticket;
});
export const addNoteToTicket = (ticketId: string, note: Omit<Note, 'id'>, currentUserId: string) => simulateApiCall(() => {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
        const newNote = { ...note, id: `NOTE-${Date.now()}`, authorId: currentUserId };
        ticket.notes = [...(ticket.notes || []), newNote];
    }
    return ticket;
});
export const processPaymentForTicket = (ticketId: string, amount: number, type: 'Deposit' | 'Final Payment') => simulateApiCall(() => {
    const ticket = mockTickets.find(t => t.id === ticketId);
    if (ticket) {
        const newPayment = { id: `PAY-${Date.now()}`, date: new Date().toISOString(), amount, type, invoiceId: `INV-${ticketId}` };
        ticket.payments = [...ticket.payments, newPayment];
        const totalPaid = ticket.payments.reduce((sum, p) => sum + p.amount, 0);

        if (totalPaid >= ticket.totalAmount) ticket.paymentStatus = 'Fully Paid';
        else if (totalPaid > 0) ticket.paymentStatus = 'Deposit Paid';
    }
    return ticket;
});

// Projects
export const getProjects = () => simulateApiCall(() => [...mockProjects]);
export const createProject = (project: Project) => simulateApiCall(() => {
    mockProjects.push(project);
    return project;
});
export const updateProject = (project: Project) => simulateApiCall(() => {
    const index = mockProjects.findIndex(p => p.id === project.id);
    if (index > -1) {
        mockProjects[index] = project;
    }
    return project;
});

// Departments
export const getDepartments = () => simulateApiCall(() => [...mockDepartments]);
export const saveDepartment = (department: Department) => simulateApiCall(() => {
    const index = mockDepartments.findIndex(d => d.id === department.id);
    if (index > -1) {
        mockDepartments[index] = department;
    } else {
        mockDepartments.push(department);
    }
    return department;
});
export const deleteDepartment = (departmentId: string) => simulateApiCall(() => {
    const index = mockDepartments.findIndex(d => d.id === departmentId);
    if (index > -1) {
        mockDepartments.splice(index, 1);
    }
    // Unassign employees
    mockEmployees.forEach(emp => {
        if (emp.departmentId === departmentId) {
            emp.departmentId = '';
        }
    });
    return { success: true };
});

// Products & Categories
export const getProducts = () => simulateApiCall(() => [...mockProducts]);
export const saveProduct = (product: Product) => simulateApiCall(() => {
    const index = mockProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
        mockProducts[index] = product;
    } else {
        mockProducts.push(product);
    }
    return product;
});
export const deleteProducts = (productIds: string[]) => simulateApiCall(() => {
    for (let i = mockProducts.length - 1; i >= 0; i--) {
        if (productIds.includes(mockProducts[i].id)) {
            mockProducts.splice(i, 1);
        }
    }
    return { success: true };
});
export const getProductCategories = () => simulateApiCall(() => [...mockProductCategories]);
export const saveProductCategory = (category: ProductCategory) => simulateApiCall(() => {
    const index = mockProductCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
        mockProductCategories[index] = category;
    } else {
        mockProductCategories.push(category);
    }
    return category;
});
export const deleteProductCategory = (categoryId: string) => simulateApiCall(() => {
    const index = mockProductCategories.findIndex(c => c.id === categoryId);
    if (index > -1) {
        mockProductCategories.splice(index, 1);
    }
    return { success: true };
});

// Licences
export const getLicences = () => simulateApiCall(() => [...mockLicences]);
export const saveLicence = (licence: Licence) => simulateApiCall(() => {
    const index = mockLicences.findIndex(l => l.id === licence.id);
    if (index > -1) {
        mockLicences[index] = licence;
    } else {
        mockLicences.push(licence);
    }
    return licence;
});
export const deleteLicence = (licenceId: string) => simulateApiCall(() => {
    const index = mockLicences.findIndex(l => l.id === licenceId);
    if (index > -1) {
        mockLicences.splice(index, 1);
    }
    return { success: true };
});
export const bulkUpdateLicenceStatus = (licenceIds: string[], status: 'Revoked' | 'Active') => simulateApiCall(() => {
    mockLicences.forEach(lic => {
        if (licenceIds.includes(lic.id)) {
            lic.status = status;
        }
    });
    return { success: true };
});

// Events
export const getEvents = () => simulateApiCall(() => [...mockEvents]);
export const saveEvent = (event: Event) => simulateApiCall(() => {
    const index = mockEvents.findIndex(e => e.id === event.id);
    if (index > -1) {
        mockEvents[index] = event;
    } else {
        mockEvents.push(event);
    }
    return event;
});
export const deleteEvent = (eventId: string) => simulateApiCall(() => {
    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index > -1) {
        mockEvents.splice(index, 1);
    }
    return { success: true };
});

// Notifications
export const getNotifications = () => simulateApiCall(() => [...mockNotifications]);
export const markNotificationAsRead = (notificationId: string) => simulateApiCall(() => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
    }
    return notification;
});
export const markAllNotificationsAsRead = () => simulateApiCall(() => {
    mockNotifications.forEach(n => n.read = true);
    return [...mockNotifications];
});

// Invoices
export const getInvoices = () => simulateApiCall(() => [...mockInvoices]);
export const updateInvoice = (invoice: Invoice) => simulateApiCall(() => {
    const index = mockInvoices.findIndex(i => i.id === invoice.id);
    if (index > -1) {
        mockInvoices[index] = invoice;
    }
    return invoice;
});

// Refund Requests
export const getRefundRequests = () => simulateApiCall(() => [...mockRefundRequests]);
export const addRefundRequest = (request: Omit<RefundRequest, 'id' | 'createdAt' | 'status'>) => simulateApiCall(() => {
    const newRequest: RefundRequest = {
        ...request,
        id: `REF-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Pending',
    };
    mockRefundRequests.push(newRequest);
    // Also update the related ticket
    const ticket = mockTickets.find(t => t.id === request.ticketId);
    if (ticket) {
        ticket.paymentStatus = 'Refund Requested';
    }
    return newRequest;
});


// Resources (Plugins, Git Repos)
export const getPlugins = () => simulateApiCall(() => [...mockPlugins]);
export const savePlugin = (plugin: Plugin) => simulateApiCall(() => {
    const index = mockPlugins.findIndex(p => p.id === plugin.id);
    if (index > -1) {
        mockPlugins[index] = plugin;
    } else {
        mockPlugins.push(plugin);
    }
    return plugin;
});
export const deletePlugin = (pluginId: string) => simulateApiCall(() => {
    const index = mockPlugins.findIndex(p => p.id === pluginId);
    if (index > -1) mockPlugins.splice(index, 1);
    return { success: true };
});
export const addPluginVersion = (pluginId: string, version: PluginVersion) => simulateApiCall(() => {
    const plugin = mockPlugins.find(p => p.id === pluginId);
    if (plugin) {
        plugin.versions.unshift(version); // Add to the beginning
    }
    return plugin;
});
export const updatePluginWiki = (pluginId: string, pages: ProjectPage[]) => simulateApiCall(() => {
    const plugin = mockPlugins.find(p => p.id === pluginId);
    if (plugin) plugin.wikiPages = pages;
    return plugin;
});

export const getGitRepositories = () => simulateApiCall(() => [...mockGitRepositories]);
export const saveRepo = (repo: GitRepository) => simulateApiCall(() => {
    const index = mockGitRepositories.findIndex(r => r.id === repo.id);
    if (index > -1) {
        mockGitRepositories[index] = repo;
    } else {
        mockGitRepositories.push(repo);
    }
    return repo;
});
export const deleteRepo = (repoId: string) => simulateApiCall(() => {
    const index = mockGitRepositories.findIndex(r => r.id === repoId);
    if (index > -1) mockGitRepositories.splice(index, 1);
    return { success: true };
});
export const updateRepoWiki = (repoId: string, pages: ProjectPage[]) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo) repo.wikiPages = pages;
    return repo;
});
export const saveIssue = (repoId: string, issue: Issue) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo) {
        const index = repo.issues.findIndex(i => i.id === issue.id);
        if (index > -1) repo.issues[index] = issue;
        else repo.issues.push(issue);
    }
    return repo;
});
export const savePullRequest = (repoId: string, pr: PullRequest) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo) {
        const index = repo.pullRequests.findIndex(p => p.id === pr.id);
        if (index > -1) repo.pullRequests[index] = pr;
        else repo.pullRequests.push(pr);
    }
    return repo;
});
export const saveRelease = (repoId: string, release: Release) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === release.id);
    if (repo) {
        const index = repo.releases.findIndex(r => r.id === release.id);
        if (index > -1) repo.releases[index] = release;
        else repo.releases.push(release);
    }
    return repo;
});
export const uploadFileToRepo = (repoId: string, branchName: string, newFile: CodeFile) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && repo.files[branchName]) {
        repo.files[branchName].push(newFile);
    }
    return repo;
});
export const renameFileInRepo = (repoId: string, branchName: string, oldName: string, newName: string) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && repo.files[branchName]) {
        const file = repo.files[branchName].find(f => f.name === oldName);
        if (file) file.name = newName;
    }
    return repo;
});
export const deleteFileInRepo = (repoId: string, branchName: string, fileName: string) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && repo.files[branchName]) {
        const index = repo.files[branchName].findIndex(f => f.name === fileName);
        if (index > -1) repo.files[branchName].splice(index, 1);
    }
    return repo;
});
export const createBranchInRepo = (repoId: string, newBranchName: string, fromBranchName: string) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && repo.files[fromBranchName] && !repo.branches.includes(newBranchName)) {
        repo.files[newBranchName] = [...repo.files[fromBranchName]];
        repo.branches.push(newBranchName);
    }
    return repo;
});
export const renameBranchInRepo = (repoId: string, oldBranchName: string, newBranchName: string) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && repo.files[oldBranchName] && !repo.branches.includes(newBranchName)) {
        repo.files[newBranchName] = repo.files[oldBranchName];
        delete repo.files[oldBranchName];
        const branchIndex = repo.branches.indexOf(oldBranchName);
        if (branchIndex > -1) repo.branches[branchIndex] = newBranchName;
        if (repo.defaultBranch === oldBranchName) repo.defaultBranch = newBranchName;
    }
    return repo;
});
export const deleteBranchInRepo = (repoId: string, branchNameToDelete: string) => simulateApiCall(() => {
    const repo = mockGitRepositories.find(r => r.id === repoId);
    if (repo && branchNameToDelete !== repo.defaultBranch) {
        delete repo.files[branchNameToDelete];
        const branchIndex = repo.branches.indexOf(branchNameToDelete);
        if (branchIndex > -1) repo.branches.splice(branchIndex, 1);
    }
    return repo;
});

export const getLicenceActivity = () => simulateApiCall(() => [...mockLicenceActivity]);

// Learning & Workflows
export const getCourses = () => simulateApiCall(() => [...mockCourses]);
export const saveCourse = (course: Course) => simulateApiCall(() => {
    const index = mockCourses.findIndex(c => c.id === course.id);
    if (index > -1) {
        mockCourses[index] = course;
    } else {
        mockCourses.push(course);
    }
    return course;
});
export const deleteCourse = (courseId: string) => simulateApiCall(() => {
    const index = mockCourses.findIndex(c => c.id === courseId);
    if (index > -1) mockCourses.splice(index, 1);
    // Also remove assignments from employees
    mockEmployees.forEach(emp => {
        emp.learningPaths = emp.learningPaths.filter(lp => lp.courseId !== courseId);
    });
    return { success: true };
});

export const getWorkflows = () => simulateApiCall(() => [...mockWorkflows]);
export const saveWorkflow = (workflow: Workflow) => simulateApiCall(() => {
    const index = mockWorkflows.findIndex(w => w.id === workflow.id);
    if (index > -1) {
        mockWorkflows[index] = workflow;
    } else {
        mockWorkflows.push(workflow);
    }
    return workflow;
});
export const deleteWorkflow = (workflowId: string) => simulateApiCall(() => {
    const index = mockWorkflows.findIndex(w => w.id === workflowId);
    if (index > -1) mockWorkflows.splice(index, 1);
    return { success: true };
});