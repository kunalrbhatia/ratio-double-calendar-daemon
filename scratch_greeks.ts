import brokerClient from './src/execution/brokerClient';
import sessionManager from './src/auth/session';
import instrumentManager from './src/instruments/instrumentManager';

async function main() {
  await sessionManager.login();
  await instrumentManager.loadInstruments();
  const expiries = instrumentManager.getExpiries('NIFTY');
  const expiryT1 = expiries[1];
  console.log('T1 Expiry:', expiryT1);
  const candidates = [];
  for (let strike = 23000; strike <= 25000; strike += 100) {
    const inst = instrumentManager.getInstrument('NIFTY', expiryT1, strike, 'PE');
    if (inst) candidates.push(inst.symboltoken);
  }
  const marketData = await brokerClient.getMarketDataBatch('NFO', candidates);
  for (let strike = 23000; strike <= 25000; strike += 100) {
    const inst = instrumentManager.getInstrument('NIFTY', expiryT1, strike, 'PE');
    if (inst) {
      const data = marketData.get(inst.symboltoken);
      console.log(`Strike: ${strike}, LTP: ${data?.ltp}`);
    }
  }
}

main().catch(console.error);
