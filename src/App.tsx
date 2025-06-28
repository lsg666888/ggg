import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

import lsgTokenAbi from './abi/lsgToken.json';
import goldTokenAbi from './abi/goldToken.json';
import feedTokenAbi from './abi/feedToken.json';
import cowFarmGameAbi from './abi/cowFarmGame.json';
import cowNftAbi from './abi/cowNft.json';
import lsgrewardDistributorAbi from './abi/lsgrewardDistributor.json';

const contractAddresses = {
  lsgToken: '0xc926c05eac192418a3a29e41c38197dffcd9b4ab',
  goldToken: '0x7bd46887eabd44bf2c4a49cf2e94cdc4f8f2fde4',
  feedToken: '0x7986612ff4bb3f65c112eb3fbc68d4ae59e29f62',
  cowNFT: '0x499a78e431018f2d5301b4a91d026e787bf62fa2',
  cowFarmGame: '0xd603388720ea15ce64eaf5321d42e0b1ec8e189c',
  lsgRewardDistributor: '0xe7a2f227174066eba05ea551e12a3a02d308105b',
};

const App = () => {
  const [account, setAccount] = useState('');
  const [balances, setBalances] = useState({ lsg: '0', gold: '0', feed: '0' });
  const [inviteLink, setInviteLink] = useState('');
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) return toast.error('请安装钱包');
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);
    const accs = await provider.send('eth_requestAccounts', []);
    const signerAddr = accs[0];
    setAccount(signerAddr);
    loadBalances(signerAddr, provider);
    setInviteLink(`${window.location.origin}?inviter=${signerAddr}`);
  };

  const loadBalances = async (signerAddr, provider) => {
    const lsg = new ethers.Contract(contractAddresses.lsgToken, lsgTokenAbi, provider);
    const gold = new ethers.Contract(contractAddresses.goldToken, goldTokenAbi, provider);
    const feed = new ethers.Contract(contractAddresses.feedToken, feedTokenAbi, provider);

    const lsgBal = await lsg.balanceOf(signerAddr);
    const goldBal = await gold.balanceOf(signerAddr);
    const feedBal = await feed.balanceOf(signerAddr);

    setBalances({
      lsg: ethers.formatEther(lsgBal),
      gold: ethers.formatEther(goldBal),
      feed: ethers.formatEther(feedBal)
    });
  };

  useEffect(() => {
    const inviter = new URLSearchParams(window.location.search).get('inviter');
    if (inviter) {
      console.log('来自邀请人：', inviter);
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-yellow-300 p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4 text-center">🧀 加密牧场 CryptoRanch</h1>

      {!account && (
        <button onClick={connectWallet} className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
          🔑 连接钱包
        </button>
      )}

      {account && (
        <div className="bg-neutral-900 p-4 rounded-lg text-sm space-y-2">
          <p>💰 我的资产：</p>
          <ul className="pl-4 list-disc">
            <li>LSG：{balances.lsg}</li>
            <li>GGG（金）：{balances.gold}</li>
            <li>FGG（饲料）：{balances.feed}</li>
          </ul>
          <div>
            📢 我的邀请链接：
            <div className="bg-black border border-yellow-600 text-yellow-300 rounded p-1 break-all">
              {inviteLink}
            </div>
            <button
              className="mt-1 px-3 py-1 bg-yellow-600 text-black text-xs rounded hover:bg-yellow-500"
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                toast.success('邀请链接已复制');
              }}
            >复制链接</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
