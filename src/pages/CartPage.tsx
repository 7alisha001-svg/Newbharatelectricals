import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <Helmet>
        <title>Shopping Cart | New Bharat Electricals</title>
      </Helmet>
      
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-[80vh] py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6 border border-gray-100">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any products to your cart yet.</p>
              <Link 
                to="/catalogue" 
                className="bg-brand-green text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg inline-block uppercase tracking-wide text-sm"
              >
                Continue Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-2/3"
              >
                <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white">
                  <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 hidden md:flex font-bold text-gray-500 uppercase tracking-wider text-xs">
                    <div className="w-1/2">Product</div>
                    <div className="w-1/6 text-center">Price</div>
                    <div className="w-1/6 text-center">Quantity</div>
                    <div className="w-1/6 text-right">Subtotal</div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6 hover:bg-gray-50/30 transition-colors">
                        <div className="w-full md:w-1/2 flex items-center gap-4 sm:gap-6 relative">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="absolute sm:relative -top-2 sm:top-0 -right-2 sm:right-0 text-gray-300 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-2 rounded-full shadow-sm sm:shadow-none z-10"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 bg-center bg-contain bg-no-repeat shadow-sm" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                          <Link to={`/products/cat/${item.id}`} className="font-bold text-gray-900 hover:text-brand-green text-base sm:text-lg line-clamp-2 pr-6 sm:pr-0">{item.name}</Link>
                        </div>
                        
                        <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center text-gray-600 font-medium">
                          <span className="md:hidden">Price:</span>
                          ₹{item.price}
                        </div>
                        
                        <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center">
                           <span className="md:hidden text-gray-600 font-medium">Quantity:</span>
                           <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                              <button 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                           </div>
                        </div>
                        
                        <div className="w-full md:w-1/6 flex justify-between md:justify-end items-center font-black text-gray-900 text-lg">
                          <span className="md:hidden text-gray-600 font-medium text-base">Subtotal:</span>
                          ₹{(parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to="/catalogue" className="text-gray-500 hover:text-brand-green font-bold flex items-center inline-flex transition-colors uppercase tracking-wide text-sm bg-white px-6 py-3 rounded-xl border border-gray-200 hover:border-brand-green shadow-sm">
                    <ArrowLeft size={16} className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/3"
              >
                <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-32 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h2 className="text-xl font-heading font-extrabold text-gray-900 mb-6 uppercase tracking-wider">Cart Totals</h2>
                  
                  <div className="space-y-4 mb-8 text-sm md:text-base">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Subtotal</span>
                      <span className="font-bold text-gray-900">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <span className="text-gray-500 font-medium">Shipping</span>
                      <span className="font-bold text-brand-green text-xs uppercase tracking-wider bg-green-50 px-2 py-1 rounded">Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-end text-lg mb-1">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-black text-brand-green text-3xl tracking-tight">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-right">Inclusive of all taxes</p>
                  </div>
                  
                  <Link 
                    to="/checkout"
                    className="w-full bg-brand-green text-white font-bold py-4 rounded-xl flex justify-center hover:bg-green-700 transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-sm"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
