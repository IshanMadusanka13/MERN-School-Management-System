security-audit.js

const { exec } = require('child_process');
const fs = require('fs');

// Check for vulnerable dependencies
function checkDependencies() {
  console.log('🔍 Checking for vulnerable dependencies...');
  
  exec('npm audit --json', (error, stdout, stderr) => {
    if (error) {
      const auditResult = JSON.parse(stdout);
      
      if (auditResult.metadata.vulnerabilities.total > 0) {
        console.warn('⚠️  Vulnerabilities found:');
        console.warn(`   Critical: ${auditResult.metadata.vulnerabilities.critical}`);
        console.warn(`   High: ${audetResult.metadata.vulnerabilities.high}`);
        console.warn(`   Moderate: ${auditResult.metadata.vulnerabilities.moderate}`);
        
        // Log to security file
        fs.writeFileSync('security-audit.log', 
          `Security Audit: ${new Date().toISOString()}\n` +
          `Vulnerabilities found: ${JSON.stringify(auditResult.metadata.vulnerabilities, null, 2)}`
        );
      } else {
        console.log('✅ No vulnerabilities found');
      }
    }
  });
}