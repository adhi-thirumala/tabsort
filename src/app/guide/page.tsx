'use client';

import { motion } from 'framer-motion';

export default function GuidePage() {
  return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center overflow-y-auto pt-6 pb-12">
        <motion.div
          className="prose prose-lg dark:prose-invert max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">TabSort Documentation</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Learn how to use TabSort to efficiently create judge preference lists for debate tournaments.
          </p>
          <h2 className="text-3xl font-bold mt-12 mb-6">User Instructions</h2>

          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4">Data Acquisition</h3>
            <p>
              To begin the process, navigate to Tabroom and access the tournament for which preferences are to be established. There are multiple methods for obtaining the requisite judge information, each resulting in slightly different file formats. The recommended procedure is as follows: locate the "Judges" section within the tournament interface and select the Excel-format export option. This action will initiate the download of a file with the <code>.csv</code> extension. Please note that files with a <code>.pdf</code> extension are not compatible with this application. The downloaded CSV file will contain the comprehensive list of judges available for preference ranking.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4">Sorting Procedure</h3>
            <p>
              Access the sorting interface by selecting the "Sort" option in the navigation menu or via the designated button on the main page. Import the previously downloaded file either through the drag-and-drop functionality or by utilizing the file selection dialog. Upon successful file import, the application will present a series of binary comparisons between judges. Continue making these comparative selections until the algorithm has collected sufficient information to establish a complete ordinal ranking.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4">Results Visualization</h3>
            <p>
              Upon completion of the sorting process, the application will display the final judge rankings. A toggle control is provided at the top of the results interface, allowing users to alternate between viewing judges in their ranked order or in alphabetical sequence. Additionally, functionality is provided to export these results in CSV format for both ordering systems, facilitating future reference and utilization.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4">Integration with Tabroom</h3>
            <p>
              For optimal efficiency when transferring preferences to the Tabroom platform, it is recommended to utilize the alphabetical sorting view. This can be accessed either directly within the application interface or by downloading the alphabetically sorted CSV file. Simultaneously, arrange the judges alphabetically by first name within the Tabroom interface. This parallel organization facilitates rapid and accurate input of numerical rankings into the Tabroom system.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h3 className="text-xl font-bold mb-4">Bug Reports</h3>
            <p>
              For bug reports, contact me at the information given on my personal website which you can find in the <u><a href="/tabsort/about" className="text-primary hover:underline font-medium">About</a></u> section!
            </p>
          </div>
        </motion.div>
      </div>
  );
}
