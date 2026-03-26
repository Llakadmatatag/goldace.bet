import React from 'react';
import { Ticket } from 'lucide-react';

const RaffleManagement: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Ticket className="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">Raffle Management</h3>
      <p className="text-gray-500">Raffle management features coming soon...</p>
    </div>
  );
};

export default RaffleManagement;
