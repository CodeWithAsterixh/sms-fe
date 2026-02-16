import { useUsers } from "../../controllers/useUsers";
import { Loader } from "../components/ui/Loader";
import { formatDate } from "../../utils/formatDate";

const UsersPage = () => {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Error loading users</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Users</h1>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
