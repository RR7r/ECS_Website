import { useParams } from 'react-router-dom';
import ContentEditor from '@/components/dashboard/ContentEditor';

export default function DashboardContentEditor({ typeKey }) {
  const { id } = useParams();
  return <ContentEditor typeKey={typeKey} id={id} />;
}