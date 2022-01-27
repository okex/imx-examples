import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ETHTokenType, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { ethers } from "ethers";

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-DEPOSIT-ETH]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const user = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(privateKey).connect(provider),
  });

  log.info(component, 'Deposit ETH...');

  let txid = await user.deposit({
      user: user.address,
      token: {
          type: ETHTokenType.ETH,
          data: {
              decimals: 18
          }
      },
      quantity: ethers.utils.parseEther("0.1")
  });

  log.info(component, "Deposit txid: ", txid);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
