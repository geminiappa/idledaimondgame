body {
    margin: 0; background: #000; color: #fff;
    font-family: 'Inter', sans-serif; height: 100vh; overflow: hidden;
}

.mine-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000');
    background-size: cover; z-index: -2;
}

.glass-overlay {
    height: 100%; width: 100%; background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15px); display: flex; justify-content: center;
}

.app-container { width: 90%; max-width: 400px; padding: 20px 0; display: flex; flex-direction: column; }

.glass {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 20px;
}

.header h1 { font-size: 48px; margin: 0; color: #00d4ff; text-shadow: 0 0 15px rgba(0, 212, 255, 0.5); }
.user-chip { display: flex; align-items: center; gap: 8px; padding: 5px 12px; }
.avatar { width: 24px; border-radius: 50%; }

.tabs-nav { display: flex; gap: 8px; padding: 5px; margin-bottom: 20px; }
.tab-link { flex: 1; border: none; background: transparent; color: #fff; padding: 10px; border-radius: 15px; opacity: 0.5; font-weight: bold; }
.tab-link.active { background: rgba(255, 255, 255, 0.15); opacity: 1; }

.click-card { flex-grow: 1; display: flex; flex-direction: column; padding: 20px; }
.pickaxe-zone { flex-grow: 1; display: flex; align-items: center; justify-content: center; position: relative; }
.pickaxe-main { width: 200px; transition: 0.1s; cursor: pointer; }
.pickaxe-main img { width: 100%; filter: drop-shadow(0 0 20px #00d4ff); }
.pickaxe-main:active { transform: scale(0.9) rotate(-10deg); }

.small-mine { 
    background: rgba(255, 255, 255, 0.12) !important; 
    color: #fff !important; padding: 10px 25px !important; 
    font-size: 14px !important; border-radius: 15px !important; border: 1px solid rgba(255,255,255,0.2) !important;
}

.action-btn { border: none; font-weight: 800; cursor: pointer; }

.pop { position: absolute; color: #00d4ff; font-weight: 900; font-size: 28px; animation: fly 0.6s forwards; pointer-events: none; }
@keyframes fly { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-100px); } }

.menu-card { padding: 20px; }
.buy-btn { border: none; color: #00d4ff; padding: 8px 15px; font-weight: bold; }
.invite-btn { background: rgba(39, 174, 96, 0.2) !important; color: #27ae60 !important; border: 1px solid #27ae60 !important; padding: 15px; width: 100%; margin-top: auto; font-weight: bold; }

.ref-item { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 15px; margin-bottom: 8px; display: flex; justify-content: space-between; border-left: 3px solid #00d4ff; }





