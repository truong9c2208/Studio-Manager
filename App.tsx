import React, { useState, useEffect } from 'react';
import type { Employee } from './types';
import { mockEmployees } from './data/mockData';
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';

export const App: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('loggedInUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (employees.find(e => e.id === parsedUser.id)) {
                    setLoggedInUser(parsedUser);
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('loggedInUser');
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (email: string, password: string): { success: boolean, message: string } => {
        const user = employees.find(e => e.email.toLowerCase() === email.toLowerCase() && e.password === password);
        if (user) {
            setLoggedInUser(user);
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        localStorage.removeItem('loggedInUser');
    };

    const handleRegister = (name: string, email: string, password: string): { success: boolean, message: string } => {
        if (employees.some(e => e.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        const newUser: Employee = {
            id: `EMP-${Date.now()}`,
            name,
            email,
            password,
            role: 'New Hire',
            departmentId: '',
            status: 'Active',
            systemRole: 'User',
            phone: '',
            address: { street: '', city: '', state: '', zip: '' },
            kpi: { teamwork: 0, problemSolving: 0, communication: 0, punctuality: 0, qualityOfWork: 0 },
            customerRating: 0,
            peerRatings: [],
            customerFeedback: [],
            learningPaths: [],
            schedule: [],
            dailyScheduleChanges: {},
            revenueGenerated: 0,
            wallet: { balance: 0, transactions: [] },
            achievements: [],
            timeOffRequests: [],
            leaveBalances: { annual: 10, sick: 5, personal: 2 },
        };
        const updatedEmployees = [...employees, newUser];
        setEmployees(updatedEmployees); // In a real app, this would be an API call
        setLoggedInUser(newUser);
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        return { success: true, message: 'Registration successful!' };
    };

    const handleUpdateEmployees = (updatedEmployees: Employee[]) => {
      setEmployees(updatedEmployees);
      // If the currently logged-in user was updated, update localStorage and state
      const updatedLoggedInUser = updatedEmployees.find(e => e.id === loggedInUser?.id);
      if (updatedLoggedInUser) {
        setLoggedInUser(updatedLoggedInUser);
        localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));
      }
    };

    if (isLoading) {
        // You can return a loading spinner here
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!loggedInUser) {
        return (
            <AuthLayout 
                onLogin={handleLogin}
                onRegister={handleRegister}
            />
        );
    }
    
    return (
        <DashboardLayout 
            loggedInUser={loggedInUser}
            onLogout={handleLogout}
            allUsers={employees}
            onUpdateEmployees={handleUpdateEmployees}
        />
    );
};