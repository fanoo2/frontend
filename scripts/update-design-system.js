
#!/usr/bin/env node

/**
 * Script to update @fanno/design-system to the latest version
 */

const { execSync } = require('child_process');

function updateDesignSystem() {
  console.log('🔍 Checking for @fanno/design-system updates...');
  
  try {
    // Get current version
    const currentVersion = execSync('npm list @fanno/design-system --depth=0 --json', { encoding: 'utf8' });
    const current = JSON.parse(currentVersion).dependencies['@fanno/design-system'].version;
    
    // Get latest version
    const latestVersion = execSync('npm view @fanno/design-system version', { encoding: 'utf8' }).trim();
    
    console.log(`Current version: ${current}`);
    console.log(`Latest version: ${latestVersion}`);
    
    if (current !== latestVersion) {
      console.log('📦 Updating @fanno/design-system...');
      execSync(`npm install @fanno/design-system@${latestVersion}`, { stdio: 'inherit' });
      console.log('✅ Design system updated successfully!');
    } else {
      console.log('✅ Design system is already up to date!');
    }
    
  } catch (error) {
    console.error('❌ Error updating design system:', error.message);
    process.exit(1);
  }
}

updateDesignSystem();
