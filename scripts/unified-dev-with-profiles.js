#!/usr/bin/env node

const { spawn } = require('child_process');
const PortManager = require('./port-manager');
const fs = require('fs');
const path = require('path');

class UnifiedDevWithProfiles {
  constructor() {
    this.portManager = new PortManager();
    this.processes = new Map();
    this.isShuttingDown = false;
  }

  async start() {
    console.log('🚀 === GAMESTRINGER DEV WITH PROFILES ===');
    
    try {
      // 1. Sincronizza le porte
      console.log('📡 Sincronizzazione porte...');
      const port = await this.portManager.synchronizePorts();
      this.portManager.exportEnvironmentVariables(port);
      
      // 2. Verifica che il sistema profili sia integrato
      await this.verifyProfilesIntegration();
      
      // 3. Avvia Next.js
      console.log('🌐 Avvio Next.js con sistema profili...');
      await this.startNextJs(port);
      
      // 4. Attendi che Next.js sia pronto
      console.log('⏳ Attesa avvio Next.js...');
      await this.waitForNextJs(port);
      
      // 5. Avvia Tauri
      console.log('🦀 Avvio Tauri...');
      await this.startTauri();
      
      // 6. Setup gestione segnali
      this.setupSignalHandlers();
      
      console.log('✅ === SISTEMA COMPLETO AVVIATO ===');
      console.log(`🌐 Frontend: http://localhost:${port}`);
      console.log(`🦀 Desktop App: Tauri avviato`);
      console.log(`👤 Sistema Profili: Integrato`);
      console.log('📝 Premi Ctrl+C per fermare tutto');
      
    } catch (error) {
      console.error(`❌ Errore avvio: ${error.message}`);
      await this.shutdown();
      process.exit(1);
    }
  }

  async verifyProfilesIntegration() {
    console.log('🔍 Verifica integrazione sistema profili...');
    
    // Verifica che ProfileManager sia in main.rs
    const mainRsPath = path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs');
    if (fs.existsSync(mainRsPath)) {
      const mainRsContent = fs.readFileSync(mainRsPath, 'utf8');
      if (mainRsContent.includes('ProfileManagerState') && 
          mainRsContent.includes('commands::profiles::')) {
        console.log('✅ ProfileManager integrato in main.rs');
      } else {
        throw new Error('ProfileManager non trovato in main.rs');
      }
    }
    
    // Verifica che ProfileWrapper sia in layout.tsx
    const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
    if (fs.existsSync(layoutPath)) {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');
      if (layoutContent.includes('ProfileWrapper')) {
        console.log('✅ ProfileWrapper integrato in layout.tsx');
      } else {
        throw new Error('ProfileWrapper non trovato in layout.tsx');
      }
    }
    
    console.log('✅ Sistema profili verificato');
  }

  async startNextJs(port) {
    return new Promise((resolve, reject) => {
      const nextProcess = spawn('npm', ['run', 'dev:simple'], {
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true,
        env: {
          ...process.env,
          PORT: port.toString(),
          NEXT_PUBLIC_PORT: port.toString(),
          NODE_ENV: 'development'
        }
      });

      this.processes.set('next', nextProcess);

      let output = '';
      
      nextProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        // Mostra output con prefisso
        text.split('\n').forEach(line => {
          if (line.trim()) {
            console.log(`[NEXT] ${line}`);
          }
        });
        
        // Controlla se Next.js è pronto
        if (text.includes('Ready') || text.includes('started server') || text.includes(`localhost:${port}`)) {
          resolve();
        }
      });

      nextProcess.stderr.on('data', (data) => {
        const text = data.toString();
        console.error(`[NEXT ERROR] ${text}`);
      });

      nextProcess.on('error', (error) => {
        reject(new Error(`Errore avvio Next.js: ${error.message}`));
      });

      nextProcess.on('exit', (code) => {
        if (!this.isShuttingDown) {
          console.log(`[NEXT] Processo terminato con codice ${code}`);
          if (code !== 0) {
            reject(new Error(`Next.js terminato con errore: ${code}`));
          }
        }
      });

      // Timeout di sicurezza (180s per prima compilazione)
      setTimeout(() => {
        if (this.processes.has('next')) {
          // Non rifiutare se il processo è attivo
        }
      }, 180000);
    });
  }

  async waitForNextJs(port, maxAttempts = 90) {
    const http = require('http');
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await new Promise((resolve, reject) => {
          const req = http.get(`http://localhost:${port}`, (res) => {
            resolve();
          });
          
          req.on('error', reject);
          req.setTimeout(3000, () => {
            req.destroy();
            reject(new Error('Timeout'));
          });
        });
        
        console.log(`✅ Next.js risponde su porta ${port}`);
        return;
      } catch (error) {
        if (i % 5 === 0) {
          console.log(`⏳ In attesa di Next.js (${i * 2}s)...`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Next.js non risponde dopo 180 secondi');
  }

  async startTauri() {
    return new Promise((resolve, reject) => {
      const tauriProcess = spawn('npx.cmd', ['tauri', 'dev'], {
        cwd: path.join(__dirname, '..'),
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true
      });

      this.processes.set('tauri', tauriProcess);

      tauriProcess.stdout.on('data', (data) => {
        const text = data.toString();
        text.split('\n').forEach(line => {
          if (line.trim()) {
            console.log(`[TAURI] ${line}`);
          }
        });
        
        // Tauri è pronto quando mostra il messaggio di build completato
        if (text.includes('Finished') || text.includes('App listening')) {
          resolve();
        }
      });

      tauriProcess.stderr.on('data', (data) => {
        const text = data.toString();
        // Filtra warning comuni di Tauri
        if (!text.includes('warning:') && !text.includes('Compiling')) {
          console.error(`[TAURI ERROR] ${text}`);
        }
      });

      tauriProcess.on('error', (error) => {
        reject(new Error(`Errore avvio Tauri: ${error.message}`));
      });

      tauriProcess.on('exit', (code) => {
        if (!this.isShuttingDown) {
          console.log(`[TAURI] Processo terminato con codice ${code}`);
        }
      });

      // Risolvi dopo un breve delay per permettere a Tauri di avviarsi
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }

  setupSignalHandlers() {
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n🛑 Ricevuto ${signal}, chiusura in corso...`);
        await this.shutdown();
        process.exit(0);
      });
    });

    // Gestisce chiusura finestra
    process.on('exit', async () => {
      await this.shutdown();
    });
  }

  async shutdown() {
    if (this.isShuttingDown) return;
    
    this.isShuttingDown = true;
    console.log('🛑 Chiusura processi...');

    const shutdownPromises = [];

    // Chiudi tutti i processi
    for (const [name, process] of this.processes) {
      shutdownPromises.push(new Promise((resolve) => {
        console.log(`🛑 Chiusura ${name}...`);
        
        process.kill('SIGTERM');
        
        const timeout = setTimeout(() => {
          console.log(`⚠️  Forzatura chiusura ${name}...`);
          process.kill('SIGKILL');
          resolve();
        }, 3000);
        
        process.on('exit', () => {
          clearTimeout(timeout);
          console.log(`✅ ${name} chiuso`);
          resolve();
        });
      }));
    }

    await Promise.all(shutdownPromises);
    console.log('✅ Tutti i processi chiusi');
  }
}

// Avvia se chiamato direttamente
async function main() {
  const devServer = new UnifiedDevWithProfiles();
  await devServer.start();
}

if (require.main === module) {
  main().catch(error => {
    console.error(`❌ Errore fatale: ${error.message}`);
    process.exit(1);
  });
}

module.exports = UnifiedDevWithProfiles;