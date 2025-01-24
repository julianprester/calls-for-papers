import { readFileSync, writeFileSync } from 'fs';

// Read and parse the JSON file
const calls = JSON.parse(readFileSync('./www/_data/calls.json', 'utf-8'));

const now = new Date();

// Process each call
calls.forEach(call => {
    if (call.active) {
        delete call.gracePeriod;
    }
    if (call.gracePeriod) {
        call.gracePeriod = (new Date(new Date(now).setDate(now.getDate() + 30))).toISOString()
    }
});

// Write the modified data back to the file
writeFileSync('./www/_data/calls.json', JSON.stringify(calls, null, 2));

// console.log('Migration reverted successfully');
