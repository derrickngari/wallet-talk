import React, { useEffect, useState } from "react";
import {
  getTransactionById,
  deleteTransaction,
  updateTrasnaction,
} from "../services/transactionService";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2Icon, Edit2Icon } from "lucide-react/dist/cjs/lucide-react";
import { toast } from "react-hot-toast";

const TransactionItem = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState("");
  const [isEditing, setIsediting] = useState(false);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleDelete = async (transId) => {
    if (user) {
      try {
        await deleteTransaction(transId, user.id);
        toast.success("Transaction deleted!");
        navigate("/dashboard");
      } catch (error) {
        console.log("Delete Error: ", error.message);
        toast.error("Error deleting transaction!");
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const updateData = {
      type,
      amount: parseFloat(amount),
      category,
      description,
    };

    if (user){
        try {
            await updateTrasnaction(id, user.id, updateData);
            toast.success("Transaction updated!");
            setTransaction({...transaction, ...updateData})
        } catch (error) {
            console.log("Edit Error: ", error.message);
            toast.error("Error editing transaction!");
        } finally{
            setIsediting(false);
        }
    }
  };

  useEffect(() => {
    if (user) {
      getTransactionById(id, user.id).then((res) => {
        setTransaction(res);
        setAmount(res.amount);
        setCategory(res.category);
        setDescription(res.description);
        setType(res.type);
      });
    }
  }, [user]);

  return (
    <div className="p-6 w-full text-white relative">
      {isEditing && (
        <div className=" top-0 left-0 w-full h-full bg-black/30 ">
          <form onSubmit={handleEdit} className="bg-black/30 border border-gray-500/40 text-white p-6 rounded-xl shadow-md space-y-4 my-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Edit Transaction
            </h2>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={type === "expense"}
                  onChange={(e) => setType(e.target.value)}
                />
                Expense
              </label>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={type === "income"}
                  onChange={(e) => setType(e.target.value)}
                />
                Income
              </label>
            </div>

            <input
              type="number"
              placeholder="Amount (e.g. 500)"
              className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Category (e.g. food, salary)"
              className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <textarea
              placeholder="Description (optional)"
              className="w-full text-gray-400 border border-gray-500/30 text-sm bg-gray-900 px-2 py-1 rounded outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
            >
              Edit Transaction
            </button>
          </form>
        </div>
      )}

      {!isEditing && (
        <div className="p-4 bg-black/30 border border-gray-500/40 text-white rounded-2xl shadow-md mt-4">
          <div>
            <div className="flex justify-between items-center text-sm mb-4">
              <p className="text-sm font-medium capitalize">
                {transaction.category}
              </p>
              <p
                className={`${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {transaction.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 sentence-cap">
                {transaction.description}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text font-semibold mt-4 ${
                  transaction.type == "income"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"} KES{" "}
                {transaction.amount}
              </p>
              {transaction.created_at && (
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(transaction.created_at).toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex justify-end mt-4 gap-6">
              <button onClick={() => handleDelete(transaction.id)}>
                <Trash2Icon
                  size={18}
                  className="cursor-pointer text-red-400 "
                />
              </button>
              <button onClick={()=> setIsediting(true)}>
                <Edit2Icon
                  size={18}
                  className="cursor-pointer text-purple-400"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
