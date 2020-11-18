
//% block="Tick Events"
//% icon="\uf0e0"
//% color="#378273"
namespace tickevent {

    export class KeyValue {
        constructor(
            public key: string,
            public value: string | number
        ) { }
    }

    //% block="key $key value $value"
    //% value.shadow=text
    //% blockId=tickeventcreatekv
    //% weight=50
    export function createKV(key: string, value: string | number): KeyValue {
        return new KeyValue(key, value);
    }

    //% block="post tick event $tickData"
    //% blockId=tickeventpost
    //% tickData.shadow=lists_create_with
    //% tickData.defl=tickeventcreatekv
    //% weight=100
    export function post(tickData: KeyValue[]) {
        sendTick(tickData);
    }

    // List this as an identity function, so the call will get elided in hw compile
    //% shim=TD_ID
    function sendTick(tickData: KeyValue[]) {
        const tick: { [index: string]: string | number } = {};

        for (const data of tickData) {
            tick[data.key] = data.value;
        }

        const toSend = JSON.stringify(tick);
        const buf = Buffer.create(toSend.length);
        for (let i = 0; i < toSend.length; ++i) {
            buf[i] = toSend.charCodeAt(i);
        }

        control.simmessages.send("tick-event", buf, /** noBroadcast */ true);
    }
}