import DashboardLayout from '../components/DashboardLayout';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Admin Dashboard</h1>
        <p>System Overview</p>
        {/* User management and system setting will go here */}
      </div>
    </DashboardLayout>
  );
}
