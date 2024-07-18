import cron from 'node-cron';
import { exec } from 'child_process';
import path from 'path';

const scriptPath = path.join(__dirname, 'scripts', 'deleteExpiredDownloadVerificationRecords.ts');

cron.schedule('0 0 * * *', () => { // This schedules the job to run daily at midnight
  exec(`ts-node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script error output: ${stderr}`);
      return;
    }
    console.log(`Script output: ${stdout}`);
  });
});

console.log('Cron job scheduled to run daily at midnight');