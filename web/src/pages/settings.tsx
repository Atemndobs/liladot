import { MainLayout } from '@/layouts/main-layout';

const SettingsPage = () => (
  <MainLayout>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Settings content will go here.
        </p>
      </div>
    </div>
  </MainLayout>
);

export default SettingsPage;
