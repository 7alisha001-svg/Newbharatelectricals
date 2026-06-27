import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Home, ShoppingBag, Package } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderDetails = location.state as { orderId: string, total: number } | null;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <>
      <Helmet>
        <title>Order Success | New Bharat Electricals</title>
      </Helmet>
      
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-[80vh] flex items-center justify-center py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden"
        >
          <div className="bg-brand-green/5 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-brand-green/10">
              <Package size={160} />
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-brand-green text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/30 relative z-10"
            >
              <CheckCircle size={48} strokeWidth={2.5} />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-2 relative z-10">Order Confirmed!</h1>
            <p className="text-gray-600 max-w-md mx-auto relative z-10">
              Thank you for trusting New Bharat Electricals. Your order has been successfully placed.
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-inner mb-8">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-3 uppercase tracking-wider text-sm flex items-center">
                 <Package size={16} className="mr-2 text-brand-green" /> Order Details
              </h3>
              <div className="space-y-4 text-sm md:text-base">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Order Number</span>
                  <span className="font-black text-gray-900 bg-white px-3 py-1 rounded shadow-sm border border-gray-100">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Date</span>
                  <span className="font-bold text-gray-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Payment Status</span>
                  <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs uppercase tracking-wider">Success</span>
                </div>
                <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="font-black text-brand-green text-xl md:text-2xl">₹{orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/catalogue" 
                className="flex-1 flex items-center justify-center bg-brand-green text-white font-bold py-3.5 px-6 rounded-xl hover:bg-green-700 transition-all hover:shadow-lg hover:-translate-y-0.5 uppercase tracking-wide text-sm"
              >
                <ShoppingBag size={18} className="mr-2" /> Continue Shopping
              </Link>
              <Link 
                to="/" 
                className="flex-1 flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 px-6 rounded-xl hover:border-brand-green hover:text-brand-green transition-colors uppercase tracking-wide text-sm"
              >
                <Home size={18} className="mr-2" /> Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
