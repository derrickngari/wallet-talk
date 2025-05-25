import React from 'react'
import { easeOut, motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const AnimatedSection = ({ children, direction = 'left', delay = 0}) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2
    })

    const variants = {
        hidden: {
            opacity: 0,
            x: direction === 'left' ? -50 : 50,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                delay,
            },
        },
    }
  return (
    <motion.div
        ref={ref}
        initial='hidden'
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
    >
        {children}
    </motion.div>
  )
}

export default AnimatedSection