import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ERC721TokenType, ImmutableXClient } from '@imtbl/imx-sdk';
import { requireEnvironmentVariable } from 'libs/utils';
import { ethers } from "ethers";

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-DEPOSIT-ERC721]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');

  const user = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(privateKey).connect(provider),
  });

  log.info(component, 'DEPOSIT ERC721...');

  let txid = await user.deposit({
      user: user.address,
      token: {
          type: ERC721TokenType.ERC721,
          data: {
              tokenId: "1",
              tokenAddress: "0xe6ae52590f0c66a0c9f07cb7c1dcf804b1be0bbc"
          }
      },
      quantity: ethers.BigNumber.from(1)
  })

  log.info(component, "Deposit erc721 token, txid: ", txid);
  

})().catch(e => {
  log.error(component, e);
  process.exit(1);
});