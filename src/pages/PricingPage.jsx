import { useState } from 'react'
import { useNavigate } from 'react-router'

const plans = [
        {
            name: 'Free',
            monthly: 0,
            yearly: 0,
            features: [
                'Up to 100 tranactions/month',
                'Basic charts & insights',
                '1 account & 1 budget',
                'Voive input (limited)',
            ],
            cta: 'Start for Free',
            navigateTo: '/',
            highlighted: false,
        },
        {
          name: 'Premium',
            monthly: 349,
            yearly: 3490,
            features: [
                'Unlimited transactions',
                'Advanced charts & exports',
                'Multiple accounts & budgets',
                'Voice input (full access)',
                'Smart budget alerts',
            ],
            cta: 'Upgrade to Premium',
            navigateTo: '/checkout',
            highlighted: true,  
        },
        {
            name: 'Pro',
            monthly: 799,
            yearly: 7990,
            features: [
            'All Premium features',
            'AI insights & trends',
            'File uploads & MPESA import',
            'Custom categories & themes',
            'Priority support',
            ],
            cta: 'Go Pro',
            navigateTo: '/checkout',
            highlighted: false,
        }
    ]

const PricingPage = () => {
    const navigate = useNavigate()
    const  [billingCycle, setBillingCycle] = useState('monthly')

    const formatKES = (value) => new Intl.NumberFormat('en-KE').format(value)

  return (
    <div className='bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
        <div className="max-w-5xl mx-auto text-center">
            <h2 className='text-3xl font-extrabold text-gray-900'>Choose the plan that fits your wallet</h2>
            <p className='mt-2 text-gray-400'>Start free and upgrade when you're ready to unlock the full power of WalletTalk.</p>

            {/* Billing Toggle */}
            <div className="mt-6 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-[#F59E0B]' : 'text-gray-500'}`}>
                    Monthly
                </span>
                <div 
                    className={`w-14 h-7 flex items-center bg-gray-800 rounded-full p-1 cursor-pointer ${
                        billingCycle === 'yearly' ? 'justify-end' : 'justify-start'
                    }`}
                    onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
                >
                    <div className='w-5 h-5 bg-purple-500 rounded-full shadow-md transition duration-300' />
                </div>
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-[#F59E0B]' : 'text-gray-500'}`}>
                    Yearly
                </span>
            </div>
        </div> 
        <div className="mt-12  grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={`rounded-xl shadow-lg p-6 bg-black/30 border border-gray-500/40 ${
                        plan.highlighted
                        ? 'border-purple-500 ring-1 ring-purple-500'
                        : 'border-gray-200'
                    }`}
                >
                    {plan.highlighted && (
                        <span className='inline-block px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-full mb-3'>
                            Best Value
                        </span>
                    )}

                    <h3 className='text-lg font-semibold text-gray-200 '>{plan.name}</h3>
                    <p className='mt-1 text-2xl font-bold text-purple-500'>
                        KES {formatKES(billingCycle === 'monthly' ? plan.monthly : plan.yearly)}
                        <span className="text-sm font-normal text-gray-500">
                            /{billingCycle}
                        </span>
                    </p>

                <ul className='mt-4 space-y-2 text-sm text-gray-600'>        
                    {plan.features.map((feature, i) => (
                        <li key={i} className='flex items-center'>
                           ✅ <span className='ml-2'>{feature}</span>
                        </li>
                    ))}
                </ul>
                <button 
                    className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-5'
                    onClick={() => navigate(plan.navigateTo)}
                    role='button'
                >
                    {plan.cta}
                </button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PricingPage