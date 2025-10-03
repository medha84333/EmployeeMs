// import { useState } from 'react';
// import { Pencil, Trash2, Plus, Search } from 'lucide-react';
// import { Button } from '../ui/Button';
// import { Input } from '../ui/Input';
// import { getUser } from '../../lib/helper';
// import { useQuery } from '@tanstack/react-query';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '../ui/table';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '../ui/dialog';
// import { Label } from '../ui/Label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select';
// import { Badge } from '../ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

// export interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   position: string;
//   status: 'active' | 'inactive';
//   joinDate: string;
//   avatar?: string;
// }

// interface EmployeeTableProps {
//   employees: Employee[];
//   onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
//   onEditEmployee: (id: string, employee: Omit<Employee, 'id'>) => void;
//   onDeleteEmployee: (id: string) => void;
// }

// export function EmployeeTable({
//   employees,
//   onAddEmployee,
//   onEditEmployee,
//   onDeleteEmployee,
// }: EmployeeTableProps) {

//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     department: '',
//     position: '',
//     status: 'active' as 'active' | 'inactive',
//     joinDate: new Date().toISOString().split('T')[0],
//     avatar: '',
//   });

//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.position.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleOpenDialog = (employee?: Employee) => {
//     if (employee) {
//       setEditingEmployee(employee);
//       setFormData({
//         name: employee.name,
//         email: employee.email,
//         department: employee.department,
//         position: employee.position,
//         status: employee.status,
//         joinDate: employee.joinDate,
//         avatar: employee.avatar || '',
//       });
//     } else {
//       setEditingEmployee(null);
//       setFormData({
//         name: '',
//         email: '',
//         department: '',
//         position: '',
//         status: 'active',
//         joinDate: new Date().toISOString().split('T')[0],
//         avatar: '',
//       });
//     }
//     setIsDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setIsDialogOpen(false);
//     setEditingEmployee(null);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingEmployee) {
//       onEditEmployee(editingEmployee.id, formData);
//     } else {
//       onAddEmployee(formData);
//     }
//     handleCloseDialog();
//   };

//    /**for log display data ***/
//   // console.log(getUser());
//    //getUser().then(res => console.log(res));

//   const {isLoading, isError, data, error} = useQuery(['user'], getUser);

//   if(isLoading) return <div>Loading...</div>
//   if(isError) return <div>got error {error.message}</div>

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="text"
//             placeholder="Search employees..."
//             value={searchTerm}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//             className="pl-9 bg-input-background"
//           />
//         </div>
//         <Button onClick={() => handleOpenDialog()}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Employee
//         </Button>
//       </div>

//       <div className="border rounded-lg overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Employee</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Department</TableHead>
//               <TableHead>Position</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Join Date</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredEmployees.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} className="text-center text-muted-foreground">
//                   No employees found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredEmployees.map((employee) => (
//                 <TableRow key={employee.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-9 w-9">
//                         <AvatarImage src={employee.avatar} alt={employee.name} />
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           {employee.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span>{employee.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>{employee.email}</TableCell>
//                   <TableCell>{employee.department}</TableCell>
//                   <TableCell>{employee.position}</TableCell>
//                   <TableCell>
//                     <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
//                       {employee.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{employee.joinDate}</TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleOpenDialog(employee)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => onDeleteEmployee(employee.id)}
//                       >
//                         <Trash2 className="h-4 w-4 text-destructive" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[525px]">
//           <form onSubmit={handleSubmit}>
//             <DialogHeader>
//               <DialogTitle>
//                 {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingEmployee
//                   ? 'Update the employee information below.'
//                   : 'Enter the details of the new employee.'}
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="department">Department</Label>
//                 <Input
//                   id="department"
//                   value={formData.department}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, department: e.target.value })}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="position">Position</Label>
//                 <Input
//                   id="position"
//                   value={formData.position}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, position: e.target.value })}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={formData.status}
//                   onValueChange={(value: 'active' | 'inactive') =>
//                     setFormData({ ...formData, status: value })
//                   }
//                 >
//                   <SelectTrigger id="status">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="joinDate">Join Date</Label>
//                 <Input
//                   id="joinDate"
//                   type="date"
//                   value={formData.joinDate}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, joinDate: e.target.value })}
//                   required
//                   className="bg-input-background"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={handleCloseDialog}>
//                 Cancel
//               </Button>
//               <Button type="submit">{editingEmployee ? 'Save Changes' : 'Add Employee'}</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import { useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getUser } from '../../lib/helper'; // Assuming this fetches the list of employees
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

// Define the API response type to match MongoDB schema
interface APIUser {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  date: string;
  avatar?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar?: string;
}

// In a real app, this data would likely come from the useQuery hook and not be a prop.
interface EmployeeTableProps {
  // We'll update this to handle TanStack Query logic directly inside the component.
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void;
  onEditEmployee: (id: string, employee: Omit<Employee, 'id'>) => void;
  onDeleteEmployee: (id: string) => void;
}

export function EmployeeTable({
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    status: 'active' as 'active' | 'inactive',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: '',
  });

  // Fetch employees using TanStack Query
  const { isLoading, isError, data, error } = useQuery<APIUser[], Error>({
    queryKey: ['employees'],
    queryFn: getUser,
  });

  // Transform API data to match Employee interface (MongoDB schema uses _id, date instead of id, joinDate)
  const employees: Employee[] = (data || []).map((user: APIUser) => ({
    id: user._id,
    name: user.name || '',
    email: user.email || '',
    department: user.department || '',
    position: user.position || '',
    status: user.status || 'active',
    joinDate: user.date || new Date().toISOString().split('T')[0],
    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
  }));

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        status: employee.status,
        joinDate: employee.joinDate,
        avatar: employee.avatar || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      onEditEmployee(editingEmployee.id, formData);
    } else {
      onAddEmployee(formData);
    }
    handleCloseDialog();
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Got an error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-9 bg-input-background"
          />
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {employee.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
              <DialogDescription>
                {editingEmployee
                  ? 'Update the employee information below.'
                  : 'Enter the details of the new employee.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-input-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-input-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                  className="bg-input-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                  className="bg-input-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as 'active' | 'inactive',
                    })
                  }
                >
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, joinDate: e.target.value })
                  }
                  required
                  className="bg-input-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="bg-input-background"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEmployee ? 'Save Changes' : 'Add Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}