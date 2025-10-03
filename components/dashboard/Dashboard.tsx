"use client";
import { useState } from 'react';
import { Header } from '../layouts/Header';
import { Footer } from '../layouts/Footer';
import  { EmployeeTable, Employee }  from './EmployeeTable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

interface DashboardProps {
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout: () => void;
}

const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    joinDate: '2023-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah.johnson@company.com',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'active',
    joinDate: '2023-03-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael.chen@company.com',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'Human Resources',
    position: 'HR Specialist',
    status: 'active',
    joinDate: '2022-11-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily.davis@company.com',
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david.martinez@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'inactive',
    joinDate: '2023-05-08',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david.martinez@company.com',
  },
  {
    id: '5',
    name: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    status: 'active',
    joinDate: '2023-07-12',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica.brown@company.com',
  },
];

export function Dashboard({ userName, userEmail, userAvatar, onLogout }: DashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const handleAddEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      avatar: employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email}`,
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleEditEmployee = (id: string, updatedEmployee: Omit<Employee, 'id'>) => {
    setEmployees(
      employees.map((emp) => (emp.id === id ? { ...updatedEmployee, id } : emp))
    );
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const activeEmployees = employees.filter((emp) => emp.status === 'active').length;
  const inactiveEmployees = employees.filter((emp) => emp.status === 'inactive').length;
  const totalEmployees = employees.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        userName={userName} 
        userEmail={userEmail}
        userAvatar={userAvatar}
        onLogout={onLogout} 
        onNavigateHome={() => {}} 
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2>Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Manage your employees and view key statistics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-primary">{totalEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-primary">{activeEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-primary">{inactiveEmployees}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-muted-foreground">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-primary">+2</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeTable
                employees={employees}
                onAddEmployee={handleAddEmployee}
                onEditEmployee={handleEditEmployee}
                onDeleteEmployee={handleDeleteEmployee}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}