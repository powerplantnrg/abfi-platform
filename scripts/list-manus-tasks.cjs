/**
 * List recent Manus AI tasks
 */

require('dotenv').config();

const MANUS_API_URL = process.env.MANUS_API_URL || 'https://api.manus.ai/v1';
const MANUS_API_KEY = process.env.MANUS_API_KEY;

async function listTasks() {
  const response = await fetch(`${MANUS_API_URL}/tasks?limit=10`, {
    method: 'GET',
    headers: {
      'API_KEY': MANUS_API_KEY,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Manus API error: ${await response.text()}`);
  }

  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));

  const tasks = Array.isArray(data) ? data : (data.tasks || data.data || []);
  console.log('\nRecent Manus Tasks:');
  console.log('==================\n');

  if (!tasks.length) {
    console.log('No tasks found');
    return;
  }

  tasks.forEach(t => {
    console.log(`ID: ${t.id}`);
    console.log(`Title: ${t.title}`);
    console.log(`Status: ${t.status}`);
    console.log(`URL: ${t.url || 'N/A'}`);
    console.log(`Created: ${t.created_at}`);
    console.log('---\n');
  });
}

listTasks().catch(console.error);
