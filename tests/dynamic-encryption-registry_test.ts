import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure key managers can register in the system",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('dynamic-encryption-registry', 'register-key-manager', 
                [types.utf8('CryptoGuardian')], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Key manager can create an encryption key",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('dynamic-encryption-registry', 'register-key-manager', 
                [types.utf8('CryptoGuardian')], 
                deployer.address),
            Tx.contractCall('dynamic-encryption-registry', 'create-encryption-key', 
                [
                    types.utf8('primary-key'),
                    types.utf8('RSA-4096'),
                    types.some(types.buff('0x1234'))
                ], 
                deployer.address)
        ]);
        
        assertEquals(block.receipts.length, 2);
        block.receipts[1].result.expectOk().expectUint(1);
    }
});