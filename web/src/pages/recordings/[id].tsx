import { useParams } from 'react-router-dom';

import { MainLayout } from '@/layouts/main-layout';

const RecordingDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recording Details</h1>
        <p>Recording ID: {id}</p>
        {/* Add more details about the recording here */}
      </div>
    </MainLayout>
  );
};

export default RecordingDetailPage;
