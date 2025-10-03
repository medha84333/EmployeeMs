"use client";
import { useState } from 'react';
import { Header } from '../layouts/Header';
import { Footer } from '../layouts/Footer';
import  { EmployeeTable, Employee }  from './EmployeeTable';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../../lib/helper';

interface DashboardProps {
  userName: string;
  userEmail?: string;
  userAvatar?: string;
  onLogout: () => void;
}

export function Dashboard({ userName, userEmail, userAvatar, onLogout }: DashboardProps) {
  // Initialize query client first (hooks must be called at the top level)
  const queryClient = useQueryClient();
  
  // Fetch employees using TanStack Query
  const { isLoading, isError, data, error } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: getUser,
  });

  // Transform the API data to match our Employee interface
  const employees: Employee[] = (data || []).map((user: any) => ({
    id: user._id || user.id,
    name: user.name || '',
    email: user.email || '',
    department: user.department || '',
    position: user.position || '',
    status: user.status || 'active',
    joinDate: user.date || user.joinDate || new Date().toISOString().split('T')[0],
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          userName={userName} 
          userEmail={userEmail}
          userAvatar={userAvatar}
          onLogout={onLogout} 
          onNavigateHome={() => {}} 
        />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div>Loading employees...</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          userName={userName} 
          userEmail={userEmail}
          userAvatar={userAvatar}
          onLogout={onLogout} 
          onNavigateHome={() => {}} 
        />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div>Error loading employees: {error?.message}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddEmployee = async (employee: Omit<Employee, 'id'>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: employee.name,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          status: employee.status,
          date: employee.joinDate,
          avatar: employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email}`,
        }),
      });
      
      if (response.ok) {
        // Invalidate and refetch the employees query
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployee = async (id: string, updatedEmployee: Omit<Employee, 'id'>) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          department: updatedEmployee.department,
          position: updatedEmployee.position,
          status: updatedEmployee.status,
          date: updatedEmployee.joinDate,
          avatar: updatedEmployee.avatar,
        }),
      });
      
      if (response.ok) {
        // Invalidate and refetch the employees query
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Invalidate and refetch the employees query
        queryClient.invalidateQueries({ queryKey: ['employees'] });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
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