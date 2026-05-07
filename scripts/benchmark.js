/**
 * TradeNexus - Load Testing & Performance Benchmarking Script
 * This script simulates concurrent traffic to the API Gateway to measure system performance.
 */

const http = require('http');

const GATEWAY_URL = 'http://localhost:4000';
const ENDPOINT = '/health';
const CONCURRENT_REQUESTS = 50;

console.log(`\n🚀 Starting Load Test on ${GATEWAY_URL}${ENDPOINT}`);
console.log(`📊 Simulating ${CONCURRENT_REQUESTS} concurrent health checks...\n`);

let completed = 0;
let successCount = 0;
let failCount = 0;
let totalLatency = 0;

const startTest = Date.now();

for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    const requestStart = Date.now();
    
    http.get(`${GATEWAY_URL}${ENDPOINT}`, (res) => {
        const latency = Date.now() - requestStart;
        totalLatency += latency;
        
        if (res.statusCode === 200) {
            successCount++;
        } else {
            failCount++;
        }
        
        checkCompletion();
    }).on('error', (err) => {
        failCount++;
        checkCompletion();
    });
}

function checkCompletion() {
    completed++;
    if (completed === CONCURRENT_REQUESTS) {
        const totalDuration = Date.now() - startTest;
        const avgLatency = (totalLatency / CONCURRENT_REQUESTS).toFixed(2);
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Load Test Completed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`⏱️  Total Duration:     ${totalDuration}ms`);
        console.log(`⚡ Avg. Latency:      ${avgLatency}ms`);
        console.log(`📈 Success Rate:      ${((successCount / CONCURRENT_REQUESTS) * 100).toFixed(0)}%`);
        console.log(`❌ Failed Requests:   ${failCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        if (failCount > 0) {
            console.log('💡 Note: Ensure your Docker containers are running (docker compose up)');
        }
    }
}
