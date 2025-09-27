import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { handle, sig } = body;

    const requestBody = {
        handleContractPairs: [handle],
        requestValidity: {
            startTimestamp: sig.startTimestamp.toString(),
            durationDays: sig.durationDays.toString(),
        },
        contractsChainId: "11155111",
        contractAddresses: sig.contractAddresses,
        userAddress: sig.userAddress,
        signature: sig.signature,
        publicKey: sig.publicKey,
        extraData: "0x00",
    };

    const res = await fetch("https://relayer.testnet.zama.cloud/v1/user-decrypt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    const decryptedHandles = await res.json();


    return NextResponse.json({ decryptedHandles });
}

