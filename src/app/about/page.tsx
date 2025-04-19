'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center overflow-y-auto pt-6 pb-12">
        <motion.div
          className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">About TabSort</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive solution for establishing ordinal judge preferences in competitive debate circuits.
          </p>
          <h2 className="text-2xl font-bold mt-12 mb-4">Who?</h2>
          <p>
            Hi! I'm <u><a href='https://adhithirumala.com' className="text-primary hover:underline">Adhitya Thirumala</a></u>, the developer of this website. As a competitor and a coach, doing ordinal preferences at tournaments was my least favorite part of debate. I wanted to make a tool that would make it easier to do preferences while still keeping human input in the loop.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">Why?</h2>
          <p>
            The establishment of ordinal preferences presents significant challenges when organizing competitive debate tournaments. The process of ranking between dozens and hundreds of judges requires considerable time and cognitive resources. TabSort has been developed to address these challenges and streamline the preference submission process.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-4">How?</h2>
          <p>
            The application implements the Merge-Insertion sort algorithm (also known as the Ford-Johnson algorithm), which is specifically designed to minimize the number of comparisons required. Additional information regarding this algorithm can be accessed <u><a href="https://en.wikipedia.org/wiki/Merge-insertion_sort" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">here</a></u>.
          </p>
          <p>
            This approach significantly reduces cognitive burden by decomposing the complex task of establishing ordinal preferences into a series of simple binary comparisons. The result is a more efficient and less demanding process for coaches and debaters preparing for prestigious tournaments which implement such preference styles, such as the Tournament of Champions.
          </p>

         
        </motion.div>
      </div>
  );
}
