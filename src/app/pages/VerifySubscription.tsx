import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function VerifySubscription() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  
  const reference = searchParams.get("reference");
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setErrorMessage("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.verifySubscription(reference);
        if (res.success) {
          setStatus('success');
          // Update global user state
          updateUser({
            subscription_plan: 'enterprise',
            subscription_status: 'active'
          });
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(res.message || "Payment verification failed.");
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || "An error occurred during verification.");
      }
    };

    verifyPayment();
  }, [reference, navigate, updateUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
      >
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Verifying Payment...</h2>
            <p className="text-gray-500">Please wait while we confirm your subscription.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Enterprise!</h2>
            <p className="text-gray-500">Your subscription has been successfully activated.</p>
            <p className="text-sm text-emerald-600 font-medium animate-pulse">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-red-500">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Return to Pricing
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
