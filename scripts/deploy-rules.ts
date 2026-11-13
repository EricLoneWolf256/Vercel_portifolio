import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let val = trimmed.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const projectId = env['FIREBASE_ADMIN_PROJECT_ID'];
const clientEmail = env['FIREBASE_ADMIN_CLIENT_EMAIL'];
const privateKeyRaw = env['FIREBASE_ADMIN_PRIVATE_KEY'].replace(/\\n/g, '\n');

// Read rules file
const rulesContent = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf-8');

async function getAccessToken(): Promise<string> {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKeyRaw,
    },
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const token = await auth.getAccessToken();
  if (!token) throw new Error('Failed to get access token');
  return token;
}

async function deployRules() {
  console.log('🔐 Getting access token...');
  const token = await getAccessToken();
  console.log('✅ Access token obtained');

  const body = JSON.stringify({
    rules: {
      files: [{ name: 'firestore.rules', content: rulesContent }],
    },
  });

  const url = `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`;

  console.log('📤 Creating ruleset...');
  const rulesetName: string = await new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const json = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(`Ruleset creation failed: ${JSON.stringify(json)}`));
          } else {
            resolve(json.name);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  console.log('✅ Ruleset created:', rulesetName);

  // Now release it
  const releaseUrl = `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`;
  const releaseBody = JSON.stringify({ name: `projects/${projectId}/releases/cloud.firestore`, rulesetName });

  console.log('🚀 Releasing ruleset...');
  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      releaseUrl,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(releaseBody),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const json = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(`Release failed: ${JSON.stringify(json)}`));
          } else {
            console.log('✅ Rules deployed successfully!');
            resolve();
          }
        });
      }
    );
    req.on('error', reject);
    req.write(releaseBody);
    req.end();
  });
}

deployRules().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
