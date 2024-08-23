import React, { useEffect, useState } from 'react';
import Layout from '../StaticComponents/layout';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path according to your project structure
import { createAccount } from '../../components/Services/accountService'; // Adjust the path according to your project structure

interface Invoice {
  name: string;
  createdOn: Date;
  email: string;
  age: number;
  phoneNumber: string;
  password: string;
  status: string;
  Role: string;
}

const InvoicesTable: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'StatusVerification'));
      const fetchedInvoices: Invoice[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedInvoices.push({
          name: data.name,
          createdOn: data.createdAt.toDate(), // Adjust for Date object
          email: data.email,
          age: data.age,
          phoneNumber: data.phoneNumber,
          password: data.password,
          Role: data.Role,
          status: data.status,
        });
      });

      setInvoices(fetchedInvoices);
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const invoiceRef = doc(db, 'StatusVerification', id);
    await updateDoc(invoiceRef, { status: newStatus });

    // If status is 'Approved', create a new account
    if (newStatus === 'Approved') {
      const invoice = invoices.find((inv) => inv.email === id);
      if (invoice) {
        await createAccount({
          email: invoice.email,
          password: invoice.password,
          name: invoice.name,
          phoneNumber: invoice.phoneNumber,
        });
      }
    }

    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.email === id ? { ...invoice, status: newStatus } : invoice
      )
    );
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const invoiceRef = doc(db, 'StatusVerification', id);
    await updateDoc(invoiceRef, { Role: newRole });
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.email === id ? { ...invoice, Role: newRole } : invoice
      )
    );
  };

  return (
    <Layout>
      <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
        <header className="bg-indigo-600 flex justify-between text-white p-4 rounded-md shadow-md">
          <h1 className="text-2xl font-bold">Employee Verification</h1>
        </header>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full text-xs">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col className="w-24" />
              <col className="w-32" />
            </colgroup>
            <thead className="dark:bg-gray-300">
              <tr className="text-left">
                <th className="p-3">Id</th>
                <th className="p-3">Name</th>
                <th className="p-3">Age</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone Number</th>
                <th className="p-3">Status</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((invoice, index) => (
                  <tr
                    key={index}
                    className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                  >
                    <td className="p-3">
                      <p>{index + 1}</p>
                    </td>
                    <td className="p-3">
                      <p>{invoice.name}</p>
                    </td>
                    <td className="p-3">
                      <p>{invoice.age}</p>
                    </td>
                    <td className="p-3">
                      <p className="dark:text-gray-600">{invoice.email}</p>
                    </td>
                    <td className="p-3">
                      <p>{invoice.phoneNumber}</p>
                    </td>
                    <td className="p-3">
                      <span className="px-3 py-1 font-semibold rounded-md dark:bg-violet-600 dark:text-gray-50">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={invoice.Role}
                        onChange={(e) => handleRoleChange(invoice.email, e.target.value)}
                        className="bg-gray-100 p-1 rounded"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Chef">Chef</option>
                        <option value="Waiter">Waiter</option>
                      </select>
                    </td>
                    <td className="p-3">
                      {invoice.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(invoice.email, 'Approved')}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(invoice.email, 'Rejected')}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            className=" text-white/80 bg-blue-500 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            {invoice.status}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-3 text-center">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default InvoicesTable;
