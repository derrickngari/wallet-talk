import { AnimatePresence, motion } from "framer-motion"
import logo from '../assets/wallet-talk-logo.svg'

const SplashScreen = ({ onComplete }) => {
  return (
    <AnimatePresence>
        <motion.div
            className='fixed inset-0 bg-gray-900 z-50 mx-auto flex flex-col items-center justify-center'
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onAnimationCommplete={onComplete}
            transition={{ duration: 1.2 }}
        >
            <motion.img
                src={logo}
                alt="WalletTalk logo"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1}}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 1}}
                className="w-32 h-32 items-center ml-18"
            />
            <p className="text-lg text-purple-600 font-semibold mt-2">WalletTalk</p>
        </motion.div>
    </AnimatePresence>
  )
}

export default SplashScreen