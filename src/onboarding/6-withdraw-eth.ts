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

const component = '[IMX-WITHDRAW-ETH]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const user = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(privateKey).connect(provider),
  });

  log.info(component, 'Withdraw ETH...');

  const withrawId = await user.prepareWithdrawal({
      user: user.address,
      token: {
          type: ETHTokenType.ETH,
          data: {
              decimals: 18
          }
      },
      quantity: ethers.utils.parseEther("0.1")
  });

  log.info(component, "Withraw id; ", withrawId)

  const txid = await user.completeWithdrawal({
      starkPublicKey: user.starkPublicKey,
      token: {
          type: ETHTokenType.ETH,
          data: {
              decimals: 18
          }
      }
  })
  log.info(component, "withraw tx id: ", txid);
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});
