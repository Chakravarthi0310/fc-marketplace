'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrderStore } from '@/store/slices/orderStore';
import { paymentService } from '@/services/payment.service';
import { Loader2, ShieldCheck, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentPage() {
    const { orderId } = useParams() as { orderId: string };
    const router = useRouter();
    const { currentOrder, fetchOrderById, isLoading: orderLoading } = useOrderStore();
    const [initializing, setInitializing] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderById(orderId);
        }
    }, [orderId, fetchOrderById]);

    const handlePayment = useCallback(async () => {
        if (!currentOrder) return;

        try {
            setInitializing(true);
            const paymentData = await paymentService.createOrder(currentOrder._id);

            if ((paymentData as any).alreadyPaid) {
                toast.success('Order already paid!');
                router.push('/orders');
                return;
            }

            const options = {
                key: paymentData.razorpayKeyId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: 'FC Marketplace',
                description: `Order #${paymentData.orderNumber}`,
                order_id: paymentData.razorpayOrderId,
                handler: async function (rzpResponse: any) {
                    try {
                        setVerifying(true);
                        toast.loading('Verifying payment...');

                        await paymentService.verify(paymentData.paymentId, {
                            razorpay_order_id: rzpResponse.razorpay_order_id,
                            razorpay_payment_id: rzpResponse.razorpay_payment_id,
                            razorpay_signature: rzpResponse.razorpay_signature,
                        });

                        toast.dismiss();
                        toast.success('Payment successful!');
                        router.push('/orders');
                    } catch (err: any) {
                        toast.dismiss();
                        console.error('Verification error:', err);
                        setError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
                        setVerifying(false);
                    }
                },
                prefill: {
                    name: '', // Can be filled from user store
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#10b981',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error('Payment failed: ' + response.error.description);
            });
            rzp.open();
            setInitializing(false);
        } catch (err: any) {
            console.error('Payment initialization error:', err);
            setError(err.response?.data?.message || 'Failed to initialize payment');
            setInitializing(false);
        }
    }, [currentOrder, router]);

    useEffect(() => {
        if (currentOrder && initializing) {
            // Check if order is already paid
            if (currentOrder.status === 'PAID') {
                router.push('/orders');
                return;
            }
            handlePayment();
        }
    }, [currentOrder, handlePayment, initializing, router]);

    if (orderLoading || (initializing && !error) || verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900">
                    {verifying ? 'Verifying Payment...' : 'Initializing Secure Payment...'}
                </h2>
                <p className="text-gray-600 mt-2 text-center">Please do not close this window or refresh the page.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center border border-red-100">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setError(null);
                                setInitializing(true);
                                handlePayment();
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Try Again
                        </button>
                        <button
                            onClick={() => router.push('/orders')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition"
                        >
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                <ShieldCheck className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Securely</h2>
                <p className="text-gray-600 mb-8">
                    Your order <span className="font-bold text-gray-900">#{currentOrder?.orderNumber}</span> has been created.
                    Please complete the payment of <span className="font-bold text-green-600">₹{currentOrder?.totalAmount.toFixed(2)}</span>.
                </p>

                <button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                >
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                </button>
            </div>
        </div>
    );
}
