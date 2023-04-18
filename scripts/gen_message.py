"""Generate a dummy appmessage to be sent to emulators"""

import json
from pprint import pprint

with open("package.json", "r") as f:
    package = json.load(f)

pebble = package["pebble"]
message_keys = pebble["messageKeys"]
uuid = pebble["uuid"]

setup_msg = {
    "inv": 0,  # Disable dark mode
    "showsec": 0,  # Always show seconds
    "datefmt": "usa",  # USA date format
    "battdgt": 0,  # Show battery icon instead of digits
    "showbatt": 10,  # Always show battery info
    "units": "c",  # Weather in Celsius
    "weather": 1,  # Show weather
    "showcond": 1,  # Show weather condition
}

weather_msg = {
    "w_temp": 5,
    "w_icon": "k",
    "w_cond": "overcast clouds"
}

def encode_msg(msg):
    """Encode a message for use with AppMsgBridge

    Args:
        msg (dict): keys should be strings matching messageKeys, values should
                    be either strings or int depending on the setting type

    Returns:
        str: single line JSON encoded string ready for use with AppMsgBridge
    """
    encoded_msg = {
        "uuid": uuid,
        "txid": "100", # Seems to be ok to  hardcode this
        "msg_data": []
    }
    print("Encoding:")
    pprint(msg)
    for key, val in msg.items():
        item = {}
        item["key"] = str(message_keys[key])
        item["value"] = str(val)
        if isinstance(val, str):
            item["length"] = 0
            item["type"] = "string"
        else:
            item["length"] = 4
            item["type"] = "int"
        encoded_msg["msg_data"].append(item)
    print("Encoded message:")
    pprint(encoded_msg)
    return json.dumps(encoded_msg)

def main():
    print("Generating messages for UUID %s" % uuid)
    print("Using the following messageKeys:")
    pprint(message_keys)
    print("Encoding setup message")
    with open("setup_sample.json", "w") as f:
        f.write(encode_msg(setup_msg))
    print("Encoding weather message")
    with open("weather_sample.json", "w") as f:
        f.write(encode_msg(weather_msg))

if __name__ == "__main__":
    main()
