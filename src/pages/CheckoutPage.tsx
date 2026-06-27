import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, ShieldCheck, Lock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    
    try {
      const { error: dbError } = await supabase
        .from('orders')
        .insert([{ 
          order_id: orderId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          payment_method: formData.paymentMethod,
          total_amount: cartTotal,
          cart_items: cart
        }]);

      if (dbError) throw dbError;
      
      clearCart();
      navigate('/order-success', { state: { orderId, total: cartTotal } });
    } catch (err: any) {
      console.error('Error submitting order:', err);
      setError('There was a problem placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border border-gray-100">
           <ShoppingCart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold font-heading mb-4 text-gray-900">Your Checkout is Empty</h2>
        <Link to="/catalogue" className="text-white bg-brand-green px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors uppercase tracking-wide text-sm shadow-md">Return to Shop</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | New Bharat Electricals</title>
      </Helmet>
      
      <div className="bg-gray-50/50 min-h-screen py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center text-sm text-gray-500 mb-10 font-bold uppercase tracking-wider">
             <Link to="/cart" className="hover:text-brand-green transition-colors">Cart</Link>
             <span className="mx-3 text-gray-300">/</span>
             <span className="text-gray-900">Checkout</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:w-2/3 space-y-8"
            >
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-heading font-extrabold text-gray-900 mb-8 flex items-center tracking-tight">
                  <span className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-sm mr-4 font-black">1</span>
                  Customer Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-heading font-extrabold text-gray-900 mb-8 flex items-center tracking-tight">
                  <span className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-sm mr-4 font-black">2</span>
                  Shipping Address
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address <span className="text-red-500">*</span></label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" placeholder="House number and street name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Town / City <span className="text-red-500">*</span></label>
                      <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                      <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code <span className="text-red-500">*</span></label>
                      <input required type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl md:text-2xl font-heading font-extrabold text-gray-900 mb-8 flex items-center tracking-tight">
                  <span className="w-8 h-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-sm mr-4 font-black">3</span>
                  Payment Gateway
                </h2>
                
                <div className="space-y-4">
                  <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all ${formData.paymentMethod === 'upi' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.paymentMethod === 'upi' ? 'border-brand-green' : 'border-gray-300'}`}>
                         {formData.paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-brand-green rounded-full"></div>}
                      </div>
                      <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="hidden" />
                      <span className="font-bold text-gray-900 flex-1">Razorpay / UPI / PhonePe</span>
                      <div className="flex gap-2 flex-shrink-0">
                        {/* Mock icons */}
                        <div className="w-10 h-6 bg-blue-50 border border-blue-100 rounded text-[9px] flex items-center justify-center font-bold text-blue-800">UPI</div>
                        <div className="w-14 h-6 bg-indigo-50 border border-indigo-100 rounded text-[9px] flex items-center justify-center font-bold text-indigo-800">Razorpay</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.paymentMethod === 'card' ? 'border-brand-green' : 'border-gray-300'}`}>
                         {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-brand-green rounded-full"></div>}
                      </div>
                      <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                      <span className="font-bold text-gray-900 flex-1">Credit / Debit Card (Stripe)</span>
                      <div className="flex gap-2 flex-shrink-0">
                         <div className="w-10 h-6 bg-gray-50 border border-gray-200 rounded text-[9px] flex items-center justify-center font-bold text-gray-800">VISA</div>
                         <div className="w-10 h-6 bg-gray-50 border border-gray-200 rounded text-[9px] flex items-center justify-center font-bold text-gray-800">MC</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`block border-2 rounded-2xl p-5 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-brand-green bg-brand-green/5 shadow-sm' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.paymentMethod === 'cod' ? 'border-brand-green' : 'border-gray-300'}`}>
                         {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-brand-green rounded-full"></div>}
                      </div>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="hidden" />
                      <span className="font-bold text-gray-900">Cash on Delivery</span>
                    </div>
                  </label>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center text-sm font-medium text-gray-500">
                   <Lock size={16} className="mr-2 text-green-600" />
                   100% Secure Payment processing verified by Norton & McAfee.
                </div>
              </div>
              
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-1/3"
            >
              <div className="bg-white border text-gray-900 border-gray-100 rounded-3xl p-8 sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-xl font-heading font-extrabold mb-6 pb-4 border-b border-gray-100 tracking-tight">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 bg-center bg-contain bg-no-repeat flex-shrink-0" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                      <div className="flex-1 py-1">
                        <h4 className="font-bold text-sm leading-tight text-gray-900 line-clamp-2 group-hover:text-brand-green transition-colors">{item.name}</h4>
                        <div className="text-gray-500 text-sm mt-2 font-medium">Qty: <span className="text-gray-900">{item.quantity}</span></div>
                      </div>
                      <div className="font-black text-sm py-1">₹{(parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-6 pb-4 space-y-4 text-sm md:text-base">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium border-b border-gray-100 pb-6">
                    <span>Shipping</span>
                    <span className="font-bold text-brand-green bg-green-50 px-2 py-1 rounded text-xs uppercase tracking-wider">Free</span>
                  </div>
                </div>
                
                <div className="mb-8 font-heading">
                  <div className="flex justify-between items-end">
                    <span className="font-extrabold text-gray-900 text-lg">Total</span>
                    <span className="font-black text-brand-green text-3xl tracking-tight">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-green text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center hover:bg-green-700 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-lg uppercase tracking-widest text-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'Processing...' : <><ShieldCheck size={18} className="mr-2" /> Place Order Securely</>}
                </button>
              </div>
            </motion.div>
            
          </form>
        </div>
      </div>
    </>
  );
}
