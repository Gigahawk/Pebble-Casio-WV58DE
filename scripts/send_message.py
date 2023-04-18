import base64
from uuid import UUID
import json
import argparse
from libpebble2.communication import PebbleConnection
from libpebble2.services.appmessage import (
    AppMessageService,
    Int8, Int16, Int32, Uint8, Uint16, Uint32, ByteArray, CString
)
from pebble_tool.commands.base import PebbleTransportQemu

def main(args):
    port = args.port
    with open(args.json, "r") as f:
        msg = json.loads(f.read())

    print("Sending the following data to port %s" % port)
    print(msg)

    transport = PebbleTransportQemu.get_transport(
        argparse.Namespace(qemu="localhost:{}".format(port)))
    global pebble
    pebble = PebbleConnection(transport)
    pebble.connect()
    app_message = AppMessageService(pebble)
    pebble.run_async()

    tuples={}
    for t in msg['msg_data']:
        k=t['key']
        # Check key is an int otherwise convert (bug somewhere in the sender...)
        if isinstance(k, int)==False:
            k=int(k)
        if t['type']=='string':
            tuples[k]=CString(t['value'])
        elif t['type']=='int':
            widthmap = {
                1: Int8,
                2: Int16,
                4: Int32}
            length = t['length']
            tuples[k]=widthmap[length](int(t['value']))
        elif t['type']=='uint':
            widthmap = {
                1: Uint8,
                2: Uint16,
                4: Uint32}
            length = t['length']
            tuples[k]=widthmap[length](int(t['value']))
        elif t['type']=='bytes':
            b = base64.b64decode(t['value'])
            tuples[k]=ByteArray(b)
    app_message.send_message(UUID(msg['uuid']),tuples)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("json")
    parser.add_argument("port")
    args = parser.parse_args()
    main(args)
